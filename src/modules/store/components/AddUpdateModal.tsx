import React, { useEffect } from "react";
import { Form, Input, Modal, Switch } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Store } from "../store.model";
import SubmitButton from "@/shared/components/button/SubmitButton";
export const StoreAddUpdateModal: React.FC<AddUpdateModalProps<Store>> = ({ open, editData, loading, onClose, onAdd, onEdit }) => {
  const [form] = Form.useForm<Store>();
  useEffect(() => { if (open) form.setFieldsValue(editData || ({ isActive: true } as Store)); else form.resetFields(); }, [editData, form, open]);
  return <Modal open={open} title={editData ? "Sửa cửa hàng" : "Thêm cửa hàng"} onCancel={onClose} footer={null} destroyOnClose><Form form={form} layout="vertical" onFinish={(values) => (editData ? onEdit?.({ ...editData, ...values }) : onAdd?.(values))}><Form.Item name="code" label="Mã" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="name" label="Tên cửa hàng" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="phone" label="Điện thoại"><Input /></Form.Item><Form.Item name="address" label="Địa chỉ"><Input /></Form.Item><Form.Item name="isActive" valuePropName="checked"><Switch /></Form.Item><SubmitButton loading={loading} onCancel={onClose} /></Form></Modal>;
};
