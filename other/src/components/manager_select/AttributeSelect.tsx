import React, { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import { IAttribute } from "../../models/base/attribute";
import { useAttributeData } from "../../hooks/core/useAttributeData";
import ManagerSelect from "./ManagerSelect";
import { AttributeTypeEnum, attributeTypeMap } from "../../constants/enum";

interface AttributeSelectProps extends SelectProps<IAttribute> {
  type: AttributeTypeEnum;
  noBorder?: boolean;
}

const AttributeSelect: React.FC<AttributeSelectProps> = ({
  value,
  type,
  defaultData,
  placeholder,
  ref,
  className,
  disabled,
  noBorder,
  onChange,
  onChangeData,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [listAttribute, setListAttribute] = useState<IAttribute[]>([]);

  const { attributes, loading, newAttribute, addAttribute, deleteAttribute, updateAttribute } =
    useAttributeData({
      isLockHook,
      type,
      size: 10000,
      onCloseModal: () => {},
    });

  useEffect(() => {
    if (attributes.length === 0 || attributes[0].type !== type) return;

    setListAttribute(attributes);
  }, [attributes, type]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listAttribute.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListAttribute([defaultData, ...listAttribute]);
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
    <div className={`flex flex-row ${className}`}>
      <ManagerSelect<IAttribute>
        label={`Danh sách ${attributeTypeMap[type]?.toLowerCase()}`}
        options={listAttribute}
        value={value}
        loading={loading}
        newItem={newAttribute}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFocus={(e) => {
          setIsLockHook(false);
          onFocus?.(e);
        }}
        onBlur={onBlur}
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
        noBorder={noBorder}
        {...rest}
      />
    </div>
  );
};

export default AttributeSelect;
