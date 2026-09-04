import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Col, Form, Input, Modal, Row } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { DatePickerCustom, FormSection, InputMoney, Label, SubmitButton } from "@/shared/components";
import { FundSelect } from "@/modules/fund/components";
import { randomId } from "@/shared/utils/common.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { FundTransfer } from "../fundTransfer.model";

export const FundTransferAddUpdateModal: React.FC<AddUpdateModalProps<FundTransfer>> = ({ open, editData, errors, loading, onAdd, onEdit, onClose }) => {
  const [form] = Form.useForm<FundTransfer>();
  const fromFund = Form.useWatch("fromFund", form);
  const toFund = Form.useWatch("toFund", form);
  const id = editData?.id || randomId();

  useEffect(() => { if (errors) setFormErrors(form, errors); }, [errors, form]);
  const handleFinish = (values: FundTransfer) => {
    const { fromFund: _fromFund, toFund: _toFund, ...formValues } = values as FundTransfer & Record<string, unknown>;
    const payload = formatFormData({ ...formValues, id, tempId: id } as FundTransfer);
    if (editData) onEdit?.(payload); else onAdd?.(payload);
  };
  const handleClose = () => { form.resetFields(); onClose(); };

  return <Modal open={open} centered destroyOnClose maskClosable={false} footer={null} title={`${editData ? "Cập nhật" : "Thêm"} phiếu chuyển quỹ`} onCancel={handleClose} afterOpenChange={(isOpen) => {
    if (!isOpen) form.resetFields();
    else form.setFieldsValue(editData ? parseFormDataDates(editData) : ({ id, tempId: id, occurredAt: dayjs() } as unknown as FundTransfer));
  }}>
    <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
      <FormSection title="Thông tin chuyển quỹ">
        <Row gutter={16}>
          <Col xs={24} sm={12}><Form.Item name="code" label={<Label title="Số phiếu" />}><Input placeholder="Tự động nếu để trống" /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item name="occurredAt" label={<Label title="Thời gian" required />} rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}><DatePickerCustom /></Form.Item></Col>
          <Col xs={24} sm={12}>
            <Form.Item name="fromFundId" label={<Label title="Quỹ chuyển đi" required />} rules={[{ required: true, message: "Vui lòng chọn quỹ chuyển đi" }]}>
              <FundSelect defaultData={fromFund} onChangeData={(value) => form.setFieldValue("fromFund", value || null)} />
            </Form.Item><Form.Item name="fromFund" hidden />
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="toFundId" label={<Label title="Quỹ nhận" required />} rules={[{ required: true, message: "Vui lòng chọn quỹ nhận" }, { validator: (_, value) => value && value === form.getFieldValue("fromFundId") ? Promise.reject(new Error("Hai quỹ phải khác nhau")) : Promise.resolve() }]}>
              <FundSelect defaultData={toFund} onChangeData={(value) => form.setFieldValue("toFund", value || null)} />
            </Form.Item><Form.Item name="toFund" hidden />
          </Col>
          <Col xs={24}><Form.Item name="amount" label={<Label title="Số tiền" required />} rules={[{ required: true, message: "Vui lòng nhập số tiền" }, { type: "number", min: 1, message: "Số tiền phải lớn hơn 0" }]}><InputMoney notRightAlign min={1} /></Form.Item></Col>
        </Row>
      </FormSection>
      <Form.Item name="note" label={<Label title="Ghi chú" />}><Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} /></Form.Item>
      <div className="flex justify-center"><SubmitButton loading={loading} onCancel={handleClose} /></div>
    </Form>
  </Modal>;
};
