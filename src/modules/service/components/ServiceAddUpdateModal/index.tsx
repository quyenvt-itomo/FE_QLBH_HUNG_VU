import React, { useEffect } from "react";
import { Input, Modal, Form, Row, Col, FormInstance } from "antd";
import { FormProps } from "antd/lib";
import { SubmitButton } from "@/shared";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Service, ServiceType, serviceTypeOptions } from "../../service.model";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { parseFormDataDates } from "@/shared/utils/date.util";
import { Label } from "@/shared";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { InputPercentage } from "@/shared";
import { FormSection } from "@/shared";
import { AppSelect } from "@/shared";
import { ServiceUnitList } from "./ServiceUnitList";

export interface PartialProps {
  form: FormInstance<Service>;
  editData?: Service;
}

export const ServiceAddUpdateModal: React.FC<AddUpdateModalProps<Service>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<Service>();
  const id = editData?.id || randomId();

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<Service>["onFinish"] = async (values) => {
    const formattedData = { ...values, id, tempId: id };
    editData ? onEdit?.(formattedData) : onAdd?.(formattedData);
  };

  const handleCancel = () => {
    onClose?.();
    form.resetFields();
  };

  return (
    <Modal
      title={editData ? "Chỉnh sửa thông tin dịch vụ" : "Thêm dịch vụ"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={520}
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
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={showFormErrorMessages}
        className="flex flex-col h-full w-full overflow-y-auto scrollbar-hide"
        initialValues={{
          type: ServiceType.OUTSOURCED,
        }}
      >
        <div className="flex flex-col">
          <FormSection title="Thông tin chung">
            <Row gutter={[132, 0]}>
              <Col xs={24}>
                <Form.Item name="code" label={<Label width={140} title="Mã dịch vụ" required />}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="name"
                  label={<Label width={140} title="Tên dịch vụ" required />}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên dịch vụ",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="type"
                  label={<Label width={140} title="Loại" required />}
                  rules={[{ required: true, message: "Vui lòng chọn loại" }]}
                >
                  <AppSelect options={serviceTypeOptions} placeholder="Chọn loại dịch vụ" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="taxRate" label={<Label width={140} title="%VAT" />}>
                  <InputPercentage notRightAlign />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="note" label={<Label width={140} title="Ghi chú" />}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>
          <ServiceUnitList form={form} />
        </div>
        <div className="flex w-full justify-center mt-auto mb-0 action-sticky-bottom">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};
