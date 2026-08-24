import React, { useEffect } from "react";
import { Input, Modal, Form, Row, Col } from "antd";
import { FormProps } from "antd/lib";
import { SubmitButton } from "@/shared/components";
import { useGlobalData } from "@/shared/hooks";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Attribute } from "../attribute.model";
import { AttributeType, attributeTypeMap, attributeTypeOptions } from "../attribute.enum";
import { ProductGroupSelect } from "./Select";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { parseFormDataDates } from "@/shared/utils/date.util";
import { Label } from "@/shared/components";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { FormSection } from "@/shared/components";
import { AppSelect } from "@/shared/components";
import { StoreSelect } from "@/modules/store/components/Select";

interface Props extends AddUpdateModalProps<Attribute> {
  type: AttributeType;
}
export const AttributeAddUpdateModal: React.FC<Props> = ({
  open,
  editData,
  type,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { showFormErrorMessages } = useAppMessage();
  const { currentStore } = useGlobalData();
  const [form] = Form.useForm<Attribute>();
  const id = editData?.id || randomId();
  const parent = Form.useWatch("parent", form);
  const store = Form.useWatch("store", form);

  const text = attributeTypeMap[type]?.toLowerCase();

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<Attribute>["onFinish"] = async (values) => {
    const formattedValues = { ...values, type, id, tempId: id };
    editData ? onEdit?.(formattedValues) : onAdd?.(formattedValues);
  };
  const handleCancel = () => {
    onClose?.();
    form.resetFields();
  };

  return (
    <Modal
      title={`${editData ? "Cập nhật" : "Thêm"} ${text}`}
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
        if (editData) form.setFieldsValue(parseFormDataDates(editData));
        else if (type) form.setFieldValue("type", type);
      }}
    >
      <Form form={form} onFinish={onFinish} className="mt-8" onFinishFailed={showFormErrorMessages}>
        <FormSection title="Thông tin">
          <Row gutter={[132, 0]}>
            <Col xs={24}>
              <Form.Item
                name="name"
                label={<Label width={140} title="Tên" required />}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            {type === AttributeType.PRODUCT_GROUP && (
              <Col xs={24}>
                <Form.Item name="parentId" label={<Label width={140} title="Nhóm cha" />}>
                  <ProductGroupSelect
                    defaultData={parent}
                    hideOptions={editData ? [editData] : undefined}
                    onChangeData={(value) => form.setFieldValue("parent", value || null)}
                    placeholder="Chọn nhóm cha (không bắt buộc)"
                  />
                </Form.Item>
                <Form.Item name="parent" hidden />
              </Col>
            )}
            {type === AttributeType.LOCATION && !currentStore && (
              <Col xs={24}>
                <Form.Item
                  name="storeId"
                  label={<Label width={140} title="Cửa hàng" required />}
                  rules={[{ required: true, message: "Vui lòng chọn cửa hàng" }]}
                >
                  <StoreSelect
                    defaultData={store}
                    onChangeData={(value) => form.setFieldValue("store", value || null)}
                  />
                </Form.Item>
                <Form.Item name="store" hidden />
              </Col>
            )}
          </Row>
        </FormSection>
        <div className="flex w-full justify-center mt-4">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};
