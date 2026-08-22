import { Form, Input } from "antd";
import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

interface EditableHeaderTextProps<T = any> {
  value: string;
  fieldKey: keyof T;
  onUpdate?: (data: Partial<T>) => void | Promise<void>;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  required?: boolean;
  displayComponent?: React.ReactNode;
}

function EditableHeaderText<T = any>({
  value,
  fieldKey,
  onUpdate,
  placeholder,
  className = "",
  inputClassName = "h-8 text-center",
  required = true,
  displayComponent,
}: EditableHeaderTextProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isEditing]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onUpdate?.({
        [fieldKey]: values[fieldKey as string],
      } as Partial<T>);
      setIsEditing(false);
      form.resetFields();
    } catch (err) {
      console.error("Validation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full group relative ${className}`}>
      {!isEditing ? (
        <>
          {displayComponent || <p className="text-white/90 text-center">{value}</p>}
          <button
            type="button"
            title="Chỉnh sửa"
            onClick={() => {
              setIsEditing(true);
              form.setFieldsValue({ [fieldKey as string]: value });
            }}
            className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
          >
            <PencilIcon className="h-4 w-4 text-white/70 hover:text-white" />
          </button>
        </>
      ) : (
        <div className="relative">
          <Form form={form} onFinish={handleSave} className="flex justify-center">
            <Form.Item
              name={fieldKey as string}
              rules={[
                ...(required ? [{ required: true, message: "Vui lòng không để trống!" }] : []),
              ]}
              noStyle
            >
              <Input
                ref={inputRef}
                className={inputClassName}
                placeholder={placeholder}
                disabled={loading}
              />
            </Form.Item>
          </Form>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 flex gap-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="p-1 text-green-400 hover:text-green-300 disabled:opacity-50 hover:bg-white/10 rounded"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                form.resetFields();
              }}
              disabled={loading}
              className="p-1 text-red-400 hover:text-red-300 disabled:opacity-50 hover:bg-white/10 rounded"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditableHeaderText;
