import React from "react";
import { OrderStatus, saleStatusMap } from "../model";

export const SaleStatusTag: React.FC<{ value?: OrderStatus; isReturn?: boolean }> = ({
  value,
  isReturn = false,
}) => {
  if (!value) return null;

  const color =
    value === OrderStatus.COMPLETED
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : value === OrderStatus.CANCELED
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

  const label = isReturn && value === OrderStatus.DRAFT ? "Phiếu tạm" : saleStatusMap[value];

  return <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${color}`}>{label}</span>;
};
