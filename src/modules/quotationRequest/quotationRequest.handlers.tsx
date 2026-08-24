import { App, Form, Input, Checkbox } from "antd";
import { QuotationRequest } from "./quotationRequest.model";
import { HandlersInput } from "@/shared/interfaces/common";
import Label from "@/shared/components/display/Label";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";
import { EntityType, FileCategory } from "@/shared/constants/enum";
import { deletePendingFiles } from "@/shared/utils/file.util";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { FE_BASE_URL } from "@/shared/constants/apiEndpoint";
import { privateRoutesName, publicRoutesName } from "@/shared/constants/routerName";
import { handleCopy } from "@/shared/utils/common.util";
import { checkPermission } from "@/shared/utils/permission.util";
import { useNavigate } from "react-router-dom";
import { generateDefaultQuotationByRequest } from "./quotationRequest.utils";

export function useQuotationRequestHandlers({
  getById,
  setOpen,
  setOpenDetail,
  setRowData,
  approve,
  reject,
}: HandlersInput<QuotationRequest>) {
  const { modal, message } = App.useApp();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const { currentStore, permissions } = useGlobalData();
  const canCreateQuotation = checkPermission(permissions, "quotation", "create");

  const handleOpenDetail = (record: QuotationRequest) => {
    if (!!getById) {
      getById(record.id, {
        onSuccess: (data) => {
          if (!data) return;
          setRowData(data);
          setOpenDetail?.(true);
        },
      });
    } else {
      setRowData(record);
      setOpenDetail?.(true);
    }
  };

  const handleApprove = approve
    ? (record: QuotationRequest) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Duyệt yêu cầu báo giá",
          content: (
            <div className="flex flex-col">
              <span>Bạn có chắc muốn duyệt yêu cầu báo giá này?</span>
              <div className="flex flex-col mt-2">
                <Label title="Tài liệu bổ sung" />
                <FileUploadBox
                  oId={id}
                  entity={EntityType.QUOTATION_REQUEST}
                  category={FileCategory.DOCUMENT}
                />
              </div>
            </div>
          ),
          okText: "Duyệt",
          okButtonProps: { type: "primary" },
          cancelText: "Hủy",
          onOk: () => approve(id),
          onCancel: () => {
            deletePendingFiles(id);
          },
        });
      }
    : undefined;

  const handleReject = reject
    ? (record: QuotationRequest) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Từ chối yêu cầu báo giá",
          content: (
            <Form form={form} layout="vertical">
              <div className="mb-3">Bạn có chắc muốn từ chối yêu cầu báo giá này?</div>
              <Form.Item
                name="reason"
                label="Lý do từ chối"
                rules={[{ required: true, message: "Vui lòng nhập lý do từ chối" }]}
              >
                <Input.TextArea rows={3} maxLength={500} placeholder="Nhập lý do từ chối..." />
              </Form.Item>
            </Form>
          ),
          okText: "Từ chối",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: async () => {
            const values = await form.validateFields();
            await reject(id, values.reason);
          },
          onCancel: () => {
            form.resetFields();
          },
        });
      }
    : undefined;

  const handleCopyLink = () => {
    if (!currentStore) return;
    const url = publicRoutesName.quotationRequest.replace(":companyCode", currentStore.code);
    const fullUrl = `${FE_BASE_URL}${url}`;
    handleCopy(fullUrl, message);
  };

  const handleCreateQuotation = canCreateQuotation
    ? (record: QuotationRequest) => {
        getById?.(record.id, {
          onSuccess: (data) => {
            if (!data) return;

            const url = privateRoutesName.sales.quotation;
            navigate(url, {
              state: {
                defaultCreateData: generateDefaultQuotationByRequest(data),
              },
            });
          },
        });
      }
    : undefined;

  return {
    handleOpenDetail,
    handleApprove,
    handleReject,
    handleCopyLink,
    handleCreateQuotation,
  };
}
