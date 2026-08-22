import React, { forwardRef } from "react";
import { Button, InputNumber } from "antd";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { formatMoney } from "@/shared/utils/number.util";
import { CLASSNAME } from "@/shared/constants/ui";

interface InputSettingPriceProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  notRightAlign?: boolean;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onSetting?: () => void;
}

export const InputSettingPrice = forwardRef<any, InputSettingPriceProps>(
  (
    {
      value,
      onChange,
      min = 0,
      max,
      className,
      disabled,
      placeholder = "",
      notRightAlign = false,
      onPressEnter,
      onBlur,
      onSetting,
    },
    ref,
  ) => {
    const { format } = useGlobalData();

    return (
      <div className="flex w-full">
        <InputNumber
          ref={ref}
          value={value}
          onChange={(val) => onChange?.(val || 0)}
          min={min}
          max={max}
          formatter={(val) => (val ? formatMoney(Number(val), format).replace("₫", "").trim() : "")}
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
          disabled={disabled}
          placeholder={placeholder}
          onBlur={onBlur}
          precision={0}
          className={`w-[calc(100%-36px)] rounded-e-none ${CLASSNAME.inputHeight} flex items-center z-10 ${className} ${notRightAlign ? "not-right" : ""}`}
          controls={false}
          step={1}
          onPressEnter={onPressEnter}
        />
        <Button
          htmlType="button"
          className={`!w-9 flex-shrink-0 !${CLASSNAME.inputHeight} z-0 hover:z-10 manager-btn p-0 translate-x-[-1px] rounded-s-none flex items-center justify-center`}
          onClick={onSetting}
        >
          <Cog8ToothIcon className="w-5 h-5" />
        </Button>
      </div>
    );
  },
);

InputSettingPrice.displayName = "InputSettingPrice";
