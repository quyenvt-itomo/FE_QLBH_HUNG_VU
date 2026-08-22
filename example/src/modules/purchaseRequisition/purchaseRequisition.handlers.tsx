import { App, Form, Input } from "antd";
import { PurchaseRequisition } from "./purchaseRequisition.model";
import { HandlersInput } from "@/shared/interfaces/common";
import Label from "@/shared/components/display/Label";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";
import { EntityFile, FileCategory } from "@/shared/constants/enum";
import { deletePendingFiles } from "@/shared/utils/file.util";

export function usePurchaseRequisitionHandlers({
  create,
  update,
  remove,
  cancel,
  getById,
  setOpen,
  setOpenDetail,
  setRowData,
  approve,
  reject,
}: HandlersInput<PurchaseRequisition>) {
  const { modal } = App.useApp();
  const [form] = Form.useForm<any>();

  const handleOpenDetail = (record: PurchaseRequisition) => {
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

  const handleOpenAdd = create
    ? () => {
        setRowData(undefined);
        setOpen?.(true);
      }
    : undefined;

  const handleOpenEdit = update
    ? (record: PurchaseRequisition) => {
        getById?.(record.id, {
          onSuccess: (data) => {
            if (!data) return;
            setRowData(data); // Use fetched detail (has lines), not list record
            setOpen?.(true);
          },
        });
      }
    : undefined;
  const handleDelete = remove
    ? (record: PurchaseRequisition) => {
        modal.confirm({
          centered: true,
          title: "Xóa phiếu đề nghị",
          content: "Bạn có chắc muốn xóa phiếu đề nghị này?",
          okText: "Xóa",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: () => remove(record.id),
        });
      }
    : undefined;

  const handleCancel = cancel
    ? (record: PurchaseRequisition) => {
        form.resetFields();
        modal.confirm({
          centered: true,
          title: "Hủy phiếu đề nghị",
          content: (
            <Form form={form} layout="vertical">
              <div className="mb-3">Bạn có chắc muốn hủy phiếu đề nghị này?</div>
              <Form.Item
                name="reason"
                label="Lý do hủy"
                rules={[{ required: true, message: "Vui lòng nhập lý do hủy" }]}
              >
                <Input.TextArea rows={3} maxLength={500} placeholder="Nhập lý do hủy..." />
              </Form.Item>
            </Form>
          ),
          okText: "Hủy phiếu đề nghị",
          okButtonProps: { danger: true },
          cancelText: "Đóng",
          onOk: async () => {
            const values = await form.validateFields();
            await cancel(record.id, values.reason);
          },
        });
      }
    : undefined;

  const handleApprove = approve
    ? (record: PurchaseRequisition) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Duyệt phiếu đề nghị",
          content: (
            <div className="flex flex-col">
              <span>Bạn có chắc muốn duyệt phiếu đề nghị này?</span>
              <div className="flex flex-col">
                <Label title="Tài liệu bổ sung" />
                <FileUploadBox
                  oId={id}
                  entity={EntityFile.PURCHASE_REQUISITION}
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
    ? (record: PurchaseRequisition) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Từ chối phiếu đề nghị",
          content: (
            <Form form={form} layout="vertical">
              <div className="mb-3">Bạn có chắc muốn từ chối phiếu đề nghị này?</div>
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
        });
      }
    : undefined;

  const handleEditFromDetail = update
    ? () => {
        setOpenDetail?.(false);
        setOpen?.(true);
      }
    : undefined;

  return {
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleCancel,
    handleEditFromDetail,
    handleApprove,
    handleReject,
  } as const;
}
