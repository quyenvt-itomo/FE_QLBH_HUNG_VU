import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getData, postData, postBlob } from "../../shared/api/apiClient";
import { apiEndpoint, HOST_URL } from "@/shared/constants/apiEndpoint";
import { useErrorState } from "@/shared/hooks/useErrorState";
import dayjs from "dayjs";
import type {
  ImportOptions,
  ImportJobResponse,
  ImportProgressData,
  ImportExcelResult,
  ExportOptions,
  TemplateResult,
} from "./excel.model";
import type { ApiResponse, BaseFailurePayload } from "@/shared/interfaces/api";
import { ImportJobStatus } from "./excel.enum";
import { importExcelJobStarted } from "@/shared/stores/excel.slice";

export const downloadFileWithFetch = async (url: string, filename: string) => {
  try {
    const deviceId = localStorage.getItem("deviceId") || "1";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const fullUrl = url.startsWith("http")
      ? url
      : (HOST_URL + url).replace("//uploads", "/uploads");

    const response = await fetch(fullUrl, {
      credentials: "include",
      headers: { "x-device-id": deviceId, "x-timezone": timeZone },
    });

    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const useExcelStore = () => {
  const dispatch = useDispatch();
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateResult | null>(null);
  const [jobProgress, setJobProgress] = useState<ImportProgressData | null>(null);
  const [jobResult, setJobResult] = useState<ImportExcelResult | null>(null);
  const [exporting, setExporting] = useState(false);

  const { notify, errors, onError } = useErrorState();

  const importProgress: ImportProgressData | null = jobProgress;
  const isCheckAdd = jobProgress?.status === ImportJobStatus.COMPLETED;
  const importResult: ImportExcelResult | null = isCheckAdd ? jobResult : null;

  // ===== GET TEMPLATE =====
  const getTemplateMutation = useMutation<
    ApiResponse<TemplateResult>,
    BaseFailurePayload,
    { entityType: string; branchId?: string }
  >({
    mutationFn: async ({ entityType, branchId }) => {
      const url = apiEndpoint.excel.template.replace(":entityType", entityType);
      const params: Record<string, any> = {};
      if (branchId) params.branchId = branchId;
      return await getData<TemplateResult>(url, params);
    },
  });

  const getTemplate = (entityType: string, branchId?: string) => {
    getTemplateMutation.mutate(
      { entityType, branchId },
      {
        onSuccess: async (res) => {
          const data = res.data || null;
          setTemplate(data);
          if (data?.url) {
            try {
              await downloadFileWithFetch(data.url, data.filename || "template.xlsx");
              notify("success", "Tải file mẫu thành công");
            } catch {
              notify("error", "Không thể tải file mẫu");
            }
          } else {
            notify("success", "Tải file mẫu thành công");
          }
        },
        onError,
      },
    );
  };

  // ===== IMPORT EXCEL =====
  const importExcelMutation = useMutation<
    ApiResponse<ImportJobResponse>,
    BaseFailurePayload,
    ImportOptions
  >({
    mutationFn: async (data: ImportOptions) => {
      return await postData<ImportJobResponse>(apiEndpoint.excel.import, data);
    },
  });

  const importExcel = (data: ImportOptions, onSuccess?: () => void) => {
    importExcelMutation.mutate(data, {
      onSuccess: (res) => {
        const jobId = res.data?.jobId;
        if (!jobId) {
          notify("error", "Không nhận được Job ID từ server");
          return;
        }
        setCurrentJobId(jobId);
        setJobProgress({ jobId, status: ImportJobStatus.PROCESSING, progress: 10 });

        // Dispatch to Redux → ExcelTaskPanel picks up polling
        dispatch(importExcelJobStarted({ response: res.data!, entityType: data.entityType }));
        // Also keep local polling for backward compat (importResult modal)
        pollJobProgress(jobId);

        onSuccess?.();
      },
      onError: (error) => {
        setCurrentJobId(null);
        onError(error);
      },
    });
  };

  const pollJobProgress = async (jobId: string) => {
    const maxAttempts = 120; // 2 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const res = await getData<any>(apiEndpoint.excel.importProgress.replace(":jobId", jobId));
        const data = res.data;
        if (!data) return;

        setJobProgress({
          jobId,
          status: data.status,
          progress: data.progress,
          totalRows: data.totalRows,
          successRows: data.successRows,
          errorRows: data.errorRows,
          skippedRows: data.skippedRows,
          errors: data.errors,
        });

        if (data.status === ImportJobStatus.COMPLETED || data.status === ImportJobStatus.FAILED) {
          setJobResult({
            totalRows: data.totalRows || 0,
            successRows: data.successRows || 0,
            errorRows: data.errorRows || 0,
            skippedRows: data.skippedRows || 0,
            errors: data.errors || [],
            data: data.data || [],
          });
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1500);
        }
      } catch {
        // Retry
        attempts++;
        if (attempts < maxAttempts) setTimeout(poll, 2000);
      }
    };

    poll();
  };

  // ===== EXPORT EXCEL =====
  const exportExcel = async (options: ExportOptions) => {
    setExporting(true);
    try {
      const filename =
        options.filename || `${options.entityType}_${dayjs().format("YYYY-MM-DD_HH-mm")}.xlsx`;

      const blob = await postBlob(apiEndpoint.excel.download, options);

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      notify("success", "Xuất Excel thành công");
    } catch (error: any) {
      notify("error", error?.message || "Không thể xuất file Excel");
    } finally {
      setExporting(false);
    }
  };

  // ===== RESET =====
  const reset = () => {
    setCurrentJobId(null);
    setJobProgress(null);
    setJobResult(null);
    setTemplate(null);
  };

  return {
    template,
    templateLoading: getTemplateMutation.isPending,
    exporting,
    importing: importExcelMutation.isPending,
    currentJobId,
    importProgress,
    importResult,
    isCheckAdd,
    getTemplate,
    importExcel,
    exportExcel,
    reset,
  };
};
