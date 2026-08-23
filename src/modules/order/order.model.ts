import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { PartnerSnapshot } from "../partner/partner.model";
import { OrderLine } from "../orderLine/orderLine.model";
import { DiscountTypeEnum } from "@/shared/constants/enum";

export enum OrderType { PURCHASE = "purchase", SALE = "sale", PURCHASE_RETURN = "purchase_return", SALE_RETURN = "sale_return" }
export enum OrderStatus { DRAFT = "draft", COMPLETED = "completed", CANCELED = "canceled" }

export interface OrderQuery extends ApiRequestQuery { partnerId?: string; customerId?: string; storeId?: string; isCompleted?: boolean; approveStatus?: string; }
export interface OrderSnapshot { id: string; type: OrderType; code: string; orderAt: string; partnerId: string | null; partnerSnapshot: PartnerSnapshot | null; }

export interface OrderCommission extends Entity { orderId: string; totalAmount: number; }
export interface OrderCommissionDetail extends Entity { orderCommissionId: string; orderLineId: string; totalAmount: number; }

export interface Order extends Entity {
  storeId: string;
  type: OrderType;
  status: OrderStatus;
  code: string;
  orderAt: string;
  occurredAt: string | null;
  canceledAt: string | null;
  partnerId: string | null;
  partnerSnapshot: PartnerSnapshot | null;
  shipperId: string | null;
  shipperSnapshot: PartnerSnapshot | null;
  discountType: DiscountTypeEnum;
  discountValue: number | null;
  grossAmount: number;
  discountAmount: number | null;
  netAmount: number;
  taxType: DiscountTypeEnum;
  taxValue: number | null;
  taxAmount: number;
  totalAmount: number;
  totalCost: number;
  refOrderId: string | null;
  returnGrossAmount: number;
  returnDiscountAmount: number | null;
  returnNetAmount: number;
  returnTaxAmount: number;
  returnTotalAmount: number;
  returnTotalCost: number;
  settlementAmount: number;
  lines: OrderLine[];
  /** Deprecated aliases used by old print views. */
  timeAt?: string;
  customerId?: string | null;
  customer?: any;
  staffId?: string | null;
  staff?: any;
  isCompleted?: boolean;
  completedAt?: string | null;
  commissionMode?: any;
  taxRate?: number;
}
