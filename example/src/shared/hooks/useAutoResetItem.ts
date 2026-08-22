import { useEffect, useState } from "react";

export function useAutoResetItem<T>(initialValue?: T) {
  const [value, setValue] = useState<T | undefined>(initialValue);

  useEffect(() => {
    if (value === undefined) return;

    const timeout = setTimeout(() => {
      setValue(undefined);
    }, 0); // reset ngay tick sau

    return () => clearTimeout(timeout);
  }, [value]);

  return [value, setValue] as const;
}
