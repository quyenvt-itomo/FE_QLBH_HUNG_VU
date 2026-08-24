import { Entity, EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { CommissionMode, SaleLineType } from "@/shared/constants/enum";
import { AdditionalInfo } from "@/shared/interfaces/common";
import { ApproveStatus } from "../shared/business.model";
import { QuotationRequest } from "../quotationRequest";
import { Partner, PartnerSnapshot } from "../partner";
import { Employee, EmployeeSnapshot } from "../employee";
import { PartnerContact, PartnerContactSnapshot } from "../partnerContact";
import { QuotationLine } from "../quotationLine";

// ───────────────────────────────────────────────────
// QuotationCommission
// ───────────────────────────────────────────────────
export interface QuotationCommission extends Entity {
  quotationId: string;

  // Người hưởng (là người liên hệ bên phía đối tác)
  partnerContactId: string | null;
  partnerContactSnapshot: PartnerContactSnapshot | null;

  totalAmount: number;

  // ============================== RELATIONSHIPS ==============================
  quotation: Quotation;

  partnerContact: PartnerContact | null;

  details: QuotationCommissionDetail[];
}

// ───────────────────────────────────────────────────
// QuotationCommissionDetail
// ───────────────────────────────────────────────────
export interface QuotationCommissionDetail extends Entity {
  quotationCommissionId: string;

  quotationLineId: string;

  // Gửi giá
  price: number;
  priceAmount: number; // = price * quotationLine.quantity
  priceTaxRate: number;
  priceTaxRateAmount: number; // = (quotationLine.taxRate - priceTaxRate) * priceAmount

  // Gửi lượng
  quantity: number;
  quantityAmount: number; // = quantity * quotationLine.rawUnitPrice
  quantityTaxRate: number;
  quantityTaxRateAmount: number; // = (quotationLine.taxRate - quantityTaxRate) * quantityAmount

  // Tổng hoa hồng cho người liên hệ này trên dòng này = priceAmount + priceTaxRateAmount + quantityAmount + quantityTaxRateAmount
  totalAmount: number; // = priceAmount + priceTaxRateAmount + quantityAmount + quantityTaxRateAmount

  // ============================== RELATIONSHIPS ==============================
  quotationCommission: QuotationCommission | null;

  quotationLine: QuotationLine;
}

// ───────────────────────────────────────────────────
// Query
// ───────────────────────────────────────────────────
export interface QuotationQuery extends ApiRequestQuery {
  moreQuery?: any;
  customerId?: string;
  staffId?: string;
  approveStatus?: ApproveStatus;
  quotationRequestId?: string;
}

// ───────────────────────────────────────────────────
// Quotation (Main Entity)
// ───────────────────────────────────────────────────
export interface Quotation extends EntityWithStore {
  timeAt: string;
  code: string;

  commissionMode: CommissionMode | null; // Cách tính hoa hồng: theo giá hay theo lượng

  // Có hiệu lực đến - tự động chuyển trạng thái khi hết hạn
  validUntil: string | null;

  // Gắn với yêu cầu báo giá
  quotationRequestId: string | null;
  quotationRequest: QuotationRequest | null;

  // Khách hàng
  customerId: string | null;
  customerSnapshot: PartnerSnapshot | null;
  customer: Partner | null;

  // Người phụ trách
  staffId: string | null;
  staffSnapshot: EmployeeSnapshot | null;
  staff: Employee | null;

  // Bảng thông số LTH
  meshSpecId: string | null;
  meshSpecSnapshot: MeshSpecSnapshot | null;
  meshSpec: MeshSpec | null;

  additionalInfo: AdditionalInfo[];

  // ── Duyệt nội bộ ──
  approvedAt: string | null;
  approveStatus: ApproveStatus;
  approverId: string | null;
  approverSnapshot: EmployeeSnapshot | null;
  approver: Employee | null;
  rejectReason: string | null;

  // ── Khách hàng duyệt ──
  customerApproveStatus: ApproveStatus;
  customerApprovedAt: string | null;
  customerApproverId: string | null;
  customerApproverSnapshot: EmployeeSnapshot | null;
  customerApprover: Employee | null;
  customerRejectReason: string | null;

  // ============================ RELATIONS ========================= //
  lines: QuotationLine[];
  commissions: QuotationCommission[];

  // ── FE-computed summary fields (tính từ lines) ──
  /** Tổng tiền hàng (tổng subTotal các dòng) */
  subTotal?: number;
  /** Tổng tiền thuế (tổng taxAmount các dòng) */
  taxAmount?: number;
  /** Tổng tiền thanh toán (tổng grossAmount các dòng) */
  totalAmount?: number;
  /** Tổng tiền hoa hồng (tổng commissionAmount các dòng) */
  commissionTotal?: number;
}

export const QuotationSortOrderFields: (keyof Quotation)[] = [
  "lines",
  "additionalInfo",
  "commissions",
];

// ───────────────────────────────────────────────────
// Snapshots & Supporting Types
// ───────────────────────────────────────────────────
export interface MeshSpecSnapshot {
  id: string;
  name: string;
  code: string;
}

export interface MeshSpec {
  id: string;
  name: string;
  code: string;
}
