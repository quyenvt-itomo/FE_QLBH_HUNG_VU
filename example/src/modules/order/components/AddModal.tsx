import React, { useEffect } from "react";
import { Form, Modal } from "antd";
import { AddModalProps } from "@/shared/interfaces/common";
import { Order } from "../order.model";
import { setFormCode } from "@/shared/utils/form.util";
import { formatFormData } from "@/shared/utils/date.util";
import { randomId } from "@/shared/utils/common.util";
import { OrderFormBody } from "./OrderFormBody";
import { OrderLineFormList } from "./OrderLineFormList";
import SubmitButton from "@/shared/components/button/SubmitButton";

export const AddOrderModal: React.FC<AddModalProps<Order>> = ({
  open,
  loading,
  onClose,
  onAdd,
}) => {
  const [form] = Form.useForm<Order>();
  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        id: randomId(),
        lines: [],
      });
      setFormCode({ form, type: "order" });
    }
  }, [open, form]);
  const onFinish = (values: Order) =>
    onAdd(formatFormData({ ...values, lines: values.lines || [] }));
  return (
    <Modal
      title="Tạo đơn hàng"
      open={open}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ top: 20 }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <OrderFormBody form={form} />
        <OrderLineFormList form={form} products={[]} />
        <div className="flex justify-end mt-4">
          <SubmitButton loading={loading} onCancel={onClose} />
        </div>
      </Form>
    </Modal>
  );
};
