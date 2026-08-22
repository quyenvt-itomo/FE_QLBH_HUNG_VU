import { formatPercentage } from "@/shared/utils/number.util";
import { InputNumber, InputNumberProps } from "antd";
import React from "react";
import { CLASSNAME } from "@/shared/constants/ui";

interface InputPercentageProps extends Omit<
  InputNumberProps<number>,
  "value" | "onChange" | "formatter" | "parser"
> {
  value?: number;
  onChange?: (value: number) => void;
  notRightAlign?: boolean;
}

export const InputPercentage = React.forwardRef<any, InputPercentageProps>(
  ({ onChange, className, notRightAlign = false, ...rest }, ref) => {
    return (
      <InputNumber
        ref={ref}
        precision={2}
        formatter={(val) => {
          if (val === null || val === undefined) return "";
          return formatPercentage(Number(val)).replace("%", "").trim();
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
        className={`w-full flex items-center ${
          className ?? ""
        } ${notRightAlign ? "not-right" : ""}`}
        {...rest}
      />
    );
  },
);

InputPercentage.displayName = "InputPercentage";
