import { useEffect, useState } from "react";

interface UseNotFoundGuardProps<T> {
  id: string | number | undefined;
  loading: boolean;
  data: T | null | undefined;
  delay?: number; // default 1000ms
}

export function useNotFoundGuard<T>({
  id,
  loading,
  data,
  delay = 1000,
}: UseNotFoundGuardProps<T>) {
  const [showNotFound, setShowNotFound] = useState(false);

  useEffect(() => {
    if (!loading && (!id || !data)) {
      const timer = setTimeout(() => {
        setShowNotFound(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setShowNotFound(false);
    }
  }, [loading, id, data]);

  return showNotFound;
}
