import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Order, OrderLine, OrderStatus, OrderType } from "@/modules/order/order.model";
import { Partner } from "@/modules/partner/partner.model";

export { OrderStatus, OrderType };
export type PurchaseLine = OrderLine;

export interface Purchase extends Order {
  invoiceNumber: string | null;
  partner: Partner | null;
  creatorSnapshot?: any;
  completer?: any;
  completerSnapshot?: any;
}

export interface PurchaseQuery extends ApiRequestQuery {
  type?: OrderType;
  statuses?: OrderStatus[];
  supplierIds?: string[];
  creatorIds?: string[];
  completerIds?: string[];
  orderAtGte?: string;
  orderAtLte?: string;
  occurredAtGte?: string;
  occurredAtLte?: string;
  grossAmountGte?: number;
  grossAmountLte?: number;
  discountAmountGte?: number;
  discountAmountLte?: number;
  totalAmountGte?: number;
  totalAmountLte?: number;
}

export const purchaseStatusMap: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: "Phiếu tạm",
  [OrderStatus.COMPLETED]: "Đã nhập kho",
  [OrderStatus.CANCELED]: "Đã hủy",
};

export const purchaseStatusItems = Object.values(OrderStatus).map((value) => ({
  key: value,
  label: purchaseStatusMap[value],
}));
