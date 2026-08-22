import { Form, Input } from "antd";
import { formatMoney, formatPercentage } from "../../../../../../utils/formatNumber";
import EditableInfoRow from "../../../../../../components/display/EditableInfoRow";

import { formatDateTimeDDMMYYYY } from "../../../../../../utils/dateUtils";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import Label from "../../../../../../components/display/Label";
import { useState } from "react";
import {
  CalendarDaysIcon,
  CheckIcon,
  DocumentCurrencyDollarIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { OrderDiscountInput } from "../../../../../../components/input";
import { IOrder } from "../../../../../../models/store/order";
import { DiscountTypeEnum } from "../../../../../../constants/enum";
import PartnerSelect from "../../../../../../components/select/PartnerSelect";
import { PartialProps } from "../../DetailPage";
import EmployeeSelect from "../../../../../../components/select/EmployeeSelect";

const EditDiscountRow: React.FC<{
  data: IOrder;
  onUpdate?: (data: Partial<IOrder>) => void | Promise<void>;
}> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { format } = useClientData();
  const discountValue = Form.useWatch("discountValue", form) || 0;
  const discountType = Form.useWatch("discountType", form) || false;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    form.setFieldsValue(data);
  };

  const handleSave = async (values: { discountValue: number; isDiscountPercent: boolean }) => {
    try {
      setLoading(true);
      onUpdate?.(values);
      setIsEditing(false);
      form.resetFields();
    } catch (error) {
      console.error("Validation or update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    form.resetFields();
  };

  return (
    <div className="flex items-start w-full group">
      <div className="flex items-center pb-[22px]">
        <Label title="Giảm giá đơn hàng" />:
      </div>

      {!isEditing ? (
        <div
          className="flex px-3 pt-2 ml-2 relative"
          style={{
            width: `calc(100% - 152px)`,
          }}
        >
          <span className="whitespace-normal break-words font-normal">
            {data.discountType === DiscountTypeEnum.PERCENT
              ? formatPercentage(data.discountValue, format)
              : formatMoney(data.discountValue, format) || "--"}
          </span>

          {!!onUpdate && (
            <button
              title="Chỉnh sửa"
              type="button"
              onClick={handleEdit}
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
            >
              <PencilIcon className="h-4 w-4 text-gray-400 hover:text-primary" />
            </button>
          )}
        </div>
      ) : (
        <div
          className="flex items-center ml-2"
          style={{
            width: `calc(100% - 152px)`,
          }}
        >
          <Form form={form} onFinish={handleSave} className="flex flex-1" layout="vertical">
            <Form.Item name="discountValue" hidden />
            <Form.Item name="discountType" hidden />
            <OrderDiscountInput
              discountValue={discountValue}
              discountType={discountType}
              onChange={(val, percent) => {
                form.setFieldValue("discountValue", val);
                form.setFieldValue("discountType", percent);
              }}
              notRightAlign
            />

            <div className="flex flex-shrink-0">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center p-0 ml-2 text-green-400 hover:text-green-600 transition-colors ease-in-out disabled:opacity-50"
              >
                <CheckIcon className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center justify-center p-0 ml-2 text-red-400 hover:text-red-600 transition-colors ease-in-out disabled:opacity-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

const OrderInfo: React.FC<PartialProps> = ({ data, onUpdate }) => {
  if (!data) return <></>;

  return (
    <div className="flex flex-col bg-white border rounded-lg p-4 pb-0">
      <div className="flex justify-between items-center pb-3">
        <span className="flex items-center gap-1 font-semibold bg-primary/10 w-fit px-2 py-px text-primary rounded-md">
          <DocumentCurrencyDollarIcon className="h-4 mr-1" /> {data.code}
        </span>
        <span className="flex items-center gap-1 font-semibold bg-primary/10 w-fit px-2 py-px text-primary rounded-md">
          <CalendarDaysIcon className="w-4 h-4 mr-1 mb-0.5" />{" "}
          {formatDateTimeDDMMYYYY(data.orderAt)}
        </span>
      </div>

      <EditableInfoRow<IOrder>
        label="Khách hàng"
        value={data.partner?.name}
        editValue={data.partnerId}
        fieldKey="partnerId"
        required
        editComponent={<PartnerSelect defaultData={data.partner} />}
        onUpdate={onUpdate}
      />

      <EditDiscountRow data={data} onUpdate={onUpdate} />

      <EditableInfoRow<IOrder>
        label="NV thực hiện"
        value={data.employee?.name}
        editValue={data.employeeId}
        fieldKey="employeeId"
        required
        editComponent={<EmployeeSelect defaultData={data.employee} />}
        onUpdate={onUpdate}
      />

      <EditableInfoRow<IOrder>
        label="Ghi chú đơn hàng"
        value={data.note}
        editValue={data.note}
        fieldKey="note"
        editComponent={<Input className="h-8" placeholder="Nhập ghi chú" />}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default OrderInfo;
