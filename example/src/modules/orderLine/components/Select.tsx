import React from "react";
import { SelectProps } from "@/shared/interfaces/common";
import { OrderLine, OrderLineQuery } from "../orderLine.model";
import { useOrderLineStore } from "../orderLine.store";
import { DropdownColumn } from "@/shared/components/core/CustomSelectLayout";
import { SmartSelect } from "@/shared/components/core/SmartSelect";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";

export const OrderLineSelect: React.FC<SelectProps<OrderLine, OrderLineQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    OrderLine,
    OrderLineQuery
  >({
    defaultData,
    queryHook: useOrderLineStore,
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

  const columns: DropdownColumn<OrderLine>[] = [
    { label: "Hàng hóa", dataIndex: ["product", "name"], className: "w-48" },
    { label: "Mã", dataIndex: ["product", "code"], className: "w-24" },
    { label: "SL", dataIndex: "quantity", className: "w-20 text-right", dataType: "number" },
    { label: "Đơn giá", dataIndex: "unitPrice", className: "w-28 text-right", dataType: "number" },
  ];

  return (
    <SmartSelect<OrderLine>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn dòng bán hàng"
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
