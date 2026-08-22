import { Form } from "antd";
import { Entity } from "../base/entity";
import { CodeType } from "../utils/form.util";
import { useEffect } from "react";

interface UseEntityFormProps<T extends Entity> {
  rowData?: T;
  codeType?: CodeType;
  open?: boolean;

  handleClose?: (closeDetail?: boolean) => void;
}

export const useEntityForm = <T extends Entity>(props: UseEntityFormProps<T>) => {
  const { rowData, codeType, open, handleClose } = props;
  const [form] = Form.useForm<T>();
  const unCloseAfterSucess = Form.useWatch("__unCloseAfterSucess", form);

  useEffect(() => {
    if (!open) {
      form?.resetFields();
      return;
    }
    form?.setFieldsValue(rowData as any);
  }, [rowData, form, open]);

  const onSuccess = () => {
    if (unCloseAfterSucess && open) {
      if (rowData) return;

      form.resetFields();
      form.setFieldValue("__unCloseAfterSucess" as any, true);
      return;
    }
    handleClose?.();
  };

  return {
    form,
    unCloseAfterSucess,
    onSuccess,
  };
};
