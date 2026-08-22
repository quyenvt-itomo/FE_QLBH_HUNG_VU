import { App, Form, Input } from "antd";
import { ShippingPlan } from "./shippingPlan.model";
import { HandlersInput } from "@/shared/interfaces/common";
import Label from "@/shared/components/display/Label";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";
import { EntityFile, FileCategory } from "@/shared/constants/enum";

export function useShippingPlanHandlers({
  create,
  update,
  remove,
  getById,
  setOpen,
  setRowData,
  approve,
  reject,
}: HandlersInput<ShippingPlan>) {
  const { modal } = App.useApp();
  const [form] = Form.useForm<any>();

  const handleOpenAdd = create
    ? () => {
        setRowData(undefined);
        setOpen?.(true);
      }
    : undefined;

  const handleOpenEdit = update
    ? (record: ShippingPlan) => {
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
    ? (record: ShippingPlan) => {
        modal.confirm({
          centered: true,
          title: "Xóa phương án vận chuyển",
          content: "Bạn có chắc muốn xóa phương án vận chuyển này?",
          okText: "Xóa",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: () => remove(record.id),
        });
      }
    : undefined;

  const handleApprove = approve
    ? (record: ShippingPlan) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Duyệt phương án vận chuyển",
          content: (
            <div className="flex flex-col">
              <span>Bạn có chắc muốn duyệt phương án vận chuyển này?</span>
              <div className="flex flex-col mt-2">
                <Label title="Tài liệu bổ sung" />
                <FileUploadBox
                  oId={id}
                  entity={EntityFile.SHIPPING_PLAN}
                  category={FileCategory.DOCUMENT}
                />
              </div>
            </div>
          ),
          okText: "Duyệt",
          cancelText: "Hủy",
          onOk: () => approve(record.id),
        });
      }
    : undefined;

  const handleReject = reject
    ? (record: ShippingPlan) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Từ chối phương án vận chuyển",
          content: (
            <Form form={form} layout="vertical">
              <div className="mb-3">Bạn có chắc muốn từ chối phương án vận chuyển này?</div>
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

  return {
    handleOpenAdd,
    handleOpenEdit,
    handleDelete,
    handleApprove,
    handleReject,
  };
}
