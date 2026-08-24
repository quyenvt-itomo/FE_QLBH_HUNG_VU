import { Entity, EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Partner, PartnerSnapshot } from "../partner";
import { Order, OrderSnapshot } from "../order";
import { Purchase, PurchaseSnapshot } from "../purchase";
import { StockDocument, StockDocumentSnapshot } from "../stockDocument";
import { ShippingPlan, ShippingPlanSnapshot } from "../shippingPlan";
import { PaymentRequestLine, PaymentRequestLineSnapshot } from "../paymentRequest";
import { IncomeExpense, InvoiceAllocation } from "../incomeExpense";
import { getOptionsByMap } from "@/shared/constants/enum";

export enum InvoiceType {
  INPUT = "input",
  OUTPUT = "output",
}
export const invoiceTypeMap: Record<InvoiceType, string> = {
  [InvoiceType.INPUT]: "Hóa đơn đầu vào",
  [InvoiceType.OUTPUT]: "Hóa đơn đầu ra",
};
export const invoiceTypeOptions = getOptionsByMap(invoiceTypeMap);

export enum InvoiceSourceType {
  ORDER = "order",
  SALES_SERVICE = "sales_service",
  SHIPPING_PLAN = "shipping_plan",
  DOCUMENT = "document",
  OTHER = "other",
}
export const invoiceSourceTypeMap: Record<InvoiceSourceType, string> = {
  [InvoiceSourceType.ORDER]: "Đơn hàng",
  [InvoiceSourceType.SALES_SERVICE]: "Dịch vụ",
  [InvoiceSourceType.SHIPPING_PLAN]: "Vận chuyển",
  [InvoiceSourceType.DOCUMENT]: "Phiếu kho",
  [InvoiceSourceType.OTHER]: "Khác",
};
export const invoiceSourceTypeOptions = getOptionsByMap(invoiceSourceTypeMap);
export const getInmvoiceOptionsByDirection = (type: InvoiceType) => {
  const types =
    type === InvoiceType.INPUT
      ? [
          InvoiceSourceType.ORDER,
          InvoiceSourceType.SHIPPING_PLAN,
          InvoiceSourceType.DOCUMENT,
          InvoiceSourceType.OTHER,
        ]
      : [
          InvoiceSourceType.ORDER,
          InvoiceSourceType.SALES_SERVICE,
          InvoiceSourceType.DOCUMENT,
          InvoiceSourceType.OTHER,
        ];

  return types.map((type) => ({
    value: type,
    label: invoiceSourceTypeMap[type],
    key: type,
  }));
};

export enum InvoiceStatus {
  EFFECTIVE = "effective", // Có hiệu lực
  PARTIALLY_PAID = "partially_paid", // Đã thanh toán một phần
  PAID = "paid", // Đã thanh toán hết
  CANCELED = "canceled", // Đã hủy
}
export const invoiceStatusMap: Record<InvoiceStatus, string> = {
  [InvoiceStatus.EFFECTIVE]: "Chưa TT",
  [InvoiceStatus.PARTIALLY_PAID]: "Đã TT một phần",
  [InvoiceStatus.PAID]: "Đã TT hết",
  [InvoiceStatus.CANCELED]: "Đã hủy",
};
export const invoiceStatusOptions = getOptionsByMap(invoiceStatusMap);

export interface InvoiceLine {
  sourceLineId?: string | null; // orderLineId, purchaseLineId, stockDocumentLineId

  productId?: string | null; // productId hoặc serviceId sẽ có một trong hai, không có cả hai
  productName?: string | null;
  productCode?: string | null;
  unit?: string | null;

  quantity: number;
  unitPrice: number;
  subTotal: number;
  taxRate?: number;
  taxAmount: number;
  totalAmount: number;

  note?: string | null;
}

export interface InvoiceSnapshot {
  id: string;
  invoiceDate: Date;
  invoiceNumber: string;
  type: InvoiceType;
  sourceType: InvoiceSourceType;

  // Số chứng từ, ngày chứng từ nếu là hóa đơn khác
  referenceNumber: string | null;
  referenceDate: Date | null;

  partnerId: string | null;
  partnerSnapshot: PartnerSnapshot | null;
  orderId: string | null;
  orderSnapshot: OrderSnapshot | null;
  purchaseId: string | null;
  purchaseSnapshot: PurchaseSnapshot | null;
  stockDocumentId: string | null;
  stockDocumentSnapshot: StockDocumentSnapshot | null;
  shippingPlanId: string | null;
  shippingPlanSnapshot: ShippingPlanSnapshot | null;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
}

export interface InvoiceQuery extends ApiRequestQuery {
  partnerId?: string;
  direction?: InvoiceType;
}
export interface Invoice extends EntityWithStore {
  invoiceDate: Date;
  invoiceNumber: string;

  status: InvoiceStatus;

  type: InvoiceType;
  sourceType: InvoiceSourceType;

  // Số chứng từ, ngày chứng từ nếu là hóa đơn khác
  referenceNumber: string | null;
  referenceDate: Date | null;

  // Đối tác thu chi (Tính công nợ)
  partnerId: string | null;
  partnerSnapshot: PartnerSnapshot | null;

  // Đơn hàng liên quan
  orderId: string | null;
  orderSnapshot: OrderSnapshot | null;

  // Đơn mua liên quan
  purchaseId: string | null;
  purchaseSnapshot: PurchaseSnapshot | null;

  // Phiếu kho liên quan
  stockDocumentId: string | null;
  stockDocumentSnapshot: StockDocumentSnapshot | null;

  // Phương án vận chuyển liên quan
  shippingPlanId: string | null;
  shippingPlanSnapshot: ShippingPlanSnapshot | null;

  subTotal: number; // Tổng tiền trước thuế
  taxAmount: number; // Tổng tiền thuế
  totalAmount: number; // Tổng tiền sau thuế

  // Đã thanh toán
  totalPaidAmount: number;

  // Còn nợ
  totalRemainingAmount: number; // = totalAmount - totalPaidAmount

  lines: InvoiceLine[];

  /* ================= relations ================= */
  partner: Partner | null;

  order: Order | null;

  purchase: Purchase | null;

  stockDocument: StockDocument | null;

  shippingPlan: ShippingPlan | null;

  allocations: InvoiceAllocation[];
}
