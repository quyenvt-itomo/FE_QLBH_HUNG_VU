import { forwardRef } from "react";
import { InputNumber, InputNumberProps } from "antd";
import { formatQuantity } from "@/shared/utils/number.util";

export interface InputQuantityProps extends Omit<
  InputNumberProps<number>,
  "value" | "onChange" | "formatter" | "parser"
> {
  value?: number;
  onChange?: (value: number) => void;
  notRightAlign?: boolean;
}

export const InputQuantity = forwardRef<any, InputQuantityProps>(
  ({ onChange, className, notRightAlign = false, ...rest }, ref) => {
    const decimalSeparator = ".";
    const thousandSeparator = ",";
    return (
      <InputNumber
        ref={ref}
        onChange={(val) => onChange?.(val || 0)}
        formatter={(val) => (val ? formatQuantity(Number(val)) : "")}
        parser={(val) => {
          if (!val) return 0;

          let sanitized = val.replace(new RegExp(`\\${thousandSeparator}`, "g"), "");

          if (decimalSeparator !== ".") {
            sanitized = sanitized.replace(new RegExp(`\\${decimalSeparator}`), ".");
          }

          const parsed = Number(sanitized);
          return isNaN(parsed) ? 0 : parsed;
        }}
        className={`w-full flex items-center ${className} ${notRightAlign ? "not-right" : ""}`}
        {...rest}
      />
    );
  },
);

InputQuantity.displayName = "InputQuantity";
