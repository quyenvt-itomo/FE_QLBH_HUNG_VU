import React from "react";
import { InventoryTransactionReport } from "@/modules/inventory";
import { Product } from "../../product.model";

export const InventoryTransactionTab: React.FC<{ data: Product }> = ({ data }) => {
  return <InventoryTransactionReport product={data} />;
};
