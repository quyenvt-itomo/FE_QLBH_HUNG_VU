import React, { useState } from "react";
import { StockDocumentType, stockDocumentTypeOptions } from "./stockDocument.model";
import { Tabs } from "antd";
import { useHashTabs } from "@/shared/hooks/useHashTabs";

import { PurchaseReceiptPage } from "./purchaseReceipt";
import { ProductionReceiptPage } from "./productionReceipt";
import { MaterialIssuePage } from "./materialIssue";
import { OrderIssuePage } from "./orderIssue";

const StockDocumentPage: React.FC = () => {
  const { activeTab, onTabChange } = useHashTabs({
    items: stockDocumentTypeOptions,
  });

  const renderPartial = () => {
    switch (activeTab) {
      case StockDocumentType.PURCHASE_RECEIPT:
        return <PurchaseReceiptPage />;
      case StockDocumentType.PRODUCTION_RECEIPT:
        return <ProductionReceiptPage />;
      case StockDocumentType.MATERIAL_ISSUE:
        return <MaterialIssuePage />;
      case StockDocumentType.ORDER_ISSUE:
        return <OrderIssuePage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => onTabChange(key as StockDocumentType)}
        items={stockDocumentTypeOptions}
        className="custom-tabs"
      />
      <div className="flex flex-col h-[calc(100%-40px)] rounded bg-white border">
        {renderPartial()}
      </div>
    </div>
  );
};
export default StockDocumentPage;
