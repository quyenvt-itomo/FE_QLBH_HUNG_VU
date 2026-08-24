import React from "react";
import { SelectProps } from "@/shared/interfaces/common";
import { Purchase, PurchaseQuery } from "../purchase.model";
import { usePurchaseStore } from "../purchase.store";
import { DropdownColumn } from "@/shared";
import { SmartSelect } from "@/shared";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { resolveByPath } from "@/shared/utils/common.util";
import { ApproveStatusTag } from "@/shared";

const columns: DropdownColumn<Purchase>[] = [
  { label: "Số ĐH", dataIndex: "code", className: "w-32" },
  { label: "Ngày", dataIndex: "orderedAt", className: "w-24", dataType: "date" },
  {
    label: "NCC",
    className: "w-48",
    render: (record) => resolveByPath(record, ["supplier", "name"]),
  },
  {
    label: "Mã NCC",
    className: "w-20",
    render: (record) => resolveByPath(record, ["supplier", "code"]),
  },
  {
    label: "NV mua hàng",
    className: "w-36",
    render: (record) => resolveByPath(record, ["staff", "name"]),
  },
  {
    label: "Trạng thái",
    dataIndex: "approveStatus",
    className: "w-24",
    render: (record) => <ApproveStatusTag value={record.approveStatus} />,
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
