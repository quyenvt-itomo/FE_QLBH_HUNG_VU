import { StoreEntity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Partner } from "../partner";
import { DebtSide, getOptionsByMap, TransactionType } from "@/shared/constants/enum";

export enum PartnerDebtRefType {
  INVOICE = "invoice", // Phát sinh từ hóa đơn
  PAYMENT = "payment", // Phát sinh từ phiếu thu/chi
  ADJUSTMENT = "adjustment", // điều chỉnh đầu/cuối kỳ
  DEBT_OFFSET = "debt_offset", // đối trừ payable <-> receivable
}
export const partnerDebtRefTypeMap: Record<PartnerDebtRefType, string> = {
  [PartnerDebtRefType.INVOICE]: "Hóa đơn",
  [PartnerDebtRefType.PAYMENT]: "Phiếu thu/chi",
  [PartnerDebtRefType.ADJUSTMENT]: "Điều chỉnh",
  [PartnerDebtRefType.DEBT_OFFSET]: "Đối trừ công nợ",
};
export const partnerDebtRefTypeOptions = getOptionsByMap(partnerDebtRefTypeMap);

export interface PartnerDebtQuery extends ApiRequestQuery {
  moreQuery?: any;
  partnerId?: string;
  side: DebtSide;
  refType?: PartnerDebtRefType;
}

export interface PartnerDebtReport extends Partner {
  closingAmount: number;
  outAmount: number;
  inAmount: number;
  openingAmount: number;
}

export interface DebtTransaction extends StoreEntity {
  side: DebtSide;

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
  refType: PartnerDebtRefType;
  refId: string;
  refCode: string | null;

  closingAmount: number;
}
