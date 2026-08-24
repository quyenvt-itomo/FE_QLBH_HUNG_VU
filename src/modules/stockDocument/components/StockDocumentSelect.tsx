import React from "react";
import { SelectProps } from "@/shared/interfaces/common";
import { StockDocument, StockDocumentQuery, stockDocumentTypeMap } from "../stockDocument.model";
import { useStockDocumentStore } from "../stockDocument.store";
import { DropdownColumn } from "@/shared/components";
import { SmartSelect } from "@/shared/components";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";
import { stockDocumentStatusMap } from "../stockDocument.model";

const columns: DropdownColumn<StockDocument>[] = [
  { label: "Mã phiếu", dataIndex: "code", className: "w-36 font-mono" },
  {
    label: "Loại",
    dataIndex: "type",
    className: "w-24",
    render: (record) => stockDocumentTypeMap[record.type] || record.type,
  },
  {
    label: "Ngày",
    dataIndex: "effectiveDate",
    className: "w-24",
    dataType: "date",
  },
  {
    label: "Trạng thái",
    dataIndex: "status",
    className: "w-24",
    render: (record) => stockDocumentStatusMap[record.status] || record.status,
  },
];

export const StockDocumentSelect: React.FC<SelectProps<StockDocument, StockDocumentQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    StockDocument,
    StockDocumentQuery
  >({
    defaultData,
    queryHook: useStockDocumentStore,
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
    <SmartSelect<StockDocument>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder="Chọn phiếu kho"
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
