import React, { useEffect } from "react";
import { Form, Modal } from "antd";
import { AddModalProps } from "@/shared/interfaces/common";
import { Order } from "../order.model";
import { formatFormData } from "@/shared/utils/date.util";
import { randomId } from "@/shared/utils/common.util";
import { OrderFormBody } from "./OrderFormBody";
import { OrderLineFormList } from "./OrderLineFormList";
import { SubmitButton } from "@/shared/components";
import { useProductStore } from "@/modules/product/product.store";

export const AddOrderModal: React.FC<AddModalProps<Order>> = ({
  open,
  loading,
  onClose,
  onAdd,
}) => {
  const [form] = Form.useForm<Order>();
  const { data: products = [] } = useProductStore({ page: 1, size: 100 });
  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        id: randomId(),
        lines: [],
      });
    }
  }, [open, form]);
  const onFinish = (values: Order) =>
    onAdd(formatFormData({ ...values, lines: values.lines || [] }));
  return (
    <Modal
      title="T?o ðõn hàng"
      open={open}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ top: 20 }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <OrderFormBody form={form} />
        <OrderLineFormList form={form} products={products} />
        <div className="flex justify-end mt-4">
          <SubmitButton loading={loading} onCancel={onClose} />
        </div>
      </Form>
    </Modal>
  );
};
