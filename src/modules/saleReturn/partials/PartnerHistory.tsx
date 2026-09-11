import React from "react";
import { usePageState } from "@/shared/hooks";
import { PartnerOrderHistoryTable } from "@/modules/order/components";
import { Order } from "@/modules/order/order.model";
import { useSaleReturnStore } from "../store";

export const SaleReturnPartnerHistory: React.FC<{ partnerId: string }> = ({ partnerId }) => {
  const { page, size, setPage, setSize } = usePageState<Order>({ size: 10 });
  const { data, loading, pagination } = useSaleReturnStore({
    customerIds: [partnerId],
    page,
    size,
  });

  return (
    <PartnerOrderHistoryTable
      dataSource={data}
      loading={loading}
      pagination={pagination}
      mode="customer"
      setPage={setPage}
      setSize={setSize}
    />
  );
};
