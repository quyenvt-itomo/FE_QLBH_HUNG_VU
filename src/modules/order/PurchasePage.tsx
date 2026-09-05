import React from "react";
import { usePurchaseStore } from "./order.store";
import { PurchaseListWorkspace } from "./PurchaseListWorkspace";

const PurchasePage: React.FC = () => {
  const store = usePurchaseStore({ page: 1, size: 100 });
  return (
    <PurchaseListWorkspace
      title="Nhập hàng"
      description="Danh sách phiếu nhập hàng"
      orders={store.data}
      loading={store.loading}
    />
  );
};

export default PurchasePage;
