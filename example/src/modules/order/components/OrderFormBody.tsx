import React from "react";
import { Form, Input, DatePicker } from "antd";
import { calculateOrder } from "../order.util";
import { PartnerSelect } from "@/modules/partner/components/Select";
import { PartnerType } from "@/modules/partner/partner.model";
import { EmployeeSelect } from "@/modules/employee/components/Select";
import { formatMoney } from "@/shared/utils/number.util";

interface Props {
  form: any;
}

export const OrderFormBody: React.FC<Props> = ({ form }) => {
  const lines = Form.useWatch("lines", form);
  const totals = calculateOrder({ lines } as any);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Form.Item name="code" label="Số đơn" className="mb-0">
        <Input disabled />
      </Form.Item>
      <Form.Item name="timeAt" label="Ngày" rules={[{ required: true }]} className="mb-0">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true }]} className="mb-0">
        <PartnerSelect query={{ types: [PartnerType.CUSTOMER] }} />
      </Form.Item>
      <Form.Item name="staffId" label="NV phụ trách" className="mb-0">
        <EmployeeSelect />
      </Form.Item>
      <Form.Item name="note" label="Ghi chú" className="mb-0">
        <Input.TextArea rows={2} />
      </Form.Item>
      <div className="lg:col-span-2 flex gap-4 justify-end text-sm">
        <span>Tạm tính: {formatMoney(totals.subTotal)}</span>
        <span>Thuế: {formatMoney(totals.taxAmount)}</span>
        <span className="font-bold">Tổng: {formatMoney(totals.totalAmount)}</span>
      </div>
    </div>
  );
};
