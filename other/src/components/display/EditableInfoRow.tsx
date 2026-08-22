import React, { useState } from "react";
import { Form, Input } from "antd";
import Label from "./Label";
import { CheckIcon, XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";

interface EditableInfoRowProps<T = any> {
  label: string;
  value?: string | React.ReactNode;
  bold?: boolean;
  width?: number;
  color?: string;
  fieldKey?: keyof T;
  editValue?: any;
  editComponent?: React.ReactElement;
  required?: boolean;
  onUpdate?: (data: Partial<T>) => void | Promise<void>;
  onClick?: () => void;
}

function EditableInfoRow<T = any>({
  label,
  value,
  bold,
  width = 144,
  color,
  fieldKey,
  editValue,
  editComponent = <Input className="h-8" />,
  required = false,
  onUpdate,
  onClick,
}: EditableInfoRowProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const canEdit = !!onUpdate && !!fieldKey && !!editComponent;

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

  // Clone editComponent và inject vào Form.Item
  const clonedEditComponent = editComponent
    ? React.cloneElement(editComponent, {
        disabled: loading,
      } as any)
    : null;

  return (
    <div className="flex items-start w-full group">
      <div className={`flex items-center pb-[22px]`}>
        <Label title={label} width={width} required={required && isEditing} />:
      </div>

      {!isEditing ? (
        <div
          className={`flex px-3 pt-[5.5px] ml-2 relative ${onClick ? "cursor-pointer hover:text-blue-500 transition-all ease-in-out" : ""}`}
          style={{
            width: `calc(100% - ${width + 8}px)`,
            color,
          }}
        >
          <span className="whitespace-normal break-words font-normal">{value || "--"}</span>

          {canEdit && (
            <button
              title="Chỉnh sửa"
              type="button"
              onClick={handleEdit}
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-all ease-in-out p-1 hover:bg-gray-100 rounded"
            >
              <PencilIcon className="h-4 w-4 text-gray-400 hover:text-primary" />
            </button>
          )}
        </div>
      ) : (
        <div
          className="flex items-center ml-2"
          style={{
            width: `calc(100% - ${width + 11}px)`,
          }}
        >
          <Form form={form} onFinish={handleSave} className="flex w-full" layout="vertical">
            <div className="flex w-[calc(100%-64px)]">
              <Form.Item
                name={fieldKey as string}
                rules={[
                  {
                    required: required,
                    message: "Vui lòng không để trống!",
                  },
                ]}
                className="w-full"
                noStyle={!required}
              >
                {clonedEditComponent}
              </Form.Item>
            </div>

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

export default EditableInfoRow;
