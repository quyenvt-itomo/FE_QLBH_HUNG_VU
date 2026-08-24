import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { Label } from "./Label";
import { CheckIcon, XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import { HEIGHT } from "@/shared/constants/ui";

interface EditableInfoColProps<T = any> {
  label?: string;
  value?: string | React.ReactNode;
  bold?: boolean;
  width?: number;
  color?: string;
  fieldKey?: keyof T;
  editValue?: any;
  editComponent?: React.ReactElement;
  required?: boolean;
  isTextArea?: boolean;
  className?: string;
  onUpdate?: (data: Partial<T>) => void | Promise<void>;
}

function EditableInfoCol<T = any>({
  label,
  value,
  bold,
  width = 254,
  color,
  fieldKey,
  editValue,
  editComponent,
  required = false,
  isTextArea = false,
  className,
  onUpdate,
}: EditableInfoColProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const inputRef = useRef<any>(null);

  const canEdit = !!onUpdate && !!fieldKey && !!editComponent;

  useEffect(() => {
    if (isEditing) {
      requestAnimationFrame(() => {
        inputRef.current?.focus?.();
      });
    }
  }, [isEditing]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    form.setFieldsValue({
      [fieldKey as string]: editValue !== undefined ? editValue : value,
    });
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    try {
      if (!onUpdate || !fieldKey) return;
      const values = await form.validateFields();
      setLoading(true);

      await onUpdate({
        [fieldKey]: values[fieldKey as string],
      } as Partial<T>);
      setIsEditing(false);
      form.resetFields();
    } catch (error) {
      console.error("Validation or update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const clonedEditComponent = editComponent
    ? React.cloneElement(editComponent, {
        disabled: loading,
        ref: inputRef,
      } as any)
    : null;

  return (
    <div className="flex flex-col w-full group">
      {label && (
        <Label
          title={label}
          bold={bold}
          width={width}
          required={required && isEditing}
          className={className}
        />
      )}

      {!isEditing ? (
        <div
          className={`
            flex px-[11px] py-1 relative w-full 
            border rounded
            `}
          style={{
            color,
            minHeight: isTextArea ? 77.6 : HEIGHT.input,
          }}
        >
          <span className="whitespace-pre-wrap break-words font-normal">{value || "--"}</span>

          {canEdit && (
            <button
              type="button"
              onClick={handleEdit}
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded trasition-colors ease-in-out"
            >
              <PencilIcon className="h-4 w-4 text-gray-400 hover:text-primary" />
            </button>
          )}
        </div>
      ) : (
        <div className={`flex items-center`}>
          <Form
            form={form}
            onFinish={handleSave}
            className={`flex flex-1 ${required ? "-mb-[22px]" : ""} ${isTextArea ? "flex-col items-end" : ""}`}
            layout="vertical"
          >
            <Form.Item
              name={fieldKey as string}
              rules={[
                {
                  required: required,
                  message: "Vui lòng không để trống!",
                },
              ]}
              className="flex-1"
              noStyle={!required}
            >
              {clonedEditComponent}
            </Form.Item>

            <div className={`flex flex-shrink-0 ${required ? "pb-[22px]" : ""}`}>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center p-0 ml-2 text-green-400 hover:text-green-600 transition-colors ease-in-out disabled:opacity-50"
              >
                <CheckIcon className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center justify-center p-0 ml-2 text-red-400 hover:text-red-600 transition-colors ease-in-out disabled:opacity-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}

export { EditableInfoCol };
