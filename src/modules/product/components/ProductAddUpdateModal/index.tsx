import React, { useEffect } from "react";
import { Input, Modal, Form, Row, Col, FormInstance } from "antd";
import { FormProps } from "antd/lib";
import { SubmitButton } from "@/shared";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import {
  Product,
  ProductType,
  productGroupAttributeMap,
  productLabel,
  productTypeMap,
} from "../../product.model";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { parseFormDataDates } from "@/shared/utils/date.util";
import { Label } from "@/shared";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { AttributeManagerSelect, AttributeType } from "@/modules/attribute";
import { AppSwitch, InputMoney, InputPercentage } from "@/shared";
import { FormSection } from "@/shared";
import { ExtraUnitList } from "./ExtraUnitList";

export interface PartialProps {
  form: FormInstance<Product>;
  editData?: Product;
}

export const ProductAddUpdateModal: React.FC<
  AddUpdateModalProps<Product> & { type?: ProductType }
> = ({ open, editData, loading, errors, type = ProductType.FINISHED, onAdd, onEdit, onClose }) => {
  const { showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<Product>();
  const id = editData?.id || randomId();
  const group = Form.useWatch("group", form);
  const baseUnit = Form.useWatch("baseUnit", form);
  const extraUnits = Form.useWatch("extraUnits", form) || [];

  const groupAttributeType = productGroupAttributeMap[type];

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<Product>["onFinish"] = async (values) => {
    const formattedData = { ...values, id, tempId: id, type };
    editData ? onEdit?.(formattedData) : onAdd?.(formattedData);
  };

  const handleCancel = () => {
    onClose?.();
    form.resetFields();
  };

  return (
    <Modal
      title={`${editData ? "Chỉnh sửa thông tin" : "Thêm"} ${productTypeMap[type].toLowerCase()}`}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={720}
      className="fullscreen-modal"
      destroyOnClose
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }
        if (!editData) return;

        form.setFieldsValue(parseFormDataDates(editData));
      }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={showFormErrorMessages}
        className="flex flex-col h-full w-full overflow-y-auto scrollbar-hide"
      >
        <div className="flex flex-col">
          <FormSection title="Thông tin chung">
            <Row gutter={[132, 0]}>
              <Col xs={24}>
                <Form.Item name="code" label={<Label title={productLabel(type, "Mã")} required />}>
                  <Input placeholder="Tự động tạo nếu để trống khi lưu" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="name"
                  label={<Label title={productLabel(type, "Tên")} required />}
                  rules={[
                    {
                      required: true,
                      message: `Vui lòng nhập tên ${productTypeMap[type].toLowerCase()}`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="groupId"
                  label={<Label title={productLabel(type, "Nhóm")} required />}
                  rules={[
                    {
                      required: true,
                      message: `Vui lòng chọn nhóm ${productTypeMap[type].toLowerCase()}`,
                    },
                  ]}
                >
                  <AttributeManagerSelect
                    type={groupAttributeType}
                    defaultData={group}
                    onChangeData={(v) => form.setFieldValue("group", v)}
                  />
                </Form.Item>
                <Form.Item name="group" hidden />
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="baseUnitId"
                  label={<Label title="Đơn vị tính" required />}
                  rules={[{ required: true, message: "Vui lòng chọn đơn vị" }]}
                >
                  <AttributeManagerSelect
                    type={AttributeType.UNIT}
                    defaultData={baseUnit}
                    onChangeData={(v) => {
                      form.setFieldValue("baseUnit", v);
                      const filteredExtraUnits = extraUnits.filter((unit) => unit.unitId !== v?.id);
                      form.setFieldValue("extraUnits", filteredExtraUnits);
                    }}
                  />
                </Form.Item>
                <Form.Item name="baseUnit" hidden />
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="price"
                  label={<Label title="Giá" required />}
                  rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <InputMoney
                    notRightAlign
                    placeholder="Đơn giá"
                    suffix={
                      <span className="text-gray-400 italic text-xs">
                        VNĐ/{baseUnit?.name || "ĐVT"}
                      </span>
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="taxRate" label={<Label title="%VAT" />}>
                  <InputPercentage notRightAlign />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="note" label={<Label title="Ghi chú" />}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </FormSection>

          <ExtraUnitList form={form} />
        </div>

        <div className="flex w-full justify-between mt-auto mb-0 action-sticky-bottom">
          <div className="w-60">
            <Form.Item name="isPublic" valuePropName="checked" noStyle>
              <AppSwitch label="Hiển thị công khai" />
            </Form.Item>
          </div>
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};
