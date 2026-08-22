import React, { useEffect, useRef, useState } from "react";
import { Form, Input } from "antd";
import { CheckIcon, XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";

interface EditableInfoItemProps<T = any> {
  value?: string | React.ReactNode;
  color?: string;
  fieldKey?: keyof T;
  editValue?: any;
  editComponent?: React.ReactElement;
  required?: boolean;
  align?: "left" | "right" | "center";
  onUpdate?: (data: Partial<T>) => void | Promise<void>;
}

function EditableInfoItem<T = any>({
  value,
  color,
  fieldKey,
  editValue,
  editComponent = <Input className="h-8" />,
  required = false,
  align = "left",
  onUpdate,
}: EditableInfoItemProps<T>) {
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

      // Kiểm tra nếu giá trị không thay đổi thì không gọi onUpdate
      const currentValue = editValue !== undefined ? editValue : value;
      if (values[fieldKey as string] === currentValue) {
        setIsEditing(false);
        return;
      }

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
    <div className="flex items-start w-full group">
      {!isEditing ? (
        <div className="flex px-3 py-1.5 relative min-h-8 w-full" style={{ color }}>
          <span
            className={`whitespace-normal w-full break-words font-normal ${
              align === "right"
                ? "text-right"
                : align === "center"
                  ? "text-center w-full"
                  : "text-left"
            }`}
          >
            {value || "--"}
          </span>

          {canEdit && (
            <button
              title="Chỉnh sửa"
              type="button"
              onClick={handleEdit}
              style={align === "right" ? { left: 8 } : { right: 8 }}
              className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out p-1 hover:bg-gray-100 rounded"
            >
              <PencilIcon className="h-4 w-4 text-gray-400 hover:text-primary" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center w-full relative">
          <Form
            form={form}
            onFinish={handleSave}
            className="flex w-full items-center"
            layout="vertical"
          >
            <Form.Item
              name={fieldKey as string}
              rules={[{ required: required, message: "Vui lòng không để trống!" }]}
              className="w-full"
              noStyle
            >
              {clonedEditComponent}
            </Form.Item>

            <div
              style={align === "right" ? { left: 8 } : { right: 8 }}
              className="flex flex-shrink-0 absolute top-full z-10 gap-2"
            >
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center p-0 text-green-400 hover:text-green-600 transition-colors ease-in-out disabled:opacity-50"
              >
                <CheckIcon className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center justify-center p-0 text-red-400 hover:text-red-600 transition-colors ease-in-out disabled:opacity-50"
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

export default EditableInfoItem;
