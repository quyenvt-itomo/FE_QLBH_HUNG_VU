import React, { useEffect } from "react";
import { Form, FormInstance, Input, Modal, Select, Switch } from "antd";
import SubmitButton from "@/shared/components/button/SubmitButton";
import Label from "@/shared/components/display/Label";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { Partner, PartnerType, partnerTypeOptions } from "../../partner.model";

export interface PartialProps {
  form: FormInstance<Partner>;
  editData?: Partner;
}

export const PartnerAddUpdateModal: React.FC<AddUpdateModalProps<Partner> & { defaultType?: PartnerType }> = ({
  open,
  editData,
  loading,
  errors,
  defaultType = PartnerType.CUSTOMER,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<Partner>();
  const id = editData?.id || randomId();
  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);
  useEffect(() => {
    if (open) form.setFieldsValue((editData || { type: defaultType, isOrganization: true, addresses: [], banks: [] }) as any);
    else form.resetFields();
  }, [defaultType, editData, form, open]);

  const submit = (values: Partner) => {
    const payload = { ...values, id, tempId: id };
    editData ? onEdit?.(payload) : onAdd?.(payload);
  };
  return (
    <Modal open={open} title={editData ? "Chỉnh sửa đối tác" : "Thêm đối tác"} footer={null} onCancel={onClose} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="type" label={<Label title="Loại đối tác" required />} rules={[{ required: true }]}>
          <Select options={partnerTypeOptions} />
        </Form.Item>
        <Form.Item name="code" label={<Label title="Mã đối tác" required />} rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="name" label={<Label title="Tên đối tác" required />} rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="email" label="Email"><Input /></Form.Item>
        <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
        <Form.Item name="taxCode" label="Mã số thuế"><Input /></Form.Item>
        <Form.Item name="isOrganization" label="Là tổ chức" valuePropName="checked"><Switch /></Form.Item>
        <SubmitButton loading={loading} onCancel={onClose} />
      </Form>
    </Modal>
  );
};
