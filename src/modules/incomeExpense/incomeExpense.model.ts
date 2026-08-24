import { Entity, StoreEntity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Partner, PartnerSnapshot } from "../partner";
import { Order, OrderSnapshot } from "../order";
import { Attribute, AttributeSnapshot } from "../attribute";
import { Fund, FundSnapshot } from "../fund";

export interface EmployeeSnapshot {
  id: string;
  code: string;
  name: string;
  phone?: string | null;
  email?: string | null;
}
export interface Employee {
  id: string;
  name: string;
}
export interface PurchaseSnapshot {
  id: string;
  code: string;
  orderedAt: string | Date;
  supplierId: string | null;
  supplierSnapshot: PartnerSnapshot | null;
  totalAmount: number;
}
export interface Purchase extends StoreEntity {
  code: string;
  totalAmount: number;
}
export interface InvoiceSnapshot {
  id: string;
  invoiceNumber: string;
  invoiceDate: string | Date;
  totalAmount: number;
}
export interface Invoice extends StoreEntity {
  invoiceNumber: string;
  invoiceDate: string | Date;
  totalAmount: number;
}
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
  code: string;
  amount: number;
  invoiceId: string | null;
  invoiceSnapshot: InvoiceSnapshot | null;
  orderId: string | null;
  orderSnapshot: OrderSnapshot | null;
}

export enum IncomeExpenseTypeEnum {
  INCOME = "income",
  EXPENSE = "expense",
}

export const incomeExpenseTypeMap: Record<IncomeExpenseTypeEnum, string> = {
  [IncomeExpenseTypeEnum.INCOME]: "Phiếu thu",
  [IncomeExpenseTypeEnum.EXPENSE]: "Phiếu chi",
};

export interface IncomeExpenseQuery extends ApiRequestQuery {
  moreQuery?: any;
  type?: IncomeExpenseTypeEnum;
  fundId?: string;
  categoryId?: string;
  isDebtPayment?: boolean;
}

export interface InvoiceAllocation extends Entity {
  incomeExpenseId: string;
  incomeExpense: IncomeExpense;

  allocatedAt: Date;

  invoiceId: string | null;
  invoiceSnapshot: InvoiceSnapshot | null; // snapshot thông tin hóa đơn, để tránh trường hợp thông tin hóa đơn bị thay đổi sau khi phân bổ
  invoice: Invoice | null;

  // Có thể là được gắn với một đề nghi thanh toán nhỏ
  // snapshot thông tin dòng đề nghị thanh toán, để tránh trường hợp thông tin dòng đề nghị thanh toán bị thay đổi sau khi phân bổ
  paymentRequestLineId: string | null;
  paymentRequestLineSnapshot: PaymentRequestLineSnapshot | null;
  paymentRequestLine: PaymentRequestLine | null;

  amount: number;
}

export interface CommissionAllocation extends Entity {
  incomeExpenseId: string;
  incomeExpense: IncomeExpense;

  orderId: string;
  orderSnapshot: OrderSnapshot | null; // snapshot thông tin đơn hàng, để tránh trường hợp thông tin đơn hàng bị thay đổi sau khi phân bổ
  order: Order;

  // Có thể là được gắn với một đề nghi thanh toán nhỏ
  paymentRequestLineId: string | null;
  paymentRequestLineSnapshot: PaymentRequestLineSnapshot | null; // snapshot thông tin dòng đề nghị thanh toán, để tránh trường hợp thông tin dòng đề nghị thanh toán bị thay đổi sau khi phân bổ
  paymentRequestLine: PaymentRequestLine | null;

  amount: number;

  allocatedAt: Date;
}

export interface IncomeExpense extends StoreEntity {
  occurredAt: Date;

  //? số phiếu
  code: string;

  type: IncomeExpenseTypeEnum;

  //? quỹ
  fundId: string | null;
  fundSnapshot: FundSnapshot | null; // snapshot thông tin quỹ khi tạo phiếu thu/chi, để tránh trường hợp thông tin quỹ bị thay đổi sau khi tạo phiếu ảnh hưởng đến báo cáo doanh thu theo quỹ
  fund: Fund | null;

  // Người phụ trách phiếu này
  staffId: string | null;
  staffSnapshot: EmployeeSnapshot | null;
  staff: Employee | null;

  //? số tiền thu/chi
  amount: number;

  categoryId: string;
  categorySnapshot: AttributeSnapshot | null;
  category: Attribute | null;

  // Đối tác thu chi (Tính công nợ)
  partnerId: string | null;
  partnerSnapshot: PartnerSnapshot | null;
  partner: Partner | null;

  // Đơn hàng liên quan
  orderId: string | null;
  orderSnapshot: OrderSnapshot | null;
  order: Order | null;

  purchaseId: string | null;
  purchaseSnapshot: PurchaseSnapshot | null;
  purchase: Purchase | null;

  // Thu lãi khoản gửi
  // depositInterestId: string | null;
  // depositInterestSnapshot: DepositInterestSnapshot | null;

  // Rút tiền khoản gửi
  // depositId: string | null;
  // depositSnapshot: DepositSnapshot | null;

  // Thanh toán lãi khoản vay
  // loanInterestId: string | null;
  // loanInterestSnapshot: LoanInterestSnapshot | null;

  // Thanh toán gốc khoản vay
  // loanId: string | null;
  // loanSnapshot: LoanSnapshot | null;

  shareholderId: string | null;
  shareholderSnapshot: EmployeeSnapshot | null;
  shareholder: Employee | null;

  //? nội dung thu/chi
  description: string | null;

  invoiceAllocations: InvoiceAllocation[];

  commissionAllocations: CommissionAllocation[];
}
