import React, { useEffect } from "react";
import { Input, Modal, Form, Row, Col } from "antd";
import { SubmitButton } from "@/shared";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Warehouse } from "../warehouse.model";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { Label } from "@/shared";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { ProvinceSelect, WardSelect } from "@/shared";
import { useAddressSelector } from "@/shared/hooks/useAddressSelector";
import { getPhoneRules } from "@/shared/constants/formItemRule";
import { EmployeeSelect } from "@/modules/employee";

export const WarehouseAddUpdateModal: React.FC<AddUpdateModalProps<Warehouse>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<Warehouse>();
  const id = editData?.id || randomId();
  const manager = Form.useWatch("manager", form);
  const state = Form.useWatch(["address", "state"], form);

  const { provinceOptions, wardOptions } = useAddressSelector(state);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const handleFinish = async (values: Warehouse) => {
    const formattedData = formatFormData({ ...values, id, tempId: id });
    editData ? onEdit?.(formattedData) : onAdd?.(formattedData);
  };

  return (
    <Modal
      title={editData ? "Chỉnh sửa kho" : "Thêm kho"}
      open={open}
      onCancel={() => {
        onClose?.();
        form.resetFields();
      }}
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
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        onFinishFailed={showFormErrorMessages}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24}>
            <Form.Item name="code" label={<Label width={140} title="Mã kho" required />}>
              <Input placeholder="Tự động tạo nếu để trống khi lưu" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="name"
              label={<Label width={140} title="Tên kho" required />}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="phone"
              label={<Label width={140} title="SĐT" />}
              rules={getPhoneRules()}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="managerId" label={<Label width={140} title="Thủ kho" />}>
              <EmployeeSelect
                defaultData={manager}
                onChangeData={(val) => form.setFieldValue("manager", val)}
              />
            </Form.Item>

            <Form.Item name="manager" hidden />
          </Col>

          <Col xs={24}>
            <Label width={140} title="Địa chỉ" bold />
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name={["address", "state"]}>
              <ProvinceSelect
                options={provinceOptions}
                onChange={(val) => {
                  form.setFieldValue(["address", "state"], val);
                  form.setFieldValue(["address", "ward"], null);
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name={["address", "ward"]}>
              <WardSelect options={wardOptions} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name={["address", "detail"]}>
              <Input placeholder="Nhập địa chỉ chi tiết" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="note" label={<Label width={140} title="Ghi chú" />}>
              <Input.TextArea
                autoSize={{
                  minRows: 2,
                  maxRows: 4,
                }}
                placeholder="Nhập ghi chú"
              />
            </Form.Item>
          </Col>
        </Row>
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
