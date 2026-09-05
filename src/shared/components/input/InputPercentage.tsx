import { AutoComplete, Input, InputNumber, InputNumberProps } from "antd";
import { formatPercentage } from "@/shared/utils/number.util";
import React from "react";

interface InputPercentageProps extends Omit<
  InputNumberProps<number>,
  "value" | "onChange" | "formatter" | "parser"
> {
  value?: number;
  onChange?: (value: number) => void;
  notRightAlign?: boolean;
  suggestions?: number[];
}

const parsePercentage = (value: string, min = 0, max = 100) => {
  const parsed = Number(value.replace(/,/g, "").replace("%", "").trim());
  if (Number.isNaN(parsed)) return 0;
  return Math.min(max, Math.max(min, parsed));
};

export const InputPercentage = React.forwardRef<any, InputPercentageProps>(
  (
    {
      value,
      onChange,
      className,
      notRightAlign = false,
      suggestions,
      addonAfter,
      min = 0,
      max = 100,
      placeholder,
      disabled,
      readOnly,
      status,
      variant,
      ...rest
    },
    ref,
  ) => {
    const suggestionItems = (suggestions || [])
      .filter((item, index, values) => Number.isFinite(item) && values.indexOf(item) === index)
      .map((item) => ({
        value: String(item),
        label: `${item}%`,
      }));

    const inputClassName = `w-full ${className ?? ""} ${notRightAlign ? "not-right" : ""}`;

    if (suggestionItems.length) {
      return (
        <AutoComplete
          options={suggestionItems}
          value={value == null ? "" : String(value)}
          onChange={(nextValue) => onChange?.(parsePercentage(nextValue, min, max))}
          onSelect={(selectedValue) => onChange?.(parsePercentage(String(selectedValue), min, max))}
          filterOption={false}
          variant="borderless"
          className="w-full"
        >
          <InputNumber
            ref={ref}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            status={status}
            variant={variant}
            className={inputClassName}
            {...rest}
          />
        </AutoComplete>
      );
    }

    return (
      <InputNumber
        ref={ref}
        value={value}
        min={min}
        max={max}
        precision={2}
        formatter={(inputValue) => {
          if (inputValue === null || inputValue === undefined) return "";
          return formatPercentage(Number(inputValue)).replace("%", "").trim();
        }}
        parser={(inputValue) => parsePercentage(inputValue || "", min, max)}
        onChange={(nextValue) => onChange?.(nextValue == null ? 0 : nextValue)}
        addonAfter={addonAfter}
        className={inputClassName}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        status={status}
        variant={variant}
        {...rest}
      />
    );
  },
);

InputPercentage.displayName = "InputPercentage";
