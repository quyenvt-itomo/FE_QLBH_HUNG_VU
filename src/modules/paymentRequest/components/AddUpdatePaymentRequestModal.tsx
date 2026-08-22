import React, { useEffect, useMemo } from "react";
import { Modal, Form, Input } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { PaymentRequest } from "../paymentRequest.model";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import SubmitButton from "@/shared/components/button/SubmitButton";
import Title from "@/shared/components/display/Title";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";

export const AddUpdatePaymentRequestModal: React.FC<AddUpdateModalProps<PaymentRequest>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<PaymentRequest>();
  const id = editData?.id || randomId();
  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);
  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }
    if (editData) form.setFieldsValue(parseFormDataDates(editData));
    else {
      form.resetFields();
    }
  }, [open, editData, form]);
  return (
    <Modal
      title={editData ? "Sửa Đề nghị thanh toán" : "Thêm Đề nghị thanh toán"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(v) => (editData ? onEdit?.({ ...v, id: editData.id }) : onAdd?.(v))}
      >
        <Title content="Thông tin chung" />
        <Form.Item name="code" label="Mã">
          <Input disabled />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={3} />
        </Form.Item>
        <div className="flex justify-end mt-4">
          <SubmitButton loading={loading} onCancel={onClose} />
        </div>
      </Form>
    </Modal>
  );
};
