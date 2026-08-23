import { EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Partner } from "../partner";
import { Invoice, InvoiceType } from "../invoice";
import { InvoiceAllocation } from "../incomeExpense";
import { DebtSideEnum, getOptionsByMap, TransactionType } from "@/shared/constants/enum";

export enum PartnerDebtRefTypeEnum {
  INVOICE = "invoice", // Phát sinh từ hóa đơn
  PAYMENT = "payment", // Phát sinh từ phiếu thu/chi
  ADJUSTMENT = "adjustment", // điều chỉnh đầu/cuối kỳ
  DEBT_OFFSET = "debt_offset", // đối trừ payable <-> receivable
}
export const partnerDebtRefTypeMap: Record<PartnerDebtRefTypeEnum, string> = {
  [PartnerDebtRefTypeEnum.INVOICE]: "Hóa đơn",
  [PartnerDebtRefTypeEnum.PAYMENT]: "Phiếu thu/chi",
  [PartnerDebtRefTypeEnum.ADJUSTMENT]: "Điều chỉnh",
  [PartnerDebtRefTypeEnum.DEBT_OFFSET]: "Đối trừ công nợ",
};
export const partnerDebtRefTypeOptions = getOptionsByMap(partnerDebtRefTypeMap);

export interface PartnerDebtQuery extends ApiRequestQuery {
  moreQuery?: any;
  partnerId?: string;
  side: DebtSideEnum;
  refType?: PartnerDebtRefTypeEnum;
}

export interface PartnerDebtReport extends Partner {
  closingAmount: number;
  outAmount: number;
  inAmount: number;
  openingAmount: number;
}

export interface PartnerDebtTransaction extends EntityWithCompany {
  side: DebtSideEnum;

  occurredAt: Date;

  partnerId: string;

  type: TransactionType;

  amount: number;

  /**
   * Hóa đơn mà giao dịch này tác động (nullable khi điều chỉnh tổng / chưa phân bổ).
   * Tăng nợ từ hóa đơn luôn gắn invoiceId = chính hóa đơn đó;
   * giảm nợ từ phiếu thu/chi, đối trừ, điều chỉnh cũng gắn invoiceId để tính nợ theo từng hóa đơn.
   */
  invoiceId: string | null;
  refType: PartnerDebtRefTypeEnum;
  refId: string;
  refCode: string | null;

  closingAmount: number;
}

// ================================================================
//  Nợ hiện tại theo hóa đơn (Current Debt Report)
//  - GET /partners → danh sách đối tác còn nợ
//  - GET /invoices → danh sách hóa đơn còn nợ của 1 đối tác
// ================================================================

export interface CurrentDebtQuery extends ApiRequestQuery {
  invoiceType: InvoiceType;
  partnerId?: string;
  partnerIds?: string[];
}

/**
 * Đối tác còn nợ (kết quả của /partners).
 * Bắt buộc truyền invoiceType; không lọc theo thời gian.
 * Đảm bảo: totalDebt = totalNotDue + totalOverdue
 *                  = under30Days + under60Days + under90Days + over90Days.
 */
export interface PartnerCurrentDebt extends Partner {
  totalDebt: number;
  totalNotDue: number;
  totalOverdue: number;
  under30Days: number;
  under60Days: number;
  under90Days: number;
  over90Days: number;
  invoiceCount: number;
}

/**
 * Hóa đơn còn nợ của 1 đối tác (kết quả của /invoices).
 * Kèm allocations (các phiếu thu/chi đã phân bổ) và reductions
 * (các bút toán giảm trừ: đối trừ debt_offset, điều chỉnh adjustment).
 */
export interface PartnerDebtInvoice extends Invoice {
  totalRemainingAmount: number;
  allocations: InvoiceAllocation[];
  reductions: PartnerDebtTransaction[];
}
