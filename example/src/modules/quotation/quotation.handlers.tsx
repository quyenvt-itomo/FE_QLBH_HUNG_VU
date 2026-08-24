import { App, Form, Input } from "antd";
import { Quotation } from "./quotation.model";
import { HandlersInput } from "@/shared/interfaces/common";
import Label from "@/shared/components/display/Label";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";
import { EntityType, FileCategory } from "@/shared/constants/enum";
import { deletePendingFiles } from "@/shared/utils/file.util";

export function useQuotationHandlers({
  create,
  update,
  remove,
  getById,
  setOpen,
  setOpenDetail,
  setRowData,
  approve,
  reject,
  customerApprove,
  customerReject,
}: HandlersInput<Quotation> & {
  customerApprove?: (id: string) => Promise<any>;
  customerReject?: (id: string, rejectReason: string) => Promise<any>;
}) {
  const { modal } = App.useApp();
  const [rejectForm] = Form.useForm<any>();

  const handleOpenDetail = (record: Quotation) => {
    if (!!getById) {
      getById(record.id, {
        onSuccess: (data) => {
          if (!data) return;
          setRowData(data);
          if (setOpenDetail) setOpenDetail(true);
          else setOpen?.(true);
        },
      });
    } else {
      setRowData(record);
      if (setOpenDetail) setOpenDetail(true);
      else setOpen?.(true);
    }
  };

  const handleOpenAdd = create
    ? () => {
        setRowData(undefined);
        setOpen?.(true);
      }
    : undefined;

  const handleOpenEdit = update
    ? (record: Quotation) => {
        getById?.(record.id, {
          onSuccess: (data) => {
            if (!data) return;
            setRowData(data);
            setOpen?.(true);
          },
        });
      }
    : undefined;

  const handleDelete = remove
    ? (record: Quotation) => {
        modal.confirm({
          centered: true,
          title: "Xóa báo giá",
          content: "Bạn có chắc muốn xóa báo giá này?",
          okText: "Xóa",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: () => remove(record.id),
        });
      }
    : undefined;

  const handleApprove = approve
    ? (record: Quotation) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Duyệt báo giá",
          content: (
            <div className="flex flex-col">
              <span>Bạn có chắc muốn duyệt báo giá này?</span>
              <div className="flex flex-col mt-2">
                <Label title="Tài liệu bổ sung" />
                <FileUploadBox
                  oId={id}
                  entity={EntityType.QUOTATION}
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
    ? (record: Quotation) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Từ chối báo giá",
          content: (
            <Form form={rejectForm} layout="vertical">
              <div className="mb-3">Bạn có chắc muốn từ chối báo giá này?</div>
              <Form.Item
                name="reason"
                label="Lý do từ chối"
                rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
              >
                <Input.TextArea rows={3} maxLength={500} placeholder="Nhập lý do từ chối..." />
              </Form.Item>
            </Form>
          ),
          okText: "Từ chối",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: async () => {
            const values = await rejectForm.validateFields();
            await reject(id, values.reason);
          },
          onCancel: () => {
            rejectForm.resetFields();
          },
        });
      }
    : undefined;

  const handleCustomerApprove = customerApprove
    ? (record: Quotation) => {
        modal.confirm({
          centered: true,
          title: "Khách hàng duyệt báo giá",
          content: (
            <div className="flex flex-col">
              <span>Xác nhận khách hàng đã duyệt báo giá này ?.</span>
              <span className="text-gray-500">Hệ thống sẽ tự động tạo đơn hàng.</span>
            </div>
          ),
          okText: "Xác nhận",
          okButtonProps: { type: "primary" },
          cancelText: "Hủy",
          onOk: () => customerApprove(record.id),
        });
      }
    : undefined;

  const handleCustomerReject = customerReject
    ? (record: Quotation) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Khách hàng từ chối báo giá",
          content: (
            <Form form={rejectForm} layout="vertical">
              <div className="mb-3">Xác nhận khách hàng từ chối báo giá này?</div>
              <Form.Item
                name="reason"
                label="Lý do từ chối"
                rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
              >
                <Input.TextArea rows={3} maxLength={500} placeholder="Nhập lý do từ chối..." />
              </Form.Item>
            </Form>
          ),
          okText: "Xác nhận",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: async () => {
            const values = await rejectForm.validateFields();
            await customerReject(id, values.reason);
          },
          onCancel: () => {
            rejectForm.resetFields();
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
    handleApprove,
    handleReject,
    handleCustomerApprove,
    handleCustomerReject,
    handleEditFromDetail,
  };
}
