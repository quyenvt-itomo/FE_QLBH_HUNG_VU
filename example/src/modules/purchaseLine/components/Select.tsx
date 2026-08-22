import React from "react";
import { MultipleSelectProps, SelectProps } from "@/shared/interfaces/common";
import { PurchaseLine, PurchaseLineQuery } from "../purchaseLine.model";
import { usePurchaseLineStore } from "../purchaseLine.store";
import { DropdownColumn } from "@/shared/components/core/CustomSelectLayout";
import { SmartSelect } from "@/shared/components/core/SmartSelect";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { SmartMultipleSelect } from "@/shared/components/core/SmartMultipleSelect";
import { SortOrderEnum } from "@/shared/constants/enum";

const columns: DropdownColumn<PurchaseLine>[] = [
  { label: "Hàng hóa", dataIndex: ["product", "name"], className: "w-48" },
  { label: "Mã hàng", dataIndex: ["product", "code"], className: "w-24" },
  { label: "Đơn giá", dataIndex: "unitPrice", className: "w-28 text-right", dataType: "number" },
  { label: "SL đặt", dataIndex: "quantity", className: "w-20 text-right", dataType: "number" },
  {
    label: "SL đã nhận",
    dataIndex: "deliveredQuantity",
    className: "w-20 text-right",
    dataType: "number",
  },
];

export const PurchaseLineSelect: React.FC<SelectProps<PurchaseLine, PurchaseLineQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    PurchaseLine,
    PurchaseLineQuery
  >({
    defaultData,
    queryHook: usePurchaseLineStore,
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
    <SmartSelect<PurchaseLine>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn hàng hóa từ đơn mua hàng"
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

export const PurchaseLineMultipleSelect: React.FC<
  MultipleSelectProps<PurchaseLine, PurchaseLineQuery>
> = ({ value, defaultData, query, onChange, onChangeData, onFocus, hideOptions, ...rest }) => {
  const { finalList, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    PurchaseLine,
    PurchaseLineQuery
  >({
    defaultData,
    hideOptions,
    queryHook: usePurchaseLineStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      keyword,
      page,
      size: 10,
      isLocked,
      sortBy: "sortOrder",
      sortOrder: SortOrderEnum.ASC,
      ...(query || {}),
    }),
    resetPageDeps: [query],
  });

  const handleChange = (ids: string[]) => {
    onChange?.(ids);
    const selectedData = finalList.filter((item) => ids.includes(item.id));
    onChangeData?.(selectedData);
  };

  return (
    <SmartMultipleSelect<PurchaseLine>
      dataSource={finalList}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn hàng hóa từ đơn mua hàng"
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
