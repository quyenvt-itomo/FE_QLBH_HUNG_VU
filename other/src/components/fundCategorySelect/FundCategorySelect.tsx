import React, { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import { IAttribute } from "../../models/base/attribute";
import { useAttributeData } from "../../hooks/core/useAttributeData";
import ManagerSelect from "./ManagerSelect";
import { AttributeTypeEnum, attributeTypeMap } from "../../constants/enum";
import { useFundCategoryData } from "../../hooks/fund/useFundCategoryData";
import { IFundCategory } from "../../models/fundCategory";

interface FundCategorySelectProps extends Omit<SelectProps<IAttribute>, "onChangeData"> {
  type: AttributeTypeEnum;
  onChangeData?: (value: IFundCategory | undefined) => void;
}

const FundCategorySelect: React.FC<FundCategorySelectProps> = ({
  value,
  type,
  defaultData,
  placeholder,
  className,
  onChange,
  onChangeData,
  onFocus,
  onBlur,
}) => {
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [listAttribute, setListAttribute] = useState<IAttribute[]>([]);
  const [reload, setReload] = useState<boolean>(false);

  const { attributes, loading, addAttribute, deleteAttribute, updateAttribute } = useAttributeData({
    isLockHook: isLockHook,
    onCloseModal: () => {},
    type,
    reload,
    size: 10000,
  });

  const { newFundCategory, addFundCategory, deleteFundCategory, updateFundCategory } =
    useFundCategoryData({
      isLockHook: true,
      onCloseModal: () => {
        setReload((prev) => !prev);
      },
      size: 10000,
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
        deleteAttribute(data.id);
      }
    : undefined;

  const handleAddChild = addFundCategory
    ? (data: IFundCategory) => {
        addFundCategory(data);
      }
    : undefined;

  const handleEditChild = updateFundCategory
    ? (data: IFundCategory) => {
        updateFundCategory(data);
      }
    : undefined;

  const handleDeleteChild = deleteFundCategory
    ? (data: IFundCategory) => {
        deleteFundCategory(data.id);
      }
    : undefined;

  return (
    <div className={`flex flex-row ${className}`}>
      <ManagerSelect<IAttribute>
        label={`Danh sách ${attributeTypeMap[type]?.toLowerCase()}`}
        options={listAttribute}
        value={value}
        loading={loading}
        newItem={newFundCategory}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddChild={handleAddChild}
        onEditChild={handleEditChild}
        onDeleteChild={handleDeleteChild}
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
        type={type}
      />
    </div>
  );
};

export default FundCategorySelect;
