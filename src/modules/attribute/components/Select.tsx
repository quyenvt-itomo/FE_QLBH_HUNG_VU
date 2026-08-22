import React, { useEffect, useState } from "react";
import { Attribute } from "../attribute.model";
import { AttributeType, attributeTypeMap } from "../attribute.enum";
import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { useAttributeStore } from "../attribute.store";
import ManagerSelect from "@/shared/components/manager_select/ManagerSelect";
import MultipleManagerSelect from "@/shared/components/multiple_manager_selects/MultipleManagerSelect";
import { SortOrderEnum } from "@/shared/constants/enum";

interface AttributeManagerSelectProps extends SelectProps<Attribute> {
  type: AttributeType;
  noBorder?: boolean;
}

export const AttributeManagerSelect: React.FC<AttributeManagerSelectProps> = ({
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
  const [listAttribute, setListAttribute] = useState<Attribute[]>([]);

  const { data, loading, creating, updating, deleting, newItem, create, remove, update } =
    useAttributeStore({
      isLocked: isLockHook,
      type,
      size: 10000,
    });

  useEffect(() => {
    if (data.length === 0 || data[0].type !== type) return;

    setListAttribute(data);
  }, [data, type]);

  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listAttribute.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListAttribute([defaultData, ...listAttribute]);
  }, [defaultData, listAttribute]);

  const handleAdd = create
    ? (data: Attribute) => {
        create({
          ...data,
          type: type,
        });
      }
    : undefined;

  const handleEdit = update
    ? (data: Attribute) => {
        update({
          ...data,
          type: type,
        });
      }
    : undefined;

  const handleDelete = remove
    ? (data: Attribute) => {
        if (!data.id) return;
        remove(data.id);
      }
    : undefined;

  return (
    <div className={`flex flex-row ${className}`}>
      <ManagerSelect<Attribute>
        label={`Danh sách ${attributeTypeMap[type]?.toLowerCase()}`}
        options={listAttribute}
        value={value}
        loading={loading || creating || updating || deleting}
        newItem={newItem}
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

interface AttributeManagerMultipleSelectProps extends MultipleSelectProps<Attribute> {
  type: AttributeType;
}

export const AttributeManagerMultipleSelect: React.FC<AttributeManagerMultipleSelectProps> = ({
  value,
  type,
  defaultData,
  placeholder,
  ref,
  disabled,
  suffixIcon,
  prefix,
  hideOptions,
  onChange,
  onChangeData,
  onFocus,
  onBlur,
}) => {
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [listAttribute, setListAttribute] = useState<Attribute[]>([]);

  const { data, loading, creating, updating, deleting, newItem, create, remove, update } =
    useAttributeStore({
      isLocked,
      type,
      size: 10000,
      sortOrder: SortOrderEnum.ASC,
      sortBy: "name",
    });

  useEffect(() => {
    if (data.length === 0 || data[0].type !== type) return;

    setListAttribute(data);
  }, [data, type]);

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

  const handleAdd = create
    ? (data: Attribute) => {
        create({
          ...data,
          type: type,
        });
      }
    : undefined;

  const handleEdit = update
    ? (data: Attribute) => {
        update({
          ...data,
          type: type,
        });
      }
    : undefined;

  const handleDelete = remove
    ? (data: Attribute) => {
        if (!data.id) return;
        remove(data.id);
      }
    : undefined;

  return (
    <div className="flex flex-row">
      <MultipleManagerSelect<Attribute>
        label={`Danh sách ${attributeTypeMap[type]?.toLowerCase()}`}
        options={listAttribute}
        value={value}
        newItem={newItem}
        loading={loading || creating || updating || deleting}
        onAdd={handleAdd}
        onFocus={(e) => {
          setIsLocked(false);
          onFocus?.(e);
        }}
        onBlur={onBlur}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onChange={onChange}
        onChangeData={onChangeData}
        onManage={() => {
          setIsLocked(false);
        }}
        placeholder={
          placeholder !== undefined ? placeholder : `Chọn ${attributeTypeMap[type]?.toLowerCase()}`
        }
        ref={ref}
        type={type}
        disabled={disabled}
        suffixIcon={suffixIcon}
        prefix={prefix}
        hideOptions={hideOptions}
      />
    </div>
  );
};
