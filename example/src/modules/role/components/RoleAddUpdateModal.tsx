import React, { useEffect } from "react";
import { Input, Modal, Form, Row, Col } from "antd";
import SubmitButton from "@/shared/components/button/SubmitButton";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Role } from "../role.model";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import Label from "@/shared/components/display/Label";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { FormSection } from "@/shared/components/form/FormSection";

export const RoleAddUpdateModal: React.FC<AddUpdateModalProps<Role>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<Role>();
  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  return (
    <Modal
      title={editData ? "Chỉnh sửa vai trò" : "Thêm vai trò"}
      open={open}
      onCancel={() => {
        onClose?.();
        form.resetFields();
      }}
      footer={null}
      maskClosable={false}
      centered
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={(values) => {
          editData
            ? onEdit?.({ ...values, id: editData.id })
            : onAdd?.({ ...values, id: randomId(), tempId: randomId() } as any);
        }}
        onFinishFailed={showFormErrorMessages}
      >
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
              <Form.Item name="note" label={<Label width={140} title="Ghi chú" />}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>
        <div className="flex w-full justify-center mt-4">
          <SubmitButton
            loading={loading}
            onCancel={() => {
              onClose?.();
              form.resetFields();
            }}
          />
        </div>
      </Form>
    </Modal>
  );
};
