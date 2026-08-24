import { Entity, EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { ApproveStatus } from "../shared/business.model";
import { EmployeeSnapshot } from "../employee";
import { PartnerSnapshot } from "../partner";
import { PartnerContactSnapshot } from "../partnerContact";
import { Invoice, InvoiceSnapshot } from "../invoice";
import { Order, OrderSnapshot } from "../order";
import { InvoiceAllocation } from "../incomeExpense";

export enum PaymentRequestTypeEnum {
  INVOICE = "invoice",
  COMMISSION = "commission",
}
export const paymentRequestTypeMap: Record<PaymentRequestTypeEnum, string> = {
  [PaymentRequestTypeEnum.INVOICE]: "Thanh toán hóa đơn",
  [PaymentRequestTypeEnum.COMMISSION]: "Thanh toán hoa hồng",
};

export interface PaymentRequestLineSnapshot {
  id: string;
  paymentRequestId: string;
  code: string;
  invoiceId: string | null;
  invoiceSnapshot: InvoiceSnapshot | null;
  orderId: string | null;
  orderSnapshot: OrderSnapshot | null;
}
export interface PaymentRequestLine extends Entity {
  paymentRequestId: string;
  paymentRequest: PaymentRequest;

  code: string;

  // Chỉ dùng cho đề nghị thanh toán công nợ nhà cung cấp
  // Thanh toán hoa hồng chỉ gắn với đơn hàng
  invoiceId: string | null;
  invoiceSnapshot: InvoiceSnapshot | null;
  invoice: Invoice | null;

  orderId: string | null;
  orderSnapshot: OrderSnapshot | null;
  order: Order | null;

  amount: number; // Số tiền sau thuế (subTotal + taxAmount)

  // Đã thanh toán
  isPaid: boolean;
  invoiceAllocations: InvoiceAllocation[];
}

export interface PaymentRequestQuery extends ApiRequestQuery {
  partnerId?: string;
  staffId?: string;
  type?: PaymentRequestTypeEnum;
  approveStatus?: ApproveStatus;
}
export interface PaymentRequest extends EntityWithStore {
  timeAt: string;
  code: string;
  type: PaymentRequestTypeEnum;
  staffId: string | null;
  staffSnapshot: EmployeeSnapshot | null;
  partnerId: string | null;
  partnerSnapshot: PartnerSnapshot | null;
  partnerContactId: string | null;
  partnerContactSnapshot: PartnerContactSnapshot | null;
  paymentMethod: string | null;
  totalAmount: number;
  approvedAt: string | null;
  approveStatus: ApproveStatus;
  approverId: string | null;
  approverSnapshot: EmployeeSnapshot | null;
  rejectReason: string | null;
  lines: PaymentRequestLine[];
}
