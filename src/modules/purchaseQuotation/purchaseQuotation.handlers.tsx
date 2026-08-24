import { App, Form, Input, Checkbox } from "antd";
import { PurchaseQuotation } from "./purchaseQuotation.model";
import { HandlersInput } from "@/shared/interfaces/common";
import { Label } from "@/shared";
import { FileUploadBox } from "@/shared";
import { EntityType, FileCategory } from "@/shared/constants/enum";
import { deletePendingFiles } from "@/shared/utils/file.util";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { handleCopy } from "@/shared/utils/common.util";
import { FE_BASE_URL } from "@/shared/constants/apiEndpoint";
import { privateRoutesName, publicRoutesName } from "@/shared/constants/routerName";
import { checkPermission } from "@/shared/utils/permission.util";
import { useNavigate } from "react-router-dom";
import { generateDefaultPurchaseByQuotation } from "./purchaseQuotation.utils";

export function usePurchaseQuotationHandlers({
  getById,
  setOpen,
  setOpenDetail,
  setRowData,
  approve,
  reject,
}: HandlersInput<PurchaseQuotation>) {
  const { modal, message } = App.useApp();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const { currentStore, permissions } = useGlobalData();
  const canCreatePurchase = checkPermission(permissions, "purchase", "create");

  const handleOpenDetail = (record: PurchaseQuotation) => {
    if (!!getById) {
      getById(record.id, {
        onSuccess: (data) => {
          if (!data) return;
          setRowData(data);
          if (setOpenDetail) {
            setOpenDetail(true);
          } else {
            setOpen?.(true);
          }
        },
      });
    } else {
      setRowData(record);
      if (setOpenDetail) {
        setOpenDetail(true);
      } else {
        setOpen?.(true);
      }
    }
  };

  const handleApprove = approve
    ? (record: PurchaseQuotation) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Duyệt báo giá",
          content: (
            <div className="flex flex-col">
              <span>Bạn có chắc muốn duyệt báo giá này?</span>
              <div className="flex flex-col">
                <Label title="Tài liệu bổ sung" />
                <FileUploadBox
                  oId={id}
                  entity={EntityType.PURCHASE_REQUISITION}
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
    ? (record: PurchaseQuotation) => {
        const id = record.id;
        const hasSupplier = !!record.supplierId;
        const hasQuoter = !!record.quoterId;
        const supplierName = record.supplierSnapshot?.name || "này";

        modal.confirm({
          centered: true,
          title: "Từ chối báo giá",
          content: (
            <Form form={form} layout="vertical">
              <div className="mb-3">Bạn có chắc muốn từ chối báo giá này?</div>
              <Form.Item
                name="reason"
                label="Lý do từ chối"
                rules={[{ required: true, message: "Vui lòng nhập lý do từ chối" }]}
              >
                <Input.TextArea rows={3} maxLength={500} placeholder="Nhập lý do từ chối..." />
              </Form.Item>
              {!hasSupplier && (
                <Form.Item name="submitInfo" valuePropName="checked" className="mb-2">
                  <Checkbox>
                    {!hasQuoter
                      ? `Phát hiện NCC này chưa có trong danh sách NCC, bạn có muốn lưu lại thông tin NCC và người liên hệ này?`
                      : `Phát hiện người liên hệ này chưa có trong thông tin của NCC "${supplierName}", bạn có muốn lưu lại thông tin người liên hệ này?`}
                  </Checkbox>
                </Form.Item>
              )}
            </Form>
          ),
          okText: "Từ chối",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: async () => {
            const values = await form.validateFields();
            await reject(id, values.reason, values.submitInfo);
          },
        });
      }
    : undefined;

  const handleCopyLink = () => {
    if (!currentStore) return;
    const url = publicRoutesName.supplierQuotation.replace(":companyCode", currentStore.code);
    const fullUrl = `${FE_BASE_URL}${url}`;
    handleCopy(fullUrl, message);
  };

  const handleCreatePurchase = canCreatePurchase
    ? (record: PurchaseQuotation) => {
        getById?.(record.id, {
          onSuccess: (data) => {
            if (!data) return;

            const url = privateRoutesName.purchases.purchase;
            navigate(url, {
              state: {
                defaultCreateData: generateDefaultPurchaseByQuotation(data),
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
    handleCreatePurchase,
  } as const;
}
