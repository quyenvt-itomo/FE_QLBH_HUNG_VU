import { useEffect, useState } from "react";
import { MultipleSelectProps } from "../../models/base/select";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { SmartMultipleSelect } from "../core/SmartMultipleSelect";
import { IAttribute } from "../../models/base/attribute";
import { useAttributeData } from "../../hooks/core/useAttributeData";
import { AttributeTypeEnum } from "../../constants/enum";
import { filterAttributesByType } from "../../utils/common";

interface Props extends MultipleSelectProps<IAttribute> {
  type: AttributeTypeEnum;
}

export const AttributeSelect: React.FC<Props> = ({
  value,
  defaultData,
  type,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [listAttribute, setListAttribute] = useState<IAttribute[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);

  const { attributes, loading } = useAttributeData({
    isLockHook,
    type,
  });

  useEffect(() => {
    if (attributes.length === 0 || attributes[0].type !== type) return;
    const filterData = filterAttributesByType(attributes, type);

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

  const columns: DropdownColumn<IAttribute>[] = [
    { label: "Tên ĐVT", dataIndex: "name", className: "w-48" },
  ];

  return (
    <SmartMultipleSelect<IAttribute>
      dataSource={listAttribute}
      columns={columns}
      value={value}
      onChange={handleChange}
      placeholder="Chọn đơn vị tính"
      loading={loading}
      onFocus={(e) => {
        setIsLockHook(false);
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};
