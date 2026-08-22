import React, { forwardRef } from "react";
import { InputNumber, InputNumberProps } from "antd";
import { formatMoney } from "@/shared/utils/number.util";

interface InputMoneyProps extends Omit<
  InputNumberProps<number>,
  "value" | "onChange" | "formatter" | "parser"
> {
  value?: number;
  onChange?: (value: number) => void;
  notRightAlign?: boolean;
}

export const InputMoney = forwardRef<any, InputMoneyProps>(
  ({ onChange, className, notRightAlign = false, ...rest }, ref) => {
    const decimalSeparator = ".";
    const thousandSeparator = ",";
    return (
      <InputNumber
        ref={ref}
        onChange={(val) => onChange?.(val || 0)}
        formatter={(val) => (val ? formatMoney(Number(val)).replace("₫", "").trim() : "")}
        parser={(val) => {
          if (!val) return 0;

          let sanitized = val.replace(new RegExp(`\\${thousandSeparator}`, "g"), "");

          if (decimalSeparator !== ".") {
            sanitized = sanitized.replace(new RegExp(`\\${decimalSeparator}`), ".");
          }

          const parsed = Number(sanitized);
          return isNaN(parsed) ? 0 : parsed;
        }}
        precision={0}
        className={`w-full flex items-center ${className} ${notRightAlign ? "not-right" : ""}`}
        controls={false}
        step={1}
        {...rest}
      />
    );
  },
);

InputMoney.displayName = "InputMoney";
