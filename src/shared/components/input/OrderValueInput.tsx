import { Select } from "antd";
import { useEffect, useState } from "react";
import { InputMoney } from "./InputMoney";
import { InputPercentage } from "./InputPercentage";
import { DiscountType } from "@/shared/constants/enum";
import { CLASSNAME } from "@/shared/constants/ui";

export type OrderValueInputType = "discount" | "tax";

interface Props {
  discountValue?: number | null;
  discountType?: DiscountType;
  type?: OrderValueInputType;
  notRightAlign?: boolean;
  borderNone?: boolean;
  onChange?: (discountValue: number, discountType: DiscountType) => void;
}

export const OrderValueInput: React.FC<Props> = ({
  discountValue = 0,
  discountType = DiscountType.AMOUNT,
  type = "discount",
  notRightAlign,
  borderNone,
  onChange,
}) => {
  const [tempValue, setTempValue] = useState(discountValue);
  const [tempType, setTempType] = useState<DiscountType>(discountType);
  const isTax = type === "tax";

  useEffect(() => {
    setTempValue(discountValue);
    setTempType(discountType);
  }, [discountValue, discountType]);

  const triggerChange = (value: number, valueType: DiscountType) => {
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
      {tempType === DiscountType.PERCENT ? (
        <InputPercentage
          value={tempValue || undefined}
          max={100}
          min={0}
          suggestions={isTax ? [5, 8, 10] : undefined}
          onChange={(value) => triggerChange(value || 0, DiscountType.PERCENT)}
          className="!rounded-none !border-none !shadow-none !ring-0"
          placeholder={isTax ? "% VAT" : "% giảm"}
          variant="borderless"
          notRightAlign={notRightAlign}
        />
      ) : (
        <InputMoney
          value={tempValue || undefined}
          min={0}
          onChange={(value) => triggerChange(value || 0, DiscountType.AMOUNT)}
          variant="borderless"
          placeholder={isTax ? "Số tiền VAT" : "Số tiền giảm"}
          notRightAlign={notRightAlign}
        />
      )}

      <div className="h-6 w-px bg-gray-300" />

      <Select
        value={tempType === DiscountType.PERCENT ? DiscountType.PERCENT : DiscountType.AMOUNT}
        onChange={(value) => triggerChange(tempValue || 0, value)}
        options={[
          { value: DiscountType.PERCENT, label: "%" },
          { value: DiscountType.AMOUNT, label: "đ" },
        ]}
        variant="borderless"
        suffixIcon={null}
        className={`!w-9 shrink-0 !${CLASSNAME.inputHeight} !border-none !shadow-none`}
      />
    </div>
  );
};
