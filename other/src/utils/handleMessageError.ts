import i18next from "i18next";
import { BaseError, BaseFailurePayload } from "../stores/baseReducers";
import { ERROR } from "../constants/translate";

export type ObjectKeys = keyof typeof ERROR;

const errorKeys: string[] = [
  "required",
  "invalid",
  "not_found",
  "exists",
  "unauthorized",
  "forbidden",
  "server_error",
];

interface IError {
  code: string;
  field: string;
}

export function handleErrorMessage(
  error: any,
  method?: "add" | "get" | "update" | "delete" | "action",
  object?: ObjectKeys,
): BaseFailurePayload {
  const { message } = error;
  const errors: IError[] = error?.errors || [];

  if (errors?.length === 0) {
    let translatedMessage = message || "Đã xảy ra lỗi không xác định";

    return {
      message: translatedMessage,
      errors: [],
    };
  }

  if (!errors?.length) {
    errors.push(message || "unknown.unknown_error");
  }

  const parsedErrors: BaseError[] = [];
  const parsedMessages: string[] = [];

  if (Array.isArray(errors)) {
    errors?.forEach((error) => {
      // biến error thành mảng parts
      // const parts = error.split(".");

      let key: string = "";
      let messageKey: string = "";
      let elementKey: string | undefined;

      key = error.field || "unknown_field";
      messageKey = error.code || "unknown_error";

      parsedErrors.push({
        key,
        message: i18next.t(`error.${object || "example"}.${method || "add"}.${key}.${messageKey}`),
        elementKey,
      });

      try {
        parsedMessages.push(
          i18next.t(`error.${object || "example"}.${method || "add"}.${key}.${messageKey}`),
        );
      } catch {
        parsedMessages.push(`${key}.${messageKey}`);
      }
    });
  }

  return {
    message: parsedMessages.join(". ") || message || "Đã xảy ra lỗi không xác định",
    errors: parsedErrors,
  };
}
