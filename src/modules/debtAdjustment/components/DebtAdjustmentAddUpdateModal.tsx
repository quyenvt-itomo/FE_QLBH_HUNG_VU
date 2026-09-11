import React, { useCallback, useEffect, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Col, Form, Input, Modal, Row } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { DatePickerCustom, InputMoney, Label, SubmitButton } from "@/shared/components";
import { getData } from "@/shared/api/apiClient";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { PartnerSelect } from "@/modules/partner/components/Select";
import { PartnerType } from "@/modules/partner/partner.model";
import { DebtSide, debtSideMap } from "@/shared/constants/enum";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { randomId } from "@/shared/utils/common.util";
import { DebtAdjustment } from "../debtAdjustment.model";

interface DebtAdjustmentAddUpdateModalProps extends AddUpdateModalProps<DebtAdjustment> {
  side: DebtSide;
}
export const DebtAdjustmentAddUpdateModal: React.FC<DebtAdjustmentAddUpdateModalProps> = ({
  open,
  editData,
  errors,
  loading,
  side,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<DebtAdjustment>();
  const partner = Form.useWatch("partner", form);
  const expectedAmount = Number(Form.useWatch("expectedAmount", form) || 0);
  const countedAmount = Number(Form.useWatch("countedAmount", form) || 0);
  const id = editData?.id || randomId();
  const occurredAt = Form.useWatch("occurredAt", form);
  const partnerId = Form.useWatch("partnerId", form);
  const balanceRequestId = useRef(0);

  const isPayable = side === DebtSide.PAYABLE;

  const partnerTypes = isPayable
    ? [PartnerType.SUPPLIER, PartnerType.SHIPPER]
    : [PartnerType.CUSTOMER];

  const fetchPartnerDebt = useCallback(
    async (
      partnerId: string | null | undefined,
      value: string | number | Dayjs | Date | null | undefined,
    ) => {
      const date = dayjs(value);
      if (!open || !partnerId || !date.isValid()) return;

      const requestId = ++balanceRequestId.current;
      form.setFieldValue("expectedAmount", 0);

      try {
        const url = apiEndpoint.debt.balance.replace(":partnerId", partnerId);
        const response = await getData<{
          payableDebtAmount: number;
          receivableDebtAmount: number;
        }>(url, {
          offsetAt: date.toISOString(),
          ...(editData?.id ? { excludeId: editData.id } : {}),
        });

        if (requestId !== balanceRequestId.current) return;
        const amount = isPayable
          ? response.data?.payableDebtAmount
          : response.data?.receivableDebtAmount;
        form.setFieldValue("expectedAmount", Number(amount || 0));
      } catch (error) {
        if (requestId !== balanceRequestId.current) return;
        console.error("Failed to fetch partner debt balance", error);
        form.setFieldValue("expectedAmount", 0);
      }
    },
    [form, isPayable, open],
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
      const values = parseFormDataDates(editData) as unknown as DebtAdjustment;
      form.setFieldsValue({
        ...values,
        side,
      });
      void fetchPartnerDebt(values.partnerId, values.occurredAt);
      return;
    }
    const occurredAt = dayjs();
    form.setFieldsValue({
      id,
      tempId: id,
      occurredAt: occurredAt as unknown as string,
      side,
      expectedAmount: 0,
      countedAmount: 0,
      isInitial: false,
    });
  };

  const handleOccurredAtChange = (value: Dayjs | null) => {
    if (!value) {
      balanceRequestId.current += 1;
      form.setFieldValue("expectedAmount", 0);
      return;
    }
    void fetchPartnerDebt(partnerId || partner?.id, value);
  };

  const handleFinish = (values: DebtAdjustment) => {
    const { partner: _partner, ...formValues } = values as DebtAdjustment & {
      partner?: unknown;
    };
    const payload = formatFormData({
      ...formValues,
      id,
      tempId: id,
      side,
    }) as Partial<DebtAdjustment>;
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
      title={`${editData ? "Cập nhật" : "Thêm"} phiếu điều chỉnh ${debtSideMap[side]?.toLowerCase()}`}
      onCancel={handleClose}
      afterOpenChange={handleAfterOpenChange}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
        <Form.Item name="side" hidden />
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="code" label={<Label title="Số phiếu" />}>
              <Input placeholder="Tự động nếu để trống" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="occurredAt" label={<Label title="Thời gian" />}>
              <DatePickerCustom onChange={handleOccurredAtChange} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="partnerId" label={<Label title="Đối tác" />}>
              <PartnerSelect
                query={{ types: partnerTypes, offsetAt: dayjs(occurredAt).toISOString() }}
                defaultData={partner || editData?.partner || null}
                showPayableDebt={isPayable}
                showReceivableDebt={!isPayable}
                onChangeData={(value) => {
                  if (!value?.id) balanceRequestId.current += 1;
                  form.setFieldValue("partner", value || null);
                  form.setFieldValue(
                    "expectedAmount",
                    isPayable ? value?.payableDebtAmount || 0 : value?.receivableDebtAmount || 0,
                  );
                  if (value?.id) void fetchPartnerDebt(value.id, occurredAt);
                }}
              />
            </Form.Item>
            <Form.Item name="partner" hidden />
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="expectedAmount" label={<Label title="Số dư hệ thống" />}>
              <InputMoney notRightAlign min={0} disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="countedAmount"
              label={<Label title="Số dư thực tế" required />}
              rules={[{ required: true, message: "Vui lòng nhập số dư thực tế" }]}
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
        <Form.Item name="reason" label={<Label title="Lý do" />}>
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <Form.Item name="note" label={<Label title="Ghi chú" />}>
          <Input.TextArea placeholder="Nhập ghi chú" />
        </Form.Item>
        <div className="flex justify-center">
          <SubmitButton loading={loading} onCancel={handleClose} />
        </div>
      </Form>
    </Modal>
  );
};
