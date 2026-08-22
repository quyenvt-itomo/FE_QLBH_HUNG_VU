import { InputNumber } from "antd";
import React from "react";
import { useClientData } from "../../hooks/core/useClientData";
import { formatPercentage } from "../../utils/formatNumber";

interface InputPercentageProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  placeholder?: string;
  notRightAlign?: boolean;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const InputPercentage = React.forwardRef<any, InputPercentageProps>(
  (
    {
      value,
      onChange,
      min = 0,
      max = 100,
      className,
      placeholder,
      notRightAlign,
      onPressEnter,
      onBlur,
    },
    ref,
  ) => {
    const { format } = useClientData();

    return (
      <InputNumber
        ref={ref}
        value={value}
        min={min}
        max={max}
        precision={0}
        formatter={(val) => {
          if (val === null || val === undefined) return "";
          return formatPercentage(Number(val), format).replace("%", "").trim();
        }}
        parser={(val) => {
          const sanitized = val?.replace(/,/g, "") || "";
          const parsed = Number(sanitized);
          return Number.isNaN(parsed) ? 0 : parsed;
        }}
        onChange={(val) => {
          if (val === null) {
            onChange?.(0); // hoặc undefined nếu BE cho phép
            return;
          }
          onChange?.(val);
        }}
        className={`w-full h-8 flex items-center ${
          className ?? ""
        } ${notRightAlign ? "not-right" : ""}`}
        placeholder={placeholder}
        onPressEnter={onPressEnter}
        onBlur={onBlur}
      />
    );
  },
);

InputPercentage.displayName = "InputPercentage";
