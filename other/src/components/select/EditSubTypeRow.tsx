import React, { useState } from "react";
import { App, Switch } from "antd";
import {
  CheckIcon,
  PencilIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { IPartnerSubType } from "../../models/partnerSubType";
import { AttributeTypeEnum } from "../../constants/enum";
import Label from "../display/Label";
import AttributeSelect from "../manager_select/AttributeSelect";

interface EditSubTypeRowProps {
  label?: string;
  width?: number;
  disabled?: boolean;

  value?: IPartnerSubType;
  placeholder?: string;
  attributeType: AttributeTypeEnum;

  onAdd?: (groupId: string) => void | Promise<void>;
  onUpdate?: (groupId: string) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  onChangeGroup?: (groupId?: string) => void;
}

const EditSubTypeRow: React.FC<EditSubTypeRowProps> = ({
  label = "Là nhà cung cấp",
  width = 144,
  disabled = false,
  value,
  placeholder = "Chọn nhóm nhà cung cấp",
  attributeType,
  onAdd,
  onUpdate,
  onDelete,
  onChangeGroup,
}) => {
  const { modal } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [tempGroupId, setTempGroupId] = useState<string | undefined>();

  const checked = !!value;
  const hasId = !!value?.id; // Đã lưu vào DB

  const handleToggle = async (nextChecked: boolean) => {
    if (nextChecked) {
      // Switch OFF → ON: Thêm mới
      setIsAdding(true);
      setIsEditing(true);
      setTempGroupId(undefined);
    } else {
      // Switch ON → OFF: Xóa (cần confirm)
      if (!hasId) {
        // Chưa có trong DB, chỉ hủy thêm mới
        setIsAdding(false);
        setIsEditing(false);
        setTempGroupId(undefined);
        return;
      }

      // Đã có trong DB, cần confirm
      modal.confirm({
        title: "Xác nhận xóa",
        icon: <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />,
        content: `Bạn có chắc muốn xóa ${label.toLowerCase()?.replace("là", "")}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk: async () => {
          setLoading(true);
          try {
            await onDelete?.();
          } finally {
            setLoading(false);
          }
        },
      });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setTempGroupId(value?.groupId);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isAdding) {
      // Hủy thêm mới → Switch về OFF
      setIsAdding(false);
      setIsEditing(false);
      setTempGroupId(undefined);
    } else {
      // Hủy edit → về readonly
      setIsEditing(false);
      setTempGroupId(undefined);
    }
  };

  const handleSubmit = async () => {
    const groupId = tempGroupId || value?.groupId;
    if (!groupId) return;

    setLoading(true);
    try {
      if (isAdding) {
        // Thêm mới
        await onAdd?.(groupId);
        setIsAdding(false);
      } else {
        // Cập nhật
        await onUpdate?.(groupId);
      }
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full">
        <Label title={label} width={width} />
        <Switch
          checked={checked || isAdding}
          loading={loading}
          disabled={disabled}
          onChange={handleToggle}
        />
      </div>
      {(checked || isAdding) &&
        (isEditing ? (
          <div className={`flex overflow-hidden pb-2`}>
            <div className="w-[calc(100%-64px)]">
              <AttributeSelect
                value={tempGroupId || value?.groupId}
                type={attributeType}
                placeholder={placeholder}
                className="w-full h-8"
                defaultData={value?.group}
                onChange={(groupId) => {
                  setTempGroupId(groupId);
                  onChangeGroup?.(groupId);
                }}
              />
            </div>
            <div className="flex flex-shrink-0 ml-2">
              <button
                type="button"
                disabled={loading || !tempGroupId}
                className="p-0 text-green-400 hover:text-green-600 disabled:opacity-50"
                onClick={handleSubmit}
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
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center justify-between h-8 px-[11px] border rounded w-[calc(100%-64px)]">
              <p>{value?.group?.name}</p>
            </div>
            {!disabled && (
              <button
                type="button"
                title="Chỉnh sửa"
                onClick={handleEdit}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <PencilIcon className="h-4 w-6 text-gray-400 hover:text-primary" />
              </button>
            )}
          </div>
        ))}
    </div>
  );
};

export default EditSubTypeRow;
