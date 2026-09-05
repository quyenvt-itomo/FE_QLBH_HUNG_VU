import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Order, OrderStatus, OrderType } from "@/modules/order/order.model";
import { Partner } from "@/modules/partner/partner.model";

export { OrderStatus, OrderType };

export interface SaleReturn extends Order {
  partner: Partner | null;
  creatorSnapshot?: any;
  completer?: any;
  completerSnapshot?: any;
}

export interface SaleReturnQuery extends ApiRequestQuery {
  type?: OrderType;
  statuses?: OrderStatus[];
  customerIds?: string[];
  creatorIds?: string[];
  completerIds?: string[];
  shipperIds?: string[];
  productIds?: string[];
  fundIds?: string[];
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

export const saleReturnStatusMap: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: "Phiếu tạm",
  [OrderStatus.COMPLETED]: "Đã hoàn thành",
  [OrderStatus.CANCELED]: "Đã hủy",
};

export const saleReturnStatusItems = Object.values(OrderStatus).map((value) => ({
  key: value,
  label: saleReturnStatusMap[value],
}));
