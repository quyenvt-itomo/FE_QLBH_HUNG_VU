import React from "react";
import { OrderType } from "./order.model";
import { useSaleReturnStore } from "./order.store";
import { SalePosWorkspace } from "./SalePosWorkspace";

const SaleReturnPage: React.FC = () => {
  const store = useSaleReturnStore({ page: 1, size: 100 });
  return <SalePosWorkspace title="Trả hàng" description="Danh sách đơn trả hàng trong cache POS" orderType={OrderType.SALE_RETURN} orders={store.data} loading={store.loading} />;
};

export default SaleReturnPage;
