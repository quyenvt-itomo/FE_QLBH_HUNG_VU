import { Form, Input } from "antd";
import { PartialProps } from "../../AddPage";
import Label from "../../../../../../components/display/Label";
import { OrderDiscountInput } from "../../../../../../components/input";
import { TimePickerCustom } from "../../../../../../components/input/TimePickerCustom";
import EmployeeSelect from "../../../../../../components/select/EmployeeSelect";
import { DocumentCurrencyDollarIcon } from "@heroicons/react/24/outline";

const OrderInfo: React.FC<PartialProps> = ({ form }) => {
  const employee = Form.useWatch("employee", form);
  const discountValue = Form.useWatch("discountValue", form);
  const discountType = Form.useWatch("discountType", form);

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
        <Form.Item name="orderAt" noStyle>
          <TimePickerCustom style={{ width: 224 }} />
        </Form.Item>
      </div>

      <Form.Item name={["partner", "name"]} label={<Label title="Nhà cung cấp" />}>
        <Input className="h-8" disabled />
      </Form.Item>
      <Form.Item name="partnerId" hidden />

      <div className="flex gap-3 w-full pb-[22px]">
        <Form.Item name="discountValue" hidden />
        <Form.Item name="discountType" hidden />
        <Label title="Giảm giá đơn hàng" />
        <OrderDiscountInput
          discountValue={discountValue}
          discountType={discountType}
          onChange={(value, type) => {
            form.setFieldValue("discountValue", value);
            form.setFieldValue("discountType", type);
          }}
          notRightAlign
        />
      </div>
      <Form.Item name="employeeId" label={<Label title="Nhân viên thực hiện" />}>
        <EmployeeSelect defaultData={employee} />
      </Form.Item>
      <div className="flex gap-3">
        <Label title="Ghi chú đơn hàng" />
        <Form.Item name="note" noStyle>
          <Input className="h-8" placeholder="Nhập ghi chú" />
        </Form.Item>
      </div>
    </div>
  );
};

export default OrderInfo;
