import { useEffect, useState } from "react";
import { MultipleSelectProps } from "../../models/base/select";
import { IAttribute } from "../../models/base/attribute";
import { useAttributeData } from "../../hooks/core/useAttributeData";
import { AttributeTypeEnum } from "../../constants/enum";
import { filterAttributesByType } from "../../utils/common";
import { TreeSelect } from "antd";
import { buildTree } from "../tree_select/ManagerSelect";
import { IconArrowDown } from "../icon/ArrowDown";
import { removeVietnameseTones } from "../../utils/searchUtils";

export const ProductGroupSelect: React.FC<MultipleSelectProps<IAttribute>> = ({
  value,
  defaultData,
  placeholder,
  prefix,
  suffixIcon,
  onChange,
  onChangeData,
  onFocus,
  onBlur,
}) => {
  const [listAttribute, setListAttribute] = useState<IAttribute[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);

  const { attributes, loading } = useAttributeData({
    isLockHook,
    type: AttributeTypeEnum.PRODUCT_CATEGORY,
  });

  useEffect(() => {
    if (attributes.length === 0 || attributes[0].type !== AttributeTypeEnum.PRODUCT_CATEGORY)
      return;
    const filterData = filterAttributesByType(attributes, AttributeTypeEnum.PRODUCT_CATEGORY);

    setListAttribute((prevList) => {
      const newValues = new Set(filterData.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...filterData];
    });
  }, [attributes]);

  useEffect(() => {
    if (!defaultData?.length) return;

    const newItems = defaultData.filter((d) => !listAttribute.some((p) => p.id === d.id));
    if (newItems.length > 0) {
      setListAttribute((prev) => [...newItems, ...prev]);
    }
  }, [defaultData, listAttribute]);

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = listAttribute.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  return (
    <TreeSelect
      multiple
      loading={loading}
      value={value || undefined}
      treeData={buildTree(listAttribute)}
      placeholder={placeholder}
      allowClear
      showSearch
      treeDefaultExpandAll
      className={`h-8 z-10 w-full`}
      prefix={prefix}
      suffixIcon={suffixIcon !== undefined ? suffixIcon : <IconArrowDown />}
      filterTreeNode={(input, node) =>
        removeVietnameseTones(String(node.title)).includes(removeVietnameseTones(input))
      }
      onChange={handleChange}
      onBlur={onBlur}
      onFocus={(e) => {
        setIsLockHook(false);
        onFocus?.(e);
      }}
    />
  );
};
