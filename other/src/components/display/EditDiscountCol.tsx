import { Form } from "antd";
import { useState } from "react";
import { useClientData } from "../../hooks/core/useClientData";
import { DiscountTypeEnum } from "../../constants/enum";
import { formatMoney, formatPercentage } from "../../utils/formatNumber";
import Label from "./Label";
import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { OrderDiscountInput } from "../input/OrderDiscountInput";

type HasDiscount = {
  discountValue?: number;
  discountType?: DiscountTypeEnum;
};

type EditDiscountColProps<T extends HasDiscount> = {
  data: T;
  onUpdate?: (data: Partial<T>) => void | Promise<void>;
};

export function EditDiscountCol<T extends HasDiscount>({
  data,
  onUpdate,
}: EditDiscountColProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { format } = useClientData();

  const discountValue = Form.useWatch("discountValue", form) || 0;
  const discountType = Form.useWatch("discountType", form);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    form.setFieldsValue({
      discountValue: data.discountValue,
      discountType: data.discountType,
    });
  };

  const handleSave = async (values: { discountValue: number; discountType: DiscountTypeEnum }) => {
    try {
      setLoading(true);
      await onUpdate?.(values as Partial<T>);
      setIsEditing(false);
      form.resetFields();
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
    <div className="flex flex-col items-start w-full group">
      <div className="flex items-center">
        <Label title="Giảm giá" />
      </div>

      {!isEditing ? (
        <div className="flex px-3 pt-2 ml-2 relative" style={{ width: `calc(100% - 152px)` }}>
          <span className="whitespace-normal break-words font-normal">
            {data.discountType === DiscountTypeEnum.PERCENT
              ? formatPercentage(data.discountValue || 0, format)
              : formatMoney(data.discountValue || 0, format) || "--"}
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
        <div className="flex items-center ml-2" style={{ width: `calc(100% - 152px)` }}>
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
                className="flex items-center justify-center p-0 ml-2 text-green-400 hover:text-green-600 disabled:opacity-50"
              >
                <CheckIcon className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center justify-center p-0 ml-2 text-red-400 hover:text-red-600 disabled:opacity-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
