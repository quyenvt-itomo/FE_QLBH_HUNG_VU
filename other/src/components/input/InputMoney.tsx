// import { InputNumber } from "antd";
// import React from "react";
// import { useClientData } from "../../hooks/core/useClientData";
// import { formatMoney } from "../../utils/formatNumber";

// interface InputMoneyProps {
//   ref?: React.Ref<any>;
//   value?: number;
//   onChange?: (value: number) => void;
//   min?: number;
//   className?: string;
//   disabled?: boolean;
//   placeholder?: string;
//   notRightAlign?: boolean;
//   onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
//   onBlur?: React.FocusEventHandler<HTMLInputElement>;
// }

// export const InputMoney: React.FC<InputMoneyProps> = ({
//   ref,
//   value,
//   onChange,
//   min = 0,
//   className,
//   disabled,
//   placeholder = "",
//   notRightAlign = false,
//   onPressEnter,
//   onBlur,
// }) => {
//   const { format } = useClientData();

//   return (
//     <InputNumber
//       ref={ref}
//       value={value}
//       onChange={(val) => onChange?.(val || 0)}
//       min={min}
//       formatter={(val) => (val ? formatMoney(Number(val), format).replace("₫", "").trim() : "")}
//       parser={(val) => {
//         if (!val) return 0;

//         const { decimalSeparator = ".", thousandSeparator = "," } = format?.numberFormat || {};

//         let sanitized = val.replace(new RegExp(`\\${thousandSeparator}`, "g"), "");

//         if (decimalSeparator !== ".") {
//           sanitized = sanitized.replace(new RegExp(`\\${decimalSeparator}`), ".");
//         }

//         const parsed = Number(sanitized);
//         return isNaN(parsed) ? 0 : parsed;
//       }}
//       disabled={disabled}
//       placeholder={placeholder}
//       onBlur={onBlur}
//       precision={0}
//       className={`w-full h-8 flex items-center ${className} ${notRightAlign ? "not-right" : ""}`}
//       controls={false}
//       stringMode={false}
//       step={1}
//       onPressEnter={onPressEnter}
//     />
//   );
// };
import React, { forwardRef } from "react";
import { InputNumber } from "antd";
import { useClientData } from "../../hooks/core/useClientData";
import { formatMoney } from "../../utils/formatNumber";

interface InputMoneyProps {
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
}

export const InputMoney = forwardRef<any, InputMoneyProps>(
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
        className={`w-full h-8 flex items-center ${className} ${notRightAlign ? "not-right" : ""}`}
        controls={false}
        step={1}
        onPressEnter={onPressEnter}
      />
    );
  },
);

InputMoney.displayName = "InputMoney";
