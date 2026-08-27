import React, { useEffect, useMemo, useRef } from "react";
import { Button, Progress, Typography, notification } from "antd";
import { CloseOutlined, ImportOutlined, ExportOutlined } from "@ant-design/icons";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { BASE_URL, apiEndpoint } from "../constants/apiEndpoint";
import { RootState } from "../stores";
import { ImportJobStatus, ExportJobStatus } from "../../modules/excel/excel.enum";
import type { ImportProgressData } from "../../modules/excel/excel.model";
import { downloadFile } from "../utils/file.util";
import {
  importExcelProgress,
  removeImportTask,
  removeExportTask,
} from "../stores/excel.slice";
import { openImportResultModal } from "../../modules/excel/components/ImportResult";

const MAX_VISIBLE_TASKS = 5;

// ============================================================
// Helpers
// ============================================================

const getImportPayload = (payload: any): ImportProgressData => {
  if (payload?.data?.jobId) return payload.data as ImportProgressData;
  return payload as ImportProgressData;
};

const ENTITY_LABELS: Record<string, string> = {
  partner: "Đối tác",
  employee: "Nhân viên",
  user: "Người dùng",
  product: "Hàng hóa",
  service: "Dịch vụ",
  job_position: "Vị trí",
  warehouse: "Kho",
  price_history: "Lịch sử giá",
};

// ============================================================
// Component
// ============================================================

const ExcelTaskPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { importTasks, exportTasks } = useSelector((state: RootState) => state.Excel, shallowEqual);

  const importStreamRef = useRef<Record<string, EventSource>>({});
  const completedRef = useRef<Set<string>>(new Set());
  const failedNotifiedRef = useRef<Set<string>>(new Set());

  // ===== SSE helpers =====

  const cleanupImportStream = (jobId: string) => {
    const source = importStreamRef.current[jobId];
    if (!source) return;
    source.close();
    delete importStreamRef.current[jobId];
  };

  // ===== Import SSE =====

  const startImportStream = (jobId: string) => {
    if (importStreamRef.current[jobId]) return;

    const source = new EventSource(
      `${BASE_URL}${apiEndpoint.excel.stream.replace(":jobId", jobId)}`,
      { withCredentials: true },
    );
    importStreamRef.current[jobId] = source;

    source.onmessage = (event) => {
      try {
        const progress = getImportPayload(JSON.parse(event.data));
        dispatch(importExcelProgress(progress));
        if (
          progress.status === ImportJobStatus.COMPLETED ||
          progress.status === ImportJobStatus.FAILED
        ) {
          cleanupImportStream(jobId);
        }
      } catch (error) {
        console.error("Không thể đọc dữ liệu SSE Excel:", error);
      }
    };

    source.onerror = () => {
      // EventSource tự reconnect khi mạng chập chờn. Nếu server đã đóng hẳn
      // stream thì dọn reference để không giữ connection cũ.
      if (source.readyState === EventSource.CLOSED) {
        cleanupImportStream(jobId);
      }
    };
  };

  // ===== Effects =====

  useEffect(() => {
    importTasks.forEach((task) => {
      if (task.status === ImportJobStatus.PENDING || task.status === ImportJobStatus.PROCESSING) {
        startImportStream(task.jobId);
      }
    });

    // Cleanup stale SSE connections
    const importIds = new Set(importTasks.map((t) => t.jobId));
    Object.keys(importStreamRef.current).forEach((id) => {
      if (!importIds.has(id)) cleanupImportStream(id);
    });
  }, [importTasks]);

  // Auto-download completed exports & notify failures
  useEffect(() => {
    exportTasks.forEach((task) => {
      if (
        task.status === ExportJobStatus.COMPLETED &&
        task.resultUrl &&
        !completedRef.current.has(task.jobId)
      ) {
        completedRef.current.add(task.jobId);
        downloadFile(task.resultUrl);
        dispatch(removeExportTask(task.jobId));
      }

      if (task.status === ExportJobStatus.FAILED && !failedNotifiedRef.current.has(task.jobId)) {
        failedNotifiedRef.current.add(task.jobId);
        notification.error({
          message: "Xuất Excel thất bại",
          description: task.message || "Không thể xuất file.",
        });
      }
    });

    importTasks.forEach((task) => {
      if (task.status === ImportJobStatus.FAILED && !failedNotifiedRef.current.has(task.jobId)) {
        failedNotifiedRef.current.add(task.jobId);
        notification.error({
          message: "Nhập Excel thất bại",
          description: task.message || "Không thể nhập file.",
        });
      }

      if (
        (task.status === ImportJobStatus.COMPLETED ||
          task.status === ImportJobStatus.FAILED) &&
        task.result &&
        !completedRef.current.has(task.jobId)
      ) {
        completedRef.current.add(task.jobId);
        openImportResultModal(task.result);
        // Auto-dismiss sau 6 giây
        setTimeout(() => dispatch(removeImportTask(task.jobId)), 6000);
      }
    });

    // Auto-dismiss completed exports
    exportTasks.forEach((task) => {
      if (
        task.status === ExportJobStatus.COMPLETED &&
        !completedRef.current.has(`export-${task.jobId}`)
      ) {
        completedRef.current.add(`export-${task.jobId}`);
        setTimeout(() => dispatch(removeExportTask(task.jobId)), 6000);
      }
    });
  }, [dispatch, exportTasks, importTasks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.keys(importStreamRef.current).forEach(cleanupImportStream);
    };
  }, []);

  // ===== Render helpers =====

  const allTasks = useMemo(() => {
    const combined = [
      ...importTasks.map((t) => ({ ...t, _type: "import" as const })),
      ...exportTasks.map((t) => ({ ...t, _type: "export" as const })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return combined;
  }, [importTasks, exportTasks]);

  const visibleTasks = useMemo(() => allTasks.slice(0, MAX_VISIBLE_TASKS), [allTasks]);
  const hiddenCount = Math.max(0, allTasks.length - MAX_VISIBLE_TASKS);

  if (allTasks.length === 0) return null;

  // ===== Render =====

  return (
    <div className="fixed bottom-4 right-4 z-[1200] w-[380px] max-w-[calc(100vw-1rem)] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mb-2 flex items-center justify-between">
        <Typography.Text strong>Tiến trình Excel</Typography.Text>
        {hiddenCount > 0 && (
          <Typography.Text type="secondary">+{hiddenCount} yêu cầu</Typography.Text>
        )}
      </div>

      <div className="max-h-[300px] space-y-2 overflow-y-auto">
        {visibleTasks.map((task) => {
          const isImport = task._type === "import";
          const isFailed =
            task.status === ImportJobStatus.FAILED || task.status === ExportJobStatus.FAILED;
          const isCompleted =
            task.status === ImportJobStatus.COMPLETED || task.status === ExportJobStatus.COMPLETED;

          const statusText =
            task.status === ImportJobStatus.PENDING || task.status === ExportJobStatus.PENDING
              ? "Đang chờ"
              : task.status === ImportJobStatus.PROCESSING ||
                  task.status === ExportJobStatus.PROCESSING
                ? "Đang xử lý"
                : isCompleted
                  ? "Hoàn tất"
                  : "Thất bại";

          return (
            <div
              key={`${task._type}-${task.jobId}`}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {isImport ? (
                      <ImportOutlined className="text-blue-500" />
                    ) : (
                      <ExportOutlined className="text-green-500" />
                    )}
                    <Typography.Text className="block truncate text-sm font-medium">
                      {isImport ? "Nhập" : "Xuất"}{" "}
                      {ENTITY_LABELS[task.entityType as string] || task.entityType}
                    </Typography.Text>
                  </div>
                  <Typography.Text type="secondary" className="text-xs">
                    {statusText}
                    {task.message && ` — ${task.message}`}
                  </Typography.Text>
                </div>
                {(isFailed || isCompleted) && (
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() =>
                      isImport
                        ? dispatch(removeImportTask(task.jobId))
                        : dispatch(removeExportTask(task.jobId))
                    }
                  />
                )}
              </div>

              <Progress
                percent={Math.round(task.progress || 0)}
                size="small"
                status={isFailed ? "exception" : isCompleted ? "success" : "active"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { ExcelTaskPanel };
