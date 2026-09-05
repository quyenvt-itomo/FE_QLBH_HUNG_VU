import { Minus, Plus } from "lucide-react";
import { InputQuantity, InputQuantityProps } from "./InputQuantity";

interface QuantityStepperProps extends Omit<InputQuantityProps, "size"> {
  onDecrement?: (e: React.MouseEvent) => void;
  onIncrement?: (e: React.MouseEvent) => void;
  allowInput?: boolean;
  size?: "sm" | "md";
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  onDecrement,
  onIncrement,
  allowInput = false,
  size = "md",
  className = "",
  max,
  ...rest
}) => {
  const btnSize = size === "sm" ? "!w-5 !h-5" : "!w-6 !h-6";
  const iconSize = size === "sm" ? "!w-2.5 !h-2.5" : "!w-3.5 !h-3.5";
  const padding = size === "sm" ? "p-0.5" : "p-1";
  const valueClass = size === "sm" ? "!w-10 !h-5 text-xs" : "!w-12 !h-6 text-sm";

  const handleIncrement = (e: React.MouseEvent) => {
    onIncrement?.(e);
    if (value && max !== undefined && value >= max) return;
    onChange?.((value ?? 0) + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    onDecrement?.(e);
    if (!value || value <= 0) return;
    onChange?.((value ?? 0) - 1);
  };

  return (
    <div
      className={`inline-flex items-center ${padding} bg-slate-100 dark:bg-slate-800 rounded-full w-full quantity-stepper-input ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleDecrement}
        className={`${btnSize} rounded-full flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 active:scale-90 transition-transform flex-shrink-0`}
      >
        <Minus className={`${iconSize} text-primary`} />
      </button>
      {allowInput ? (
        <InputQuantity
          value={value}
          variant="borderless"
          className={`${valueClass} flex-1 bg-transparent text-primary dark:text-white !text-center font-semibold`}
          onChange={onChange}
          max={max}
          {...rest}
        />
      ) : (
        <span
          className={`${size === "sm" ? "min-w-[20px] text-xs" : "min-w-[24px] text-sm"} flex-1 px-2 text-primary dark:text-white text-center font-semibold select-none`}
        >
          {value}
        </span>
      )}
      <button
        type="button"
        onClick={handleIncrement}
        className={`${btnSize} rounded-full flex items-center justify-center bg-primary active:scale-90 transition-transform flex-shrink-0`}
      >
        <Plus className={`${iconSize} text-white`} />
      </button>
    </div>
  );
};
