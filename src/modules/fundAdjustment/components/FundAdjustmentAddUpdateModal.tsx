import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Col, Form, Input, Modal, Row, Switch } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { DatePickerCustom, FormSection, InputMoney, Label, SubmitButton } from "@/shared/components";
import { FundSelect } from "@/modules/fund/components";
import { randomId } from "@/shared/utils/common.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { FundAdjustment } from "../fundAdjustment.model";

export const FundAdjustmentAddUpdateModal: React.FC<AddUpdateModalProps<FundAdjustment>> = ({ open, editData, errors, loading, onAdd, onEdit, onClose }) => {
  const [form] = Form.useForm<FundAdjustment>();
  const fund = Form.useWatch("fund", form);
  const expectedAmount = Number(Form.useWatch("expectedAmount", form) || 0);
  const countedAmount = Number(Form.useWatch("countedAmount", form) || 0);
  const id = editData?.id || randomId();

  useEffect(() => { if (errors) setFormErrors(form, errors); }, [errors, form]);
  const handleFinish = (values: FundAdjustment) => {
    const { fund: _fund, ...formValues } = values as FundAdjustment & Record<string, unknown>;
    const payload = formatFormData({ ...formValues, id, tempId: id, deltaAmount: Number(values.countedAmount || 0) - Number(values.expectedAmount || 0) } as FundAdjustment);
    if (editData) onEdit?.(payload); else onAdd?.(payload);
  };
  const handleClose = () => { form.resetFields(); onClose(); };

  return <Modal open={open} centered destroyOnClose maskClosable={false} footer={null} title={`${editData ? "Cập nhật" : "Thêm"} phiếu điều chỉnh quỹ`} onCancel={handleClose} afterOpenChange={(isOpen) => {
    if (!isOpen) form.resetFields();
    else form.setFieldsValue(editData ? parseFormDataDates(editData) : ({ id, tempId: id, occurredAt: dayjs(), expectedAmount: 0, countedAmount: 0, isInitial: false } as unknown as FundAdjustment));
  }}>
    <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
      <FormSection title="Thông tin điều chỉnh">
        <Row gutter={16}>
          <Col xs={24} sm={12}><Form.Item name="code" label={<Label title="Số phiếu" />}><Input placeholder="Tự động nếu để trống" /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item name="occurredAt" label={<Label title="Thời gian" required />} rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}><DatePickerCustom /></Form.Item></Col>
          <Col xs={24}><Form.Item name="fundId" label={<Label title="Quỹ" required />} rules={[{ required: true, message: "Vui lòng chọn quỹ" }]}><FundSelect defaultData={fund} onChangeData={(value) => form.setFieldValue("fund", value || null)} /></Form.Item><Form.Item name="fund" hidden /></Col>
          <Col xs={24} sm={12}><Form.Item name="expectedAmount" label={<Label title="Số dư hệ thống" required />} rules={[{ required: true }, { type: "number", min: 0, message: "Số dư không hợp lệ" }]}><InputMoney notRightAlign min={0} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item name="countedAmount" label={<Label title="Số dư thực tế" required />} rules={[{ required: true }, { type: "number", min: 0, message: "Số dư không hợp lệ" }]}><InputMoney notRightAlign min={0} /></Form.Item></Col>
        </Row>
        <div className="mb-3 flex items-center justify-between rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm"><span>Chênh lệch</span><strong className={countedAmount - expectedAmount < 0 ? "text-red-600" : "text-emerald-600"}>{(countedAmount - expectedAmount).toLocaleString("vi-VN")} đ</strong></div>
        <Form.Item name="isInitial" label="Loại điều chỉnh" valuePropName="checked"><Switch checkedChildren="Số dư đầu kỳ" unCheckedChildren="Điều chỉnh thường" /></Form.Item>
      </FormSection>
      <Form.Item name="reason" label={<Label title="Lý do" />}><Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} /></Form.Item>
      <Form.Item name="note" label={<Label title="Ghi chú" />}><Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} /></Form.Item>
      <div className="flex justify-center"><SubmitButton loading={loading} onCancel={handleClose} /></div>
    </Form>
  </Modal>;
};
