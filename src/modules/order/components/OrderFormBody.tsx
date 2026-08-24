import React from "react";
import { Form, Input, DatePicker } from "antd";
import { calculateOrder } from "../order.util";
import { PartnerSelect } from "@/modules/partner/components/Select";
import { PartnerType } from "@/modules/partner/partner.model";
import { formatMoney } from "@/shared/utils/number.util";
import { AppSelect } from "@/shared/components";
import { DiscountTypeEnum } from "@/shared/constants/enum";

interface Props {
  form: any;
}

export const OrderFormBody: React.FC<Props> = ({ form }) => {
  const lines = Form.useWatch("lines", form);
  const discountType = Form.useWatch("discountType", form);
  const discountValue = Form.useWatch("discountValue", form);
  const taxType = Form.useWatch("taxType", form);
  const taxValue = Form.useWatch("taxValue", form);
  const totals = calculateOrder({ lines, discountType, discountValue, taxType, taxValue } as any);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Form.Item name="code" label="S? ðõn" className="mb-0">
        <Input placeholder="T? ð?ng t?o n?u ð? tr?ng khi lýu" />
      </Form.Item>
      <Form.Item name="timeAt" label="Ngày" rules={[{ required: true }]} className="mb-0">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true }]} className="mb-0">
        <PartnerSelect query={{ types: [PartnerType.CUSTOMER] }} />
      </Form.Item>
      <Form.Item name="discountType" label="Chi?t kh?u" className="mb-0" initialValue={DiscountTypeEnum.AMOUNT}>
        <AppSelect options={[{ value: DiscountTypeEnum.AMOUNT, label: "S? ti?n" }, { value: DiscountTypeEnum.PERCENT, label: "%" }]} />
      </Form.Item>
      <Form.Item name="discountValue" label="Giá tr? CK" className="mb-0" initialValue={0}>
        <Input />
      </Form.Item>
      <Form.Item name="taxType" label="VAT tính theo" className="mb-0" initialValue={DiscountTypeEnum.PERCENT}>
        <AppSelect options={[{ value: DiscountTypeEnum.AMOUNT, label: "S? ti?n" }, { value: DiscountTypeEnum.PERCENT, label: "%" }]} />
      </Form.Item>
      <Form.Item name="taxValue" label="Giá tr? VAT" className="mb-0" initialValue={0}>
        <Input />
      </Form.Item>
      <Form.Item name="note" label="Ghi chú" className="mb-0">
        <Input.TextArea rows={2} />
      </Form.Item>
      <div className="lg:col-span-2 flex gap-4 justify-end text-sm">
        <span>T?m tính: {formatMoney(totals.subTotal)}</span>
        <span>Thu?: {formatMoney(totals.taxAmount)}</span>
        <span className="font-bold">T?ng: {formatMoney(totals.totalAmount)}</span>
      </div>
    </div>
  );
};
