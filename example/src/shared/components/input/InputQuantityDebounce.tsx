import React, { useEffect, useState } from "react";
import { InputQuantity } from ".";

interface InputQuantityDebounceProps {
  value?: number;
  onChange?: (value: number) => void;
  delay?: number;
  [key: string]: any;
}

export const InputQuantityDebounce: React.FC<InputQuantityDebounceProps> = ({
  value,
  onChange,
  delay = 300,
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState<number | undefined>(value);

  // Sync value từ ngoài vào
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce change
  useEffect(() => {
    const t = setTimeout(() => {
      if (internalValue !== value) onChange?.(internalValue || 0);
    }, delay);

    return () => clearTimeout(t);
  }, [internalValue, delay]);

  return (
    <InputQuantity
      value={internalValue}
      onChange={(v) => setInternalValue(v)}
      {...rest}
    />
  );
};
