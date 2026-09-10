import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Col, Form, Input, Modal, Row } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { DatePickerCustom, InputMoney, Label, SubmitButton } from "@/shared/components";
import { PartnerSelect } from "@/modules/partner/components/Select";
import { PartnerType } from "@/modules/partner/partner.model";
import { DebtSide, debtSideMap } from "@/shared/constants/enum";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { randomId } from "@/shared/utils/common.util";
import { DebtAdjustment } from "../debtAdjustment.model";

export const DebtAdjustmentAddUpdateModal: React.FC<AddUpdateModalProps<DebtAdjustment>> = ({
  open,
  editData,
  errors,
  loading,
  type,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<DebtAdjustment>();
  const side = (type || editData?.side || DebtSide.RECEIVABLE) as DebtSide;
  const partner = Form.useWatch("partner", form);
  const expectedAmount = Number(Form.useWatch("expectedAmount", form) || 0);
  const countedAmount = Number(Form.useWatch("countedAmount", form) || 0);
  const id = editData?.id || randomId();
  const partnerType = side === DebtSide.RECEIVABLE ? PartnerType.CUSTOMER : PartnerType.SUPPLIER;

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);

  const handleAfterOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.resetFields();
      return;
    }
    if (editData) {
      form.setFieldsValue({
        ...(parseFormDataDates(editData) as unknown as DebtAdjustment),
        side,
      });
      return;
    }
    form.setFieldsValue({
      id,
      tempId: id,
      occurredAt: dayjs() as unknown as string,
      side,
      expectedAmount: 0,
      countedAmount: 0,
      isInitial: false,
    });
  };

  const handleFinish = (values: DebtAdjustment) => {
    const { partner: _partner, ...formValues } = values as DebtAdjustment & {
      partner?: unknown;
    };
    const payload = formatFormData({
      ...formValues,
      id,
      tempId: id,
      deltaAmount: Number(values.countedAmount || 0) - Number(values.expectedAmount || 0),
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
      title={`${editData ? "Cập nhật" : "Thêm"} phiếu điều chỉnh công nợ`}
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
            <Form.Item
              name="occurredAt"
              label={<Label title="Thời gian" required />}
              rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
            >
              <DatePickerCustom showTime />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label={<Label title="Loại công nợ" required />}>
              <Input value={debtSideMap[side]} disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="partnerId" label={<Label title="Đối tác" />}>
              <PartnerSelect
                query={{ type: partnerType }}
                defaultData={partner || editData?.partner || null}
                onChangeData={(value) => form.setFieldValue("partner", value || null)}
              />
            </Form.Item>
            <Form.Item name="partner" hidden />
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="expectedAmount"
              label={<Label title="Số dư hệ thống" required />}
              rules={[{ required: true, message: "Vui lòng nhập số dư hệ thống" }]}
            >
              <InputMoney notRightAlign min={0} />
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
