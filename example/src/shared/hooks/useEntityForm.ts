import { Form } from "antd";
import { Entity } from "../base/entity";
import { CodeType, setFormCode } from "../utils/form.util";
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
    if (!rowData && codeType && form) {
      setFormCode({ form, type: codeType });
      return;
    }
    form?.setFieldsValue(rowData as any);
  }, [rowData, form, open]);

  const onSuccess = () => {
    if (unCloseAfterSucess && open) {
      if (rowData) return;

      form.resetFields();
      if (codeType) {
        setFormCode({ form, type: codeType });
      }
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
