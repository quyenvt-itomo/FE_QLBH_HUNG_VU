import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { PartnerSnapshot } from "../partner/partner.model";
import { ProductSnapshot } from "../product/product.model";
import { AttributeSnapshot } from "../attribute/attribute.model";
import { DiscountTypeEnum } from "@/shared/constants/enum";

export enum OrderType { PURCHASE = "purchase", SALE = "sale", PURCHASE_RETURN = "purchase_return", SALE_RETURN = "sale_return" }
export enum OrderStatus { DRAFT = "draft", COMPLETED = "completed", CANCELED = "canceled" }

export interface OrderQuery extends ApiRequestQuery { partnerId?: string; customerId?: string; storeId?: string; isCompleted?: boolean; approveStatus?: string; }
export interface OrderSnapshot { id: string; type: OrderType; code: string; orderAt: string; partnerId: string | null; partnerSnapshot: PartnerSnapshot | null; }

/** OrderLine is an embedded child of Order; it has no standalone module/API. */
export interface OrderLine extends Entity {
  orderId: string | null;
  returnOrderId: string | null;
  refOrderLineId: string | null;
  productId: string | null;
  productSnapshot: ProductSnapshot;
  unitId: string | null;
  unitSnapshot: AttributeSnapshot | null;
  conversionRateAtTime: number;
  unitPrice: number;
  quantity: number;
  subTotal: number;
  totalCost: number;
  costPriceAtTime: number;
  product?: any;
  unit?: any;
  taxRate?: number;
  taxAmount?: number;
  grossAmount?: number;
  commissionAmount?: number;
  deliveredQuantity?: number;
  serviceId?: string | null;
  type?: string;
}

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
  shippingFee: number | null;
  /** Purchase: doanh nghiệp tự thanh toán; sale: miễn phí cho khách. */
  isFreeShipping: boolean;
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
  returnDiscountType: DiscountTypeEnum;
  returnDiscountValue: number | null;
  returnDiscountAmount: number | null;
  returnNetAmount: number;
  returnTaxType: DiscountTypeEnum;
  returnTaxValue: number | null;
  returnTaxAmount: number;
  returnTotalAmount: number;
  returnTotalCost: number;
  settlementAmount: number;
  lines: OrderLine[];
  returnLines: OrderLine[];
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
