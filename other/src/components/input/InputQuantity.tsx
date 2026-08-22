import { forwardRef } from "react";
import { InputNumber } from "antd";
import { useClientData } from "../../hooks/core/useClientData";
import { formatQuantity } from "../../utils/formatNumber";

interface InputQuantityProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  notRightAlign?: boolean;
}

export const InputQuantity = forwardRef<any, InputQuantityProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      className,
      disabled = false,
      placeholder = "",
      notRightAlign = false,
    },
    ref,
  ) => {
    const { format } = useClientData();

    return (
      <InputNumber
        ref={ref}
        value={value}
        onChange={(val) => onChange?.(val || 0)}
        min={min}
        max={max}
        formatter={(val) => (val ? formatQuantity(Number(val), format) : "")}
        parser={(val) => {
          if (!val) return 0;

          const { decimalSeparator = ".", thousandSeparator = "," } = format?.numberFormat || {};

          let sanitized = val.replace(new RegExp(`\\${thousandSeparator}`, "g"), "");

          if (decimalSeparator !== ".") {
            sanitized = sanitized.replace(new RegExp(`\\${decimalSeparator}`), ".");
          }

          const parsed = Number(sanitized);
          return isNaN(parsed) ? 0 : parsed;
        }}
        className={`w-full h-8 flex items-center ${className} ${notRightAlign ? "not-right" : ""}`}
        disabled={disabled}
        placeholder={placeholder}
      />
    );
  },
);

InputQuantity.displayName = "InputQuantity";
