import { useEffect, useRef } from "react";

export function useAutoFocus<T extends { focus?: () => void }>(
  open: boolean,
  delay = 300,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        ref.current?.focus?.();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [open, delay]);

  return ref;
}
