import React, { useEffect, useState } from "react";
import { MultipleSelectProps } from "../../models/base/select";
import { IAttribute } from "../../models/base/attribute";
import { useAttributeData } from "../../hooks/core/useAttributeData";
import ManagerSelect from "./ManagerSelect";
import { AttributeTypeEnum, attributeTypeMap } from "../../constants/enum";

interface AttributeSelectProps extends MultipleSelectProps<IAttribute> {
  type: AttributeTypeEnum;
}

const AttributeSelect: React.FC<AttributeSelectProps> = ({
  value,
  type,
  defaultData,
  placeholder,
  ref,
  disabled,
  onChange,
  onChangeData,
  onFocus,
  onBlur,
}) => {
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [listAttribute, setListAttribute] = useState<IAttribute[]>([]);

  const { attributes, newAttribute, loading, addAttribute, deleteAttribute, updateAttribute } =
    useAttributeData({
      isLockHook: isLockHook,
      onCloseModal: () => {},
      type,
      size: 10000,
    });

  useEffect(() => {
    if (attributes.length === 0 || attributes[0].type !== type) return;

    setListAttribute(attributes);
  }, [attributes, type]);

  useEffect(() => {
    if (!defaultData) return;

    const exists = defaultData.every((attr) => listAttribute.some((item) => item.id === attr.id));
    if (exists) return;
    const filtered = defaultData.filter(
      (attr) => !listAttribute.some((item) => item.id === attr.id),
    );
    if (filtered.length === 0) return;

    setListAttribute([...filtered, ...listAttribute]);
  }, [defaultData, listAttribute]);

  const handleAdd = addAttribute
    ? (data: IAttribute) => {
        addAttribute({
          ...data,
          type: type,
        });
      }
    : undefined;

  const handleEdit = updateAttribute
    ? (data: IAttribute) => {
        updateAttribute({
          ...data,
          type: type,
        });
      }
    : undefined;

  const handleDelete = deleteAttribute
    ? (data: IAttribute) => {
        if (!data.id) return;
        deleteAttribute(data.id);
      }
    : undefined;

  return (
    <div className="flex flex-row">
      <ManagerSelect<IAttribute>
        label={`Danh sách ${attributeTypeMap[type]?.toLowerCase()}`}
        options={listAttribute}
        value={value}
        newItem={newAttribute}
        loading={loading}
        onAdd={handleAdd}
        onFocus={(e) => {
          setIsLockHook(false);
          onFocus?.(e);
        }}
        onBlur={onBlur}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onChange={onChange}
        onChangeData={onChangeData}
        onManage={() => {
          setIsLockHook(false);
        }}
        placeholder={
          placeholder !== undefined ? placeholder : `Chọn ${attributeTypeMap[type]?.toLowerCase()}`
        }
        ref={ref}
        type={type}
        disabled={disabled}
      />
    </div>
  );
};

export default AttributeSelect;
