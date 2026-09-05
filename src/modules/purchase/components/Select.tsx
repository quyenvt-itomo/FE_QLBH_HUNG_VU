import React from "react";
import { SelectProps } from "@/shared/interfaces/common";
import { Purchase, PurchaseQuery } from "../purchase.model";
import { usePurchaseStore } from "../purchase.store";
import { DropdownColumn } from "@/shared/components";
import { SmartSelect } from "@/shared/components";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { purchaseStatusMap } from "../purchase.model";

const columns: DropdownColumn<Purchase>[] = [
  { label: "Số phiếu", dataIndex: "code", className: "w-32" },
  { label: "Ngày", dataIndex: "orderAt", className: "w-24", dataType: "date" },
  {
    label: "NCC",
    className: "w-48",
    render: (record) => record.partner?.name || record.partnerSnapshot?.name,
  },
  {
    label: "Mã NCC",
    className: "w-20",
    render: (record) => record.partner?.code || record.partnerSnapshot?.code,
  },
  {
    label: "Người hoàn thành",
    className: "w-36",
    render: (record) => record.completer?.name || record.completerSnapshot?.name,
  },
  {
    label: "Trạng thái",
    dataIndex: "status",
    className: "w-24",
    render: (record) => purchaseStatusMap[record.status],
    dataType: "enum",
  },
];

export const PurchaseSelect: React.FC<SelectProps<Purchase, PurchaseQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    Purchase,
    PurchaseQuery
  >({
    defaultData,
    queryHook: usePurchaseStore,
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
    <SmartSelect<Purchase>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn đơn mua hàng"
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
