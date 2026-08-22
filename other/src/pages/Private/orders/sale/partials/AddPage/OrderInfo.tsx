import { Form, Input } from "antd";
import { PartialProps } from "../../AddPage";
import Label from "../../../../../../components/display/Label";
import { InputQuantity, OrderDiscountInput } from "../../../../../../components/input";
import { TimePickerCustom } from "../../../../../../components/input/TimePickerCustom";
import EmployeeSelect from "../../../../../../components/select/EmployeeSelect";
import CustomerSelect from "../../../../../../components/add_select/CustomerSelect";
import { DocumentCurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

const OrderInfo: React.FC<PartialProps> = ({ form, onFormChange }) => {
  const partner = Form.useWatch("partner", form);
  const employee = Form.useWatch("employee", form);
  const discountValue = Form.useWatch("discountValue", form);
  const discountType = Form.useWatch("discountType", form);
  const [orderAt, setOrderAt] = useState<Dayjs>(dayjs());

  useEffect(() => {
    // 1 giây cập nhật lại một lần

    setInterval(() => {
      setOrderAt(dayjs());
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col bg-white border rounded-lg p-4">
      <div className="flex justify-between items-center pb-[22px]">
        <Form.Item name="code" noStyle>
          <Input
            style={{ height: 32, width: 224 }}
            placeholder="Nhập mã đơn hàng"
            prefix={<DocumentCurrencyDollarIcon className="h-4 text-gray-400 mr-1" />}
          />
        </Form.Item>
        <TimePickerCustom value={orderAt} style={{ width: 224 }} disabled />
      </div>
      <div className="relative">
        <Form.Item name="partnerId" label={<Label title="Khách hàng" />}>
          <CustomerSelect
            defaultData={partner}
            onChangeData={(data) => {
              form.setFieldValue("partner", data);
              onFormChange?.();
            }}
          />
        </Form.Item>
        <Form.Item name="partner" hidden />
      </div>
      <div className="flex gap-2.5 w-full pb-[22px]">
        <Form.Item name="discountValue" hidden />
        <Form.Item name="discountType" hidden />
        <Label title="Giảm giá đơn hàng" />
        <OrderDiscountInput
          discountValue={discountValue}
          discountType={discountType}
          onChange={(value, type) => {
            form.setFieldValue("discountValue", value);
            form.setFieldValue("discountType", type);
            onFormChange?.();
          }}
          notRightAlign
        />
      </div>
      <div className="flex gap-2.5 relative pb-[22px]">
        <Label title="Điểm sử dụng" />
        <Form.Item name="loyaltyPointsUsed" noStyle>
          <InputQuantity
            max={partner?.loyaltyPoints}
            notRightAlign
            placeholder={partner ? `Tối đa ${partner.loyaltyPoints} điểm` : "Nhập điểm sử dụng"}
          />
        </Form.Item>
        <span className="absolute top-8 left-[152px] text-[10px] italic text-gray-400">
          Quy đổi: 1 điểm = 1,000₫
        </span>
      </div>
      <Form.Item name="employeeId" label={<Label title="Nhân viên thực hiện" />}>
        <EmployeeSelect
          defaultData={employee}
          onChangeData={(data) => {
            form.setFieldValue("employee", data);
            onFormChange?.();
          }}
        />
      </Form.Item>
      <Form.Item name="employee" hidden />
      <div className="flex gap-2.5">
        <Label title="Ghi chú đơn hàng" />
        <Form.Item name="note" noStyle>
          <Input className="h-8" placeholder="Nhập ghi chú" />
        </Form.Item>
      </div>
    </div>
  );
};

export default OrderInfo;
