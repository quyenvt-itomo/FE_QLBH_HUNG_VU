import React, { useEffect } from "react";
import { Form, Input, Modal, Switch } from "antd";
import { SubmitButton } from "@/shared";
import { Label } from "@/shared";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { setFormErrors } from "@/shared/utils/form.util";
import { randomId } from "@/shared/utils/common.util";
import { RoleSelect } from "@/modules/role";
import { User } from "../user.model";

export const AddUpdateModal: React.FC<AddUpdateModalProps<User>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<User>();
  const id = editData?.id || randomId();

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);

  useEffect(() => {
    if (open) form.setFieldsValue((editData || { isActive: true }) as any);
    else form.resetFields();
  }, [editData, form, open]);

  const submit = async (values: User) => {
    const payload = { ...values, id, tempId: id };
    editData ? onEdit?.(payload) : onAdd?.(payload);
  };

  return (
    <Modal
      open={open}
      title={editData ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
      footer={null}
      onCancel={onClose}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="code" label={<Label title="Mã người dùng" required />} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label={<Label title="Tên người dùng" required />} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="username" label={<Label title="Tên đăng nhập" required />} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        {!editData && (
          <Form.Item name="password" label={<Label title="Mật khẩu" required />} rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item name="email" label="Email"><Input /></Form.Item>
        <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
        <Form.Item name="roleId" label="Vai trò"><RoleSelect /></Form.Item>
        <Form.Item name="isActive" label="Đang hoạt động" valuePropName="checked"><Switch /></Form.Item>
        <SubmitButton loading={loading} onCancel={onClose} />
      </Form>
    </Modal>
  );
};
