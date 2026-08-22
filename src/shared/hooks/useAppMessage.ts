import { App, type FormProps } from "antd";
import { useEffect, useState } from "react";

type OnFinishFailedArg = Parameters<NonNullable<FormProps["onFinishFailed"]>>[0];

export const useAppMessage = () => {
  const { message } = App.useApp();
  const [errorCells, setErrorCells] = useState<Map<number, Set<string>>>(new Map());
  useEffect(() => {
    if (errorCells.size === 0) return;

    const timer = setTimeout(() => setErrorCells(new Map()), 2000);

    return () => clearTimeout(timer);
  }, [errorCells]);

  const showFormErrorMessages = (errorInfo: OnFinishFailedArg, duration = 5) => {
    const errorMessages = Array.from(
      new Set(errorInfo.errorFields.flatMap((field) => field.errors)),
    );

    if (errorMessages.length === 0) return;

    message.error({
      content: errorMessages.join(", "),
      duration,
    });

    // Nếu lỗi nằm trong Form.List, highlight các cell bị lỗi
    const listErrorCells = errorInfo.errorFields
      .filter((field) => field.name.length > 1) // Chỉ lấy các field có index (Form.List)
      .reduce((acc, field) => {
        const index = field.name[0] as number;
        const key = field.name[1] as string;
        if (!acc.has(index)) {
          acc.set(index, new Set());
        }
        acc.get(index)?.add(key);
        return acc;
      }, new Map<number, Set<string>>());

    if (listErrorCells.size > 0) {
      setErrorCells(listErrorCells);
    }
  };

  return {
    message,
    showFormErrorMessages,
    errorCells,
    setErrorCells,
  };
};
