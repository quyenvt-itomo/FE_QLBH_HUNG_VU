import React, { useEffect } from "react";
import { Button, Form, Modal } from "antd";
import { ProductGroupSelect } from "@/modules/attribute/components/Select";

interface ProductChangeGroupModalProps {
  open: boolean;
  productCount: number;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (groupId: string | null) => void;
}

export const ProductChangeGroupModal: React.FC<ProductChangeGroupModalProps> = ({
  open,
  productCount,
  loading = false,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm<{ groupId?: string }>();

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  return (
    <Modal
      title={`Đổi nhóm hàng (${productCount} sản phẩm)`}
      open={open}
      onCancel={onClose}
      maskClosable={false}
      centered
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Lưu
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onSubmit(values.groupId || null)}
        className="pt-4"
      >
        <Form.Item name="groupId" label="Nhóm hàng mới">
          <ProductGroupSelect allowClear placeholder="Chọn nhóm hàng (để trống để bỏ nhóm)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductChangeGroupModal;
