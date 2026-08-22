import { CLASSNAME } from "@/shared/constants/ui";

type Primitive = string | number;

export interface RadioButtonOption<T extends Primitive = Primitive> {
  label: string;
  value: T;
}

interface CustomRadioButtonGroupProps<T extends Primitive = Primitive> {
  value?: T | T[];
  onChange?: (value: T | T[]) => void;
  options: RadioButtonOption<T>[];
  multiple?: boolean;
  className?: string;
}

export function CustomRadioButtonGroup<T extends Primitive = Primitive>({
  value,
  onChange,
  options,
  multiple = false,
  className = "",
}: CustomRadioButtonGroupProps<T>) {
  const selectedValues = multiple ? (Array.isArray(value) ? (value as T[]) : []) : [value as T];

  const handleSelect = (optionValue: T) => {
    if (!multiple) {
      onChange?.(optionValue);
      return;
    }

    const current = selectedValues || [];
    const exists = current.includes(optionValue);

    const next = exists
      ? current.filter((item) => item !== optionValue)
      : [...current, optionValue];

    onChange?.(next);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isActive = selectedValues.includes(option.value);

        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={`
              ${CLASSNAME.inputHeight} px-3 rounded border text-sm font-normal transition-all
              ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:text-blue-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
