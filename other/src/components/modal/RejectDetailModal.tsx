import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

interface RejectDetailModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
  title?: string;
}

const RejectDetailModal: React.FC<RejectDetailModalProps> = ({
  open,
  onCancel,
  onConfirm,
  title = "Lý do từ chối",
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onConfirm(values.reason.trim());
      form.resetFields();
    } catch (error) {}
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okText="Xác nhận"
      cancelText="Hủy"
      title={title}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="reason"
          label="Lý do"
          rules={[{ required: true, message: "Vui lòng nhập lý do từ chối." }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập lý do từ chối" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RejectDetailModal;
