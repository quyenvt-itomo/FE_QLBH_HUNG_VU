import React from "react";
import { usePurchaseReturnStore } from "./order.store";
import { PurchaseListWorkspace } from "./PurchaseListWorkspace";

const PurchaseReturnPage: React.FC = () => {
  const store = usePurchaseReturnStore({ page: 1, size: 100 });
  return <PurchaseListWorkspace title="Trả hàng nhập" description="Danh sách phiếu trả hàng nhập" orders={store.data} loading={store.loading} />;
};

export default PurchaseReturnPage;
