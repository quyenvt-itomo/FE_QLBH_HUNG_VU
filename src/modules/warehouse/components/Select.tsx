import React from "react";
import { SelectProps } from "@/shared/interfaces/common";
import { Warehouse, WarehouseQuery } from "../warehouse.model";
import { useWarehouseStore } from "../warehouse.store";
import { DropdownColumn } from "@/shared";
import { SmartSelect } from "@/shared";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";

const columns: DropdownColumn<Warehouse>[] = [
  { label: "Tên kho", dataIndex: "name", className: "w-48" },
  { label: "Mã kho", dataIndex: "code", className: "w-36" },
  { label: "Thủ kho", dataIndex: ["manager", "name"], className: "w-36" },
];

export const WarehouseSelect: React.FC<SelectProps<Warehouse, WarehouseQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Warehouse,
    WarehouseQuery
  >({
    defaultData,
    queryHook: useWarehouseStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
  });

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = list.find((item) => item.id === id);
    onChangeData?.(data);
  };

  return (
    <SmartSelect<Warehouse>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn kho"
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(e) => {
        unlock();
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};
