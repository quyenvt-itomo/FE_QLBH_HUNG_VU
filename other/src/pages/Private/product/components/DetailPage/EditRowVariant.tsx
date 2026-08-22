import React, { useState } from "react";
import { CheckIcon, XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import Label from "../../../../../components/display/Label";

interface EditRowVariantProps<T = any> {
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

function EditRowVariant<T = any>({
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
}: EditRowVariantProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentValue, setCurrentValue] = useState<any>();

  const canEdit = !!onUpdate && !!fieldKey && !!editComponent;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setCurrentValue(editValue ?? value);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setCurrentValue(undefined);
  };

  const handleSave = async () => {
    if (!onUpdate || !fieldKey) return;

    if (required && (currentValue === undefined || currentValue === "")) {
      return;
    }

    try {
      setLoading(true);
      await onUpdate({
        [fieldKey]: currentValue,
      } as Partial<T>);
      setIsEditing(false);
      setCurrentValue(undefined);
    } finally {
      setLoading(false);
    }
  };

  // Clone input và inject value + onChange
  const clonedEditComponent = editComponent
    ? React.cloneElement(editComponent, {
        value: currentValue,
        disabled: loading,
        onChange: (val: any) => {
          // hỗ trợ cả Input và InputMoney
          const nextValue = val?.target !== undefined ? val.target.value : val;
          setCurrentValue(nextValue);
        },
      } as any)
    : null;

  return (
    <div className="flex items-start w-full group">
      <div className="flex items-center pb-[22px]">
        <Label title={label} width={width} required={required && isEditing} />:
      </div>

      {!isEditing ? (
        <div
          className="flex px-3 pt-2 ml-2 relative"
          style={{
            width: `calc(100% - ${width + 8}px)`,
            color,
            fontWeight: bold ? 600 : 400,
          }}
        >
          <span className="whitespace-normal break-words">{value || "--"}</span>

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
          <div className="flex flex-1">{clonedEditComponent}</div>

          <div className={`flex flex-shrink-0 ${required ? "pb-[22px]" : ""}`}>
            <button
              type="button"
              onClick={handleSave}
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
        </div>
      )}
    </div>
  );
}

export default EditRowVariant;
