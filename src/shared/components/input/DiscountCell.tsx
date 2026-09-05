import { Select } from "antd";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { InputMoney, InputPercentage } from ".";
import { formatMoney } from "@/shared/utils/number.util";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { CLASSNAME } from "@/shared/constants/ui";

interface DiscountCellProps {
  price: number;
  discount: number;
  isDiscountPercent: boolean;
  onChange: (value: number, isPercent: boolean) => void;
}

export const PriceContent: React.FC<{
  price: number;
  discount: number;
  isDiscountPercent: boolean;
  onClick?: () => void;
}> = ({ price, discount, isDiscountPercent, onClick }) => {
  const { format } = useGlobalData();
  const discountedPrice = isDiscountPercent ? price * (1 - discount / 100) : price - discount;
  return discount ? (
    <div
      className={`flex flex-col items-end px-2.5 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <span className="text-gray-400 line-through text-sm">{formatMoney(price, format)}</span>
      <span className="text font-medium text-sm">{formatMoney(discountedPrice, format)}</span>
    </div>
  ) : (
    <div className={`flex items-end px-2.5 ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      <span className="text font-medium text-sm">{formatMoney(price, format)}</span>
    </div>
  );
};

export const DiscountCell: React.FC<DiscountCellProps> = ({
  price,
  discount,
  isDiscountPercent,
  onChange,
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(discount);
  const [tempIsPercent, setTempIsPercent] = useState(isDiscountPercent);

  const handleSave = () => {
    onChange(tempValue, tempIsPercent);
    setEditing(false);
  };

  return editing ? (
    <div className="flex">
      <div className="flex items-center flex-1 overflow-hidden rounded-lg border border-gray-300 hover:border-primary transition">
        {isDiscountPercent ? (
          <InputPercentage
            value={tempValue}
            min={0}
            max={100}
            onChange={(val) => setTempValue(val || 0)}
            onPressEnter={handleSave}
            className="
            !border-none !shadow-none !ring-0 rounded-none
            "
            placeholder="Nhập phần trăm giảm giá"
          />
        ) : (
          <InputMoney
            value={tempValue}
            min={0}
            onChange={(val) => setTempValue(val || 0)}
            onPressEnter={handleSave}
            className="
            !border-none !shadow-none !ring-0 rounded-none
            "
            placeholder="Nhập số tiền giảm giá"
          />
        )}
        <div className="w-px h-6 bg-gray-300" />
        <Select
          value={tempIsPercent ? "%" : "đ"}
          onChange={(val) => setTempIsPercent(val === "%")}
          options={[
            { value: "%", label: "%" },
            { value: "đ", label: "đ" },
          ]}
          variant="borderless"
          suffixIcon={null}
          className={`
        ${CLASSNAME.inputHeight} !w-10 shrink-0
        !border-none 
        !shadow-none
      `}
        />
      </div>
      <button
        type="button"
        onClick={handleSave}
        className={`
        ${CLASSNAME.inputHeight} w-10 
        flex items-center justify-center rounded-lg
        text-green-400
        hover:text-green-500 hover:bg-green-50
        transition-all ease-in-out
      `}
      >
        <CheckIcon className="h-6 w-6" />
      </button>
    </div>
  ) : (
    <PriceContent
      discount={discount}
      isDiscountPercent={isDiscountPercent}
      price={price}
      onClick={() => setEditing(true)}
    />
  );
};
