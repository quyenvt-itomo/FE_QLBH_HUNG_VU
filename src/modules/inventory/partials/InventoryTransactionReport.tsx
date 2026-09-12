import React, { useState } from "react";
import { usePageState } from "@/shared/hooks";
import { InventoryReport, InventoryTransactionRefType } from "../inventory.model";
import { useInventoryReportStore } from "../inventory.store";
import { InventoryTransactionTable } from "./InventoryTransactionTable";
import { InventoryTransactionToolbar } from "./InventoryTransactionToolbar";
import { Product } from "@/modules/product/product.model";

interface Props {
  product: Product;
}

export const InventoryTransactionReport: React.FC<Props> = ({ product }) => {
  const {
    page,
    size,
    startAt,
    endAt,
    filter,
    reload,
    ranger,
    setPage,
    setSize,
    pageAction,
  } = usePageState<InventoryReport>();
  const [refType, setRefType] = useState<InventoryTransactionRefType | undefined>();

  const { loading, transactions, transactionSummary, transactionPagination } =
    useInventoryReportStore({
      page,
      size,
      reload,
      startAt,
      endAt,
      isLockedReport: true,
      isLockedTransaction: false,
      productId: product.id,
      refType,
      ...filter,
      ...ranger,
    });

  return (
    <div className="flex flex-col h-full gap-3">
      <InventoryTransactionToolbar
        refType={refType}
        setRefType={setRefType}
        startAt={startAt}
        endAt={endAt}
        onDateRangerChange={pageAction.handleDateRangerChange}
      />

      <div className="flex flex-col h-[calc(100%-76px)] rounded-lg border overflow-hidden">
        <InventoryTransactionTable
          loading={loading}
          dataSource={transactions}
          summaryData={transactionSummary}
          pagination={transactionPagination}
          setPage={setPage}
          setSize={setSize}
        />
      </div>
    </div>
  );
};
