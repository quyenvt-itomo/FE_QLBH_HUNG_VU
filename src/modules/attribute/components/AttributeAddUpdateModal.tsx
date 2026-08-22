import React, { useEffect, useMemo } from "react";
import { Input, Modal, Form, Row, Col } from "antd";
import { FormProps } from "antd/lib";
import SubmitButton from "@/shared/components/button/SubmitButton";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Attribute } from "../attribute.model";
import { attributeTypeOptions } from "../attribute.enum";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { parseFormDataDates } from "@/shared/utils/date.util";
import Label from "@/shared/components/display/Label";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { FormSection } from "@/shared/components/form/FormSection";
import { AppSelect } from "@/shared/components/select/AppSelect";

export const AttributeAddUpdateModal: React.FC<AddUpdateModalProps<Attribute>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<Attribute>();
  const id = editData?.id || randomId();
  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<Attribute>["onFinish"] = async (values) => {
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
      title={editData ? "Chỉnh sửa thuộc tính" : "Thêm thuộc tính"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={800}
      destroyOnClose
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }
        if (editData) form.setFieldsValue(parseFormDataDates(editData));
      }}
    >
      <Form form={form} onFinish={onFinish} onFinishFailed={showFormErrorMessages}>
        <FormSection title="Thông tin">
          <Row gutter={[132, 0]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="name"
                label={<Label width={140} title="Tên" required />}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="type"
                label={<Label width={140} title="Loại" required />}
                rules={[{ required: true }]}
              >
                <AppSelect options={attributeTypeOptions} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="note" label={<Label width={140} title="Ghi chú" />}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>
        <div className="flex w-full justify-center mt-4">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};
