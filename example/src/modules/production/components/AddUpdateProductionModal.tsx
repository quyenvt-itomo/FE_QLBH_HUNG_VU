import React, { useEffect, useMemo } from "react";
import { Modal, Form, Input } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Production } from "../production.model";
import { randomId } from "@/shared/utils/common.util";
import { setFormCode, setFormErrors } from "@/shared/utils/form.util";
import SubmitButton from "@/shared/components/button/SubmitButton";
import Title from "@/shared/components/display/Title";

export const AddUpdateProductionModal: React.FC<AddUpdateModalProps<Production>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<Production>();
  const id = editData?.id || randomId();
  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);
  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }
    if (editData)
      form.setFieldsValue({ ...editData, additionalInfo: editData.additionalInfo ?? undefined });
    else {
      form.resetFields();
      setFormCode({ form, type: "production" });
    }
  }, [open, editData, form]);
  return (
    <Modal
      title={editData ? "Sửa Lệnh sản xuất" : "Thêm Lệnh sản xuất"}
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
