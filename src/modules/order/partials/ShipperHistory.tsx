import React from "react";
import { usePageState } from "@/shared/hooks";
import { PartnerOrderHistoryTable } from "@/modules/order/components";
import { Order } from "../order.model";
import { useOrderHistoryStore } from "../order.store";

export const ShipperOrderHistory: React.FC<{ shipperId: string }> = ({ shipperId }) => {
  const { page, size, setPage, setSize } = usePageState<Order>({ size: 10 });
  const { data, loading, pagination } = useOrderHistoryStore({ shipperId, page, size });

  return (
    <PartnerOrderHistoryTable
      dataSource={data}
      loading={loading}
      pagination={pagination}
      mode="shipper"
      setPage={setPage}
      setSize={setSize}
    />
  );
};
