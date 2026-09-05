import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Col, Form, Input, Modal, Row } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { AttributeManagerSelect } from "@/modules/attribute/components/Select";
import { AttributeType } from "@/modules/attribute/attribute.enum";
import { PartnerSelect } from "@/modules/partner/components/Select";
import { PartnerType } from "@/modules/partner/partner.model";
import {
  DatePickerCustom,
  FormSection,
  InputMoney,
  Label,
  SubmitButton,
} from "@/shared/components";
import { FundSelect } from "@/modules/fund/components";
import { randomId } from "@/shared/utils/common.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { IncomeExpense, IncomeExpenseTypeEnum } from "../incomeExpense.model";

interface Props extends AddUpdateModalProps<IncomeExpense> {
  type: IncomeExpenseTypeEnum;
}

export const IncomeExpenseAddUpdateModal: React.FC<Props> = ({
  open,
  editData,
  errors,
  loading,
  type,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<IncomeExpense>();
  const category = Form.useWatch("category", form);
  const fund = Form.useWatch("fund", form);
  const partner = Form.useWatch("partner", form);
  const id = editData?.id || randomId();
  const isIncome = type === IncomeExpenseTypeEnum.INCOME;

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);
  const handleFinish = (values: IncomeExpense) => {
    const {
      category: _category,
      fund: _fund,
      partner: _partner,
      ...formValues
    } = values as IncomeExpense & Record<string, unknown>;
    const payload = formatFormData({ ...formValues, id, tempId: id, type } as IncomeExpense);
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
      title={`${editData ? "Cập nhật" : "Thêm"} ${isIncome ? "phiếu thu" : "phiếu chi"}`}
      onCancel={handleClose}
      afterOpenChange={(isOpen) => {
        if (!isOpen) form.resetFields();
        else
          form.setFieldsValue(
            editData
              ? parseFormDataDates(editData)
              : ({
                  id,
                  tempId: id,
                  type,
                  occurredAt: dayjs(),
                  amount: 0,
                } as unknown as IncomeExpense),
          );
      }}
    >
      <Form form={form} onFinish={handleFinish} className="mt-4">
        <Form.Item name="code" label={<Label title="Số phiếu" />}>
          <Input placeholder="Tự động nếu để trống" />
        </Form.Item>
        <Form.Item
          name="occurredAt"
          label={<Label title="Thời gian" required />}
          rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
        >
          <DatePickerCustom />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label={<Label title={isIncome ? "Danh mục thu" : "Danh mục chi"} />}
        >
          <AttributeManagerSelect
            type={isIncome ? AttributeType.INCOME_CATEGORY : AttributeType.EXPENSE_CATEGORY}
            defaultData={category}
            onChangeData={(value) => form.setFieldValue("category", value || null)}
          />
        </Form.Item>
        <Form.Item name="category" hidden />
        <Form.Item
          name="fundId"
          label={<Label title="Quỹ" required />}
          rules={[{ required: true, message: "Vui lòng chọn quỹ" }]}
        >
          <FundSelect
            defaultData={fund}
            onChangeData={(value) => form.setFieldValue("fund", value || null)}
          />
        </Form.Item>
        <Form.Item name="fund" hidden />
        <Form.Item
          name="amount"
          label={<Label title="Số tiền" required />}
          rules={[
            { required: true, message: "Vui lòng nhập số tiền" },
            { type: "number", min: 1, message: "Số tiền phải lớn hơn 0" },
          ]}
        >
          <InputMoney notRightAlign min={1} />
        </Form.Item>
        <Form.Item
          name="partnerId"
          label={<Label title={isIncome ? "Khách hàng" : "Nhà cung cấp"} />}
        >
          <PartnerSelect
            query={{ types: [isIncome ? PartnerType.CUSTOMER : PartnerType.SUPPLIER] }}
            defaultData={partner}
            onChangeData={(value) => form.setFieldValue("partner", value || null)}
          />
        </Form.Item>
        <Form.Item name="partner" hidden />
        <Form.Item name="description" label={<Label title="Nội dung" />}>
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <Form.Item name="note" label={<Label title="Ghi chú" />}>
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <div className="flex justify-center">
          <SubmitButton loading={loading} onCancel={handleClose} />
        </div>
      </Form>
    </Modal>
  );
};
