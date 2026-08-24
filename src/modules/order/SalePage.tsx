import React from "react";
import { OrderType } from "./order.model";
import { useSaleStore } from "./order.store";
import { SalePosWorkspace } from "./SalePosWorkspace";

const SalePage: React.FC = () => {
  const store = useSaleStore({ page: 1, size: 100 });
  return <SalePosWorkspace title="Bán hàng" description="Danh sách đơn bán hàng trong cache POS" orderType={OrderType.SALE} orders={store.data} loading={store.loading} />;
};

export default SalePage;
