import React, { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import { IAttribute } from "../../models/base/attribute";
import { useAttributeData } from "../../hooks/core/useAttributeData";
import ManagerSelect from "./ManagerSelect";
import { AttributeTypeEnum, attributeTypeMap } from "../../constants/enum";

const ProductCategorySelect: React.FC<SelectProps<IAttribute>> = ({
  value,
  defaultData,
  placeholder,
  ref,
  className,
  onChange,
  onChangeData,
  onFocus,
  onBlur,
}) => {
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [listAttribute, setListAttribute] = useState<IAttribute[]>([]);

  const { attributes, loading, newAttribute, addAttribute, deleteAttribute, updateAttribute } =
    useAttributeData({
      isLockHook: isLockHook,
      onCloseModal: () => {},
      type: AttributeTypeEnum.PRODUCT_CATEGORY,
      size: 10000,
    });

  useEffect(() => {
    if (attributes.length === 0 || attributes[0].type !== AttributeTypeEnum.PRODUCT_CATEGORY)
      return;

    setListAttribute(attributes);
  }, [attributes]);

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
          type: AttributeTypeEnum.PRODUCT_CATEGORY,
        });
      }
    : undefined;

  const handleEdit = updateAttribute
    ? (data: IAttribute) => {
        updateAttribute({
          ...data,
          type: AttributeTypeEnum.PRODUCT_CATEGORY,
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
        label={`Danh sách ${attributeTypeMap[AttributeTypeEnum.PRODUCT_CATEGORY]?.toLowerCase()}`}
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
          placeholder !== undefined
            ? placeholder
            : `Chọn ${attributeTypeMap[AttributeTypeEnum.PRODUCT_CATEGORY]?.toLowerCase()}`
        }
        ref={ref}
        type={AttributeTypeEnum.PRODUCT_CATEGORY}
      />
    </div>
  );
};

export default ProductCategorySelect;
