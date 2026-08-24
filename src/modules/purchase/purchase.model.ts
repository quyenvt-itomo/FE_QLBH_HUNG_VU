import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Partner, PartnerSnapshot } from "../partner";
import { Employee, EmployeeSnapshot } from "../employee";
import { DiscountTypeEnum, getOptionsByMap } from "@/shared/constants/enum";
import { AdditionalInfo } from "@/shared/interfaces/common";
import { EntityWithStore } from "@/shared/base/entity";
import { ApproveStatus } from "../shared/business.model";
import { Invoice } from "../invoice";
import { PartnerContact, PartnerContactSnapshot } from "../partnerContact";
import { PurchaseLine } from "../purchaseLine";

// ── PaymentMethod (module-specific) ──
export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
}
export const paymentMethodMap: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "Tiền mặt",
  [PaymentMethod.BANK_TRANSFER]: "Chuyển khoản",
};
export const paymentMethodOptions = getOptionsByMap(paymentMethodMap);

export interface PurchaseSnapshot {
  id: string;
  code: string;
  orderedAt: Date;
  supplierId: string | null;
  supplierSnapshot: PartnerSnapshot | null;
  sellerId: string | null;
  sellerSnapshot: PartnerContactSnapshot | null;
  staffId: string | null;
  staffSnapshot: EmployeeSnapshot | null;

  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  totalCommissionAmount: number;
}

// ── Purchase ──
export interface PurchaseQuery extends ApiRequestQuery {
  moreQuery?: any;
  supplierId?: string;
  staffId?: string;
  approveStatus?: string;
  isCompleted?: boolean;
}

export interface Purchase extends EntityWithStore {
  /** Compatibility snapshot retained by legacy purchase screens. */
  company?: any;
  orderedAt: Date; // Ngày đặt hàng
  code: string;

  supplierId: string | null;
  supplierSnapshot: PartnerSnapshot | null;
  supplier: Partner | null;

  // Người bán hàng cho mình (Người liên hệ của công ty đối tác)
  sellerId: string | null;
  sellerSnapshot: PartnerContactSnapshot | null;
  seller: PartnerContact | null;

  // Người phụ trách
  staffId: string | null;
  staffSnapshot: EmployeeSnapshot | null;
  staff: Employee | null;

  // Hình thức thanh toán (tiền mặt, chuyển khoản, tín dụng...)
  paymentMethod: PaymentMethod | null;

  toleranceRate: number; // Tỷ lệ dung sai

  discountType: DiscountTypeEnum; // AMOUNT | PERCENT
  discountValue: number; // % hoặc số tiền, tuỳ discountType
  discountAmount: number;

  taxType: DiscountTypeEnum;
  taxValue: number;

  subTotal: number; // Tổng tiền trước thuế và chiết khấu
  taxAmount: number; // Số tiền thuế của toàn bộ đơn hàng (tổng của tất cả dòng)
  totalAmount: number; // Số tiền cuối cùng phải trả (subTotal + taxAmount)

  totalCommissionAmount: number; // Tổng tiền hoa hồng phải trả cho người bán hàng (tổng của tất cả dòng)
  totalActualCommissionAmount: number; // Tổng tiền hoa hồng thực tế đã trả cho người bán hàng (tổng của tất cả dòng)

  // TODO: Thông tin thêm
  additionalInfo: AdditionalInfo[];

  approvedAt: Date | null; // Có thể là từ chối hoặc duyệt nhưng đều ghi lại thời điểm xử lý cuối cùng
  approveStatus: ApproveStatus;

  approverId: string | null;
  approverSnapshot: EmployeeSnapshot | null;
  approver: Employee | null;

  rejectReason: string | null; // Nếu bị từ chối thì lưu lý do

  // Đã hoàn thành chưa
  isCompleted: boolean;
  // Hoàn thành khi nào
  completedAt: Date | null;

  lines: PurchaseLine[];
  invoices: Invoice[];
}

export const PurchaseSortOrderFields: (keyof Purchase)[] = ["lines", "additionalInfo"];
