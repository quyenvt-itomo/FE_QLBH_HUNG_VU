import { useEffect, useState } from "react";
import { BaseError } from "../interfaces/api";
import { handleErrorMessage } from "../utils/handleMessageError";
import useSmartNotification from "./useSmartNotification";

export const useErrorState = () => {
  const [errors, setErrors] = useState<BaseError[]>([]);
  const { notify } = useSmartNotification();

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const onError = (err: any) => {
    const errorData = handleErrorMessage(err);
    if (!errorData) return;
    notify("error", errorData.message);
    setErrors(errorData.errors);
  };

  return { notify, errors, setErrors, onError };
};
