import { Select } from "antd";
import { useEffect, useState } from "react";
import { InputMoney, InputPercentage } from ".";
import { DiscountTypeEnum } from "@/shared/constants/enum";
import { CLASSNAME } from "@/shared/constants/ui";

interface Props {
  discountValue?: number | null;
  discountType?: DiscountTypeEnum;
  notRightAlign?: boolean;
  borderNone?: boolean;
  onChange?: (discountValue: number, discountType: DiscountTypeEnum) => void;
}

export const OrderDiscountInput: React.FC<Props> = ({
  discountValue = 0,
  discountType = DiscountTypeEnum.AMOUNT,
  notRightAlign,
  borderNone,
  onChange,
}) => {
  const [tempValue, setTempValue] = useState(discountValue);
  const [tempType, setTempType] = useState<DiscountTypeEnum>(discountType);

  useEffect(() => {
    setTempValue(discountValue);
    setTempType(discountType);
  }, [discountValue, discountType]);

  const triggerChange = (value: number, type: DiscountTypeEnum) => {
    setTempValue(value);
    setTempType(type);
    onChange?.(value, type);
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
          onChange={(val) => triggerChange(val || 0, DiscountTypeEnum.PERCENT)}
          className="!border-none !shadow-none !ring-0 rounded-none"
          placeholder="% giảm"
          variant="borderless"
          notRightAlign={notRightAlign}
        />
      ) : (
        <InputMoney
          value={tempValue || undefined}
          min={0}
          onChange={(val) => triggerChange(val || 0, DiscountTypeEnum.AMOUNT)}
          variant="borderless"
          placeholder="Số tiền giảm"
          notRightAlign={notRightAlign}
        />
      )}

      <div className="w-px h-6 bg-gray-300" />

      <Select
        value={
          tempType === DiscountTypeEnum.PERCENT ? DiscountTypeEnum.PERCENT : DiscountTypeEnum.AMOUNT
        }
        onChange={(val) => triggerChange(tempValue || 0, val)}
        options={[
          {
            value: DiscountTypeEnum.PERCENT,
            label: "%",
          },
          {
            value: DiscountTypeEnum.AMOUNT,
            label: "đ",
          },
        ]}
        variant="borderless"
        suffixIcon={null}
        className={`!w-9 shrink-0 !${CLASSNAME.inputHeight} !border-none !shadow-none`}
      />
    </div>
  );
};
