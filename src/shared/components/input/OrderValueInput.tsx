import { Select } from "antd";
import { useEffect, useState } from "react";
import { InputMoney } from "./InputMoney";
import { InputPercentage } from "./InputPercentage";
import { DiscountTypeEnum } from "@/shared/constants/enum";
import { CLASSNAME } from "@/shared/constants/ui";

export type OrderValueInputType = "discount" | "tax";

interface Props {
  discountValue?: number | null;
  discountType?: DiscountTypeEnum;
  type?: OrderValueInputType;
  notRightAlign?: boolean;
  borderNone?: boolean;
  onChange?: (discountValue: number, discountType: DiscountTypeEnum) => void;
}

export const OrderValueInput: React.FC<Props> = ({
  discountValue = 0,
  discountType = DiscountTypeEnum.AMOUNT,
  type = "discount",
  notRightAlign,
  borderNone,
  onChange,
}) => {
  const [tempValue, setTempValue] = useState(discountValue);
  const [tempType, setTempType] = useState<DiscountTypeEnum>(discountType);
  const isTax = type === "tax";

  useEffect(() => {
    setTempValue(discountValue);
    setTempType(discountType);
  }, [discountValue, discountType]);

  const triggerChange = (value: number, valueType: DiscountTypeEnum) => {
    setTempValue(value);
    setTempType(valueType);
    onChange?.(value, valueType);
  };

  return (
    <div
      className={`flex w-full items-center overflow-hidden rounded-md transition ${CLASSNAME.inputHeight} ${
        borderNone ? CLASSNAME.inputHeight : "border border-gray-300 hover:border-primary"
      }`}
    >
      {tempType === DiscountTypeEnum.PERCENT ? (
        <InputPercentage
          value={tempValue || undefined}
          max={100}
          min={0}
          suggestions={isTax ? [5, 8, 10] : undefined}
          onChange={(value) => triggerChange(value || 0, DiscountTypeEnum.PERCENT)}
          className="!rounded-none !border-none !shadow-none !ring-0"
          placeholder={isTax ? "% VAT" : "% giảm"}
          variant="borderless"
          notRightAlign={notRightAlign}
        />
      ) : (
        <InputMoney
          value={tempValue || undefined}
          min={0}
          onChange={(value) => triggerChange(value || 0, DiscountTypeEnum.AMOUNT)}
          variant="borderless"
          placeholder={isTax ? "Số tiền VAT" : "Số tiền giảm"}
          notRightAlign={notRightAlign}
        />
      )}

      <div className="h-6 w-px bg-gray-300" />

      <Select
        value={
          tempType === DiscountTypeEnum.PERCENT ? DiscountTypeEnum.PERCENT : DiscountTypeEnum.AMOUNT
        }
        onChange={(value) => triggerChange(tempValue || 0, value)}
        options={[
          { value: DiscountTypeEnum.PERCENT, label: "%" },
          { value: DiscountTypeEnum.AMOUNT, label: "đ" },
        ]}
        variant="borderless"
        suffixIcon={null}
        className={`!w-9 shrink-0 !${CLASSNAME.inputHeight} !border-none !shadow-none`}
      />
    </div>
  );
};
