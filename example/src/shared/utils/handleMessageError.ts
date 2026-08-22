import { BaseError, BaseFailurePayload } from "../interfaces/api";

export function handleErrorMessage(
  error: {
    message?: string;
    errors?: BaseError[];
  },
  method?: "add" | "get" | "update" | "delete" | "action",
  object?: string,
): BaseFailurePayload {
  const message = error?.message ?? "";
  const errors = error?.errors ?? [];

  if (Array.isArray(errors) && errors?.length > 0) {
    return {
      message:
        errors.map((err) => err.message).join(", ") ||
        message ||
        `Đã xảy ra lỗi khi ${method} ${object}`,
      errors,
    };
  }
  if (!error || errors?.length === 0) {
    return {
      message: message || "Đã xảy ra lỗi không xác định",
      errors: [],
    };
  }

  return {
    message: "Đã xảy ra lỗi không xác định",
    errors: [],
  };
}
