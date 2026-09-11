import React, { useCallback, useEffect, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Col, Form, Input, Modal, Row } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { AppSwitch, DatePickerCustom, InputMoney, Label, SubmitButton } from "@/shared/components";
import { getData } from "@/shared/api/apiClient";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { randomId } from "@/shared/utils/common.util";
import { VatDebtAdjustment } from "../vatDebtAdjustment.model";

export const VatDebtAdjustmentAddUpdateModal: React.FC<AddUpdateModalProps<VatDebtAdjustment>> = ({
  open,
  editData,
  errors,
  loading,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<VatDebtAdjustment>();
  const expectedAmount = Number(Form.useWatch("expectedAmount", form) || 0);
  const countedAmount = Number(Form.useWatch("countedAmount", form) || 0);
  const id = editData?.id || randomId();
  const balanceRequestId = useRef(0);

  const fetchSystemVat = useCallback(
    async (value: Dayjs | null | undefined) => {
      if (!open || !value || !value.isValid()) return;

      const requestId = ++balanceRequestId.current;
      form.setFieldValue("expectedAmount", 0);

      try {
        const response = await getData<{ amount: number }>(
          apiEndpoint.vatTransaction.balance,
          {
            occurredAt: value.toISOString(),
            ...(editData?.id ? { excludeId: editData.id } : {}),
          },
        );

        if (requestId !== balanceRequestId.current) return;
        form.setFieldValue("expectedAmount", Number(response.data?.amount || 0));
      } catch (error) {
        if (requestId !== balanceRequestId.current) return;
        console.error("Failed to fetch system VAT balance", error);
        form.setFieldValue("expectedAmount", 0);
      }
    },
    [editData?.id, form, open],
  );

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);

  const handleAfterOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      balanceRequestId.current += 1;
      form.resetFields();
      return;
    }
    if (editData) {
      const values = parseFormDataDates(editData) as unknown as VatDebtAdjustment;
      form.setFieldsValue(values);
      void fetchSystemVat(values.occurredAt as unknown as Dayjs);
      return;
    }
    const occurredAt = dayjs();
    form.setFieldsValue({
      id,
      tempId: id,
      occurredAt: occurredAt as unknown as string,
      expectedAmount: 0,
      countedAmount: 0,
      isInitial: false,
    });
    void fetchSystemVat(occurredAt);
  };

  const handleOccurredAtChange = (value: Dayjs | null) => {
    if (!value) {
      balanceRequestId.current += 1;
      form.setFieldValue("expectedAmount", 0);
      return;
    }
    void fetchSystemVat(value);
  };

  const handleFinish = (values: VatDebtAdjustment) => {
    const payload = formatFormData({
      ...values,
      id,
      tempId: id,
      deltaAmount: Number(values.countedAmount || 0) - Number(values.expectedAmount || 0),
    }) as Partial<VatDebtAdjustment>;
    if (editData) onEdit?.(payload);
    else onAdd?.(payload);
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      centered
      destroyOnClose
      maskClosable={false}
      footer={null}
      title={`${editData ? "Cập nhật" : "Thêm"} phiếu điều chỉnh VAT`}
      onCancel={handleClose}
      afterOpenChange={handleAfterOpenChange}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="code" label={<Label title="Số phiếu" />}>
              <Input placeholder="Tự động nếu để trống" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="occurredAt" label={<Label title="Thời gian" />}>
              <DatePickerCustom showTime onChange={handleOccurredAtChange} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="expectedAmount" label={<Label title="VAT hệ thống" />}>
              <InputMoney notRightAlign disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="countedAmount"
              label={<Label title="VAT thực tế" required />}
              rules={[{ required: true, message: "Vui lòng nhập VAT thực tế" }]}
            >
              <InputMoney notRightAlign min={0} />
            </Form.Item>
          </Col>
        </Row>
        <div className="mb-3 flex items-center justify-between rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
          <span>Chênh lệch</span>
          <strong
            className={countedAmount - expectedAmount < 0 ? "text-red-600" : "text-emerald-600"}
          >
            {(countedAmount - expectedAmount).toLocaleString("vi-VN")} đ
          </strong>
        </div>
        <Form.Item name="isInitial" valuePropName="checked">
          <AppSwitch label="Là điều chỉnh đầu kỳ" />
        </Form.Item>
        <Form.Item name="reason" label={<Label title="Lý do" />}>
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <div className="flex justify-center">
          <SubmitButton loading={loading} onCancel={handleClose} />
        </div>
      </Form>
    </Modal>
  );
};
