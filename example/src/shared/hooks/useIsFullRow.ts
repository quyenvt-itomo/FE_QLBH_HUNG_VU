import { useEffect } from "react";

export function useIsFullRow<T>(
  data: T[],
  requiredFields: (keyof T)[],
  onFilled: () => void,
) {
  useEffect(() => {
    const isFullRow = data.every((item) =>
      requiredFields.some((field) => {
        const value = item[field];
        return value !== undefined && value !== null && value !== "";
      }),
    );

    if (isFullRow) {
      onFilled();
    }
  }, [data, requiredFields, onFilled]);
}
