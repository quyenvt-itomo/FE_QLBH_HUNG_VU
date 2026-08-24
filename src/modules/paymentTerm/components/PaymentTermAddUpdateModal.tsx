import React, { useEffect, useMemo } from "react";
import { Input, Modal, Form, Row, Col, FormInstance } from "antd";
import { FormProps } from "antd/lib";
import { SubmitButton } from "@/shared";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { PaymentTerm } from "../paymentTerm.model";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { parseFormDataDates } from "@/shared/utils/date.util";
import { Label } from "@/shared";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { InputMoney, InputPercentage, InputQuantity } from "@/shared";
import { FormSection } from "@/shared";

export interface PartialProps {
  form: FormInstance<PaymentTerm>;
  editData?: PaymentTerm;
}

export const PaymentTermAddUpdateModal: React.FC<AddUpdateModalProps<PaymentTerm>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<PaymentTerm>();
  const id = editData?.id || randomId();

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<PaymentTerm>["onFinish"] = async (values) => {
    editData
      ? onEdit?.({ ...values, id, tempId: id })
      : onAdd?.({ ...values, id, tempId: id } as any);
  };
  const handleCancel = () => {
    onClose?.();
    form.resetFields();
  };

  return (
    <Modal
      title={editData ? "Chỉnh sửa điều khoản" : "Thêm điều khoản thanh toán"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={560}
      destroyOnClose
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }
        if (!editData) {
          return;
        }
        form.setFieldsValue(parseFormDataDates(editData));
      }}
    >
      <Form form={form} onFinish={onFinish} onFinishFailed={showFormErrorMessages}>
        <FormSection title="Thông tin">
          <Form.Item
            name="code"
            label={<Label width={140} title="Mã điều khoản" required />}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label={<Label width={140} title="Tên điều khoản" required />}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="depositRate" label={<Label width={140} title="Tỷ lệ cọc (%)" />}>
            <InputPercentage notRightAlign />
          </Form.Item>
          <Form.Item name="maxDebtDays" label={<Label width={140} title="Ngày nợ tối đa" />}>
            <InputQuantity notRightAlign />
          </Form.Item>
          <Form.Item name="maxDebtAmount" label={<Label width={140} title="Nợ tối đa (VNĐ)" />}>
            <InputMoney notRightAlign />
          </Form.Item>
          <Form.Item name="note" label={<Label width={140} title="Ghi chú" />}>
            <Input />
          </Form.Item>
        </FormSection>
        <div className="flex w-full justify-center mt-4">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};
