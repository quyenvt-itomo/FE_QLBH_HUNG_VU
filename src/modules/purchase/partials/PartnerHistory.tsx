import React from "react";
import { usePageState } from "@/shared/hooks";
import { PartnerOrderHistoryTable } from "@/modules/order/components";
import { Order } from "@/modules/order/order.model";
import { usePurchaseStore } from "../purchase.store";
import { usePurchaseReturnStore } from "@/modules/order/order.store";

export const PurchasePartnerHistory: React.FC<{ partnerId: string }> = ({ partnerId }) => {
  const { page, size, setPage, setSize } = usePageState<Order>({ size: 10 });
  const { data, loading, pagination } = usePurchaseStore({
    supplierIds: [partnerId],
    page,
    size,
  });

  return (
    <PartnerOrderHistoryTable
      dataSource={data}
      loading={loading}
      pagination={pagination}
      mode="supplier"
      setPage={setPage}
      setSize={setSize}
    />
  );
};

export const PurchaseReturnPartnerHistory: React.FC<{ partnerId: string }> = ({ partnerId }) => {
  const { page, size, setPage, setSize } = usePageState<Order>({ size: 10 });
  const { data, loading, pagination } = usePurchaseReturnStore({
    supplierIds: [partnerId],
    page,
    size,
  });

  return (
    <PartnerOrderHistoryTable
      dataSource={data}
      loading={loading}
      pagination={pagination}
      mode="supplier"
      setPage={setPage}
      setSize={setSize}
    />
  );
};
