import React, { useEffect, useRef, useState } from "react";
import { Form, Tooltip } from "antd";
import Label from "../../../../../../components/display/Label";
import { CheckIcon, XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface EditInfoRowProps<T = any> {
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
}

function EditInfoRow<T = any>({
  label,
  value,
  bold,
  width = 144,
  color,
  fieldKey,
  editValue,
  editComponent,
  required = false,
  onUpdate,
}: EditInfoRowProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const inputRef = useRef<any>(null);

  const canEdit = !!onUpdate && !!fieldKey && !!editComponent;

  /* ====================== ACTIONS ====================== */
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

  const handleSave = async () => {
    try {
      if (!onUpdate || !fieldKey) return;

      const values = await form.validateFields();
      setLoading(true);

      await onUpdate({
        [fieldKey]: values[fieldKey as string],
      } as Partial<T>);

      setIsEditing(false);
      form.resetFields();
    } catch (err) {
      console.error("Validation or update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ====================== AUTO FOCUS ====================== */
  useEffect(() => {
    if (isEditing) {
      // Đảm bảo component render xong
      setTimeout(() => {
        inputRef.current?.focus?.();
      }, 0);
    }
  }, [isEditing]);

  /* ====================== CLONE EDIT COMPONENT ====================== */
  const clonedEditComponent = editComponent
    ? React.cloneElement(editComponent, {
        ref: inputRef,
        disabled: loading,
      } as any)
    : null;

  /* ====================== RENDER ====================== */
  return (
    <div className="flex items-start w-full group">
      <Label title={label} bold={bold} width={width} required={required && isEditing} />

      {!isEditing ? (
        <div
          className="flex px-[11px] pt-1.5 ml-2 relative"
          style={{
            width: `calc(100% - ${width + 8}px)`,
            color,
          }}
        >
          <span className="whitespace-normal break-words font-medium">{value || "--"}</span>

          {canEdit && (
            <button
              type="button"
              title="Chỉnh sửa"
              onClick={handleEdit}
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
            >
              <PencilIcon className="h-4 w-4 text-gray-400 hover:text-primary" />
            </button>
          )}
        </div>
      ) : (
        <div
          className="flex items-center ml-2"
          style={{
            width: `calc(100% - ${width + 8}px)`,
          }}
        >
          <Form form={form} onFinish={handleSave} className="flex flex-1" layout="vertical">
            <Form.Item shouldUpdate noStyle>
              {({ getFieldError }) => {
                const errors = getFieldError(fieldKey as string);
                const hasError = errors.length > 0;

                return (
                  <div className="relative flex-1">
                    <Form.Item
                      name={fieldKey as string}
                      rules={[
                        ...(required
                          ? [
                              {
                                required: true,
                                message: "Vui lòng không để trống!",
                              },
                            ]
                          : []),

                        ...(fieldKey === "email"
                          ? [
                              {
                                type: "email" as const,
                                message: "Email không đúng định dạng!",
                              },
                            ]
                          : []),

                        ...(fieldKey === "phone"
                          ? [
                              {
                                pattern: /^[0-9]{10,15}$/,
                                message: "Số điện thoại không hợp lệ",
                              },
                            ]
                          : []),
                      ]}
                      noStyle
                    >
                      {clonedEditComponent}
                    </Form.Item>

                    {hasError && (
                      <Tooltip
                        title={errors[0]}
                        placement="topLeft"
                        open={true}
                        trigger={[]}
                        overlayInnerStyle={{
                          backgroundColor: "#fff",
                          color: "#000",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          fontSize: 12,
                        }}
                        overlayStyle={{
                          borderRadius: 6,
                        }}
                        color="white"
                      >
                        <ExclamationCircleOutlined
                          className="
                          absolute
                          top-1
                          right-2
                          text-red-500
                          "
                        />
                      </Tooltip>
                    )}
                  </div>
                );
              }}
            </Form.Item>

            <div className="flex flex-shrink-0 ml-2">
              <button
                type="submit"
                disabled={loading}
                className="p-0 text-green-400 hover:text-green-600 disabled:opacity-50"
              >
                <CheckIcon className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="p-0 ml-2 text-red-400 hover:text-red-600 disabled:opacity-50"
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

export default EditInfoRow;
