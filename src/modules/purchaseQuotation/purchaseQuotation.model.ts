import { Entity, EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { ApproveStatus } from "../shared/business.model";
import { Partner, PartnerSnapshot } from "../partner";
import { PartnerContact, PartnerContactSnapshot } from "../partnerContact";
import { Employee, EmployeeSnapshot } from "../employee";
import { Product, ProductSnapshot } from "../product";
import { Attribute, AttributeSnapshot } from "../attribute";
import { getOptionsByMap } from "@/shared/constants/enum";
import { ReferralCode } from "../referralCode";

export enum PurchaseQuotationType {
  // Báo giá / Chào giá (Báo giá là có mã giới thiệu, chào giá là không có mã giới thiệu)
  OFFER = "offer", // Chào giá
  QUOTATION = "quotation", // Báo giá
}
export const purchaseQuotationTypeMap: Record<PurchaseQuotationType, string> = {
  [PurchaseQuotationType.QUOTATION]: "Báo giá",
  [PurchaseQuotationType.OFFER]: "Chào giá",
};
export const purchaseQuotationTypeOptions = getOptionsByMap(purchaseQuotationTypeMap);

// ── PurchaseQuotationLine ──
export interface PurchaseQuotationLine extends Entity {
  purchaseQuotationId: string;
  purchaseQuotation: PurchaseQuotation;

  productId: string | null;
  productSnapshot: ProductSnapshot | null;
  product: Product | null;
  // More fields for product details to avoid extra joins
  productCode: string | null;
  productName: string | null;
  unitCode: string | null;
  unitName: string | null;

  unitId: string | null;
  unitSnapshot: AttributeSnapshot | null;
  unit: Attribute | null;

  quantity: number;

  unitPrice: number;

  taxRate: number;

  subTotal: number;

  taxAmount: number; // Số tiền thuế của dòng này (subTotal * taxRate)

  grossAmount: number; // Số tiền sau thuế (subTotal + taxAmount)
}

// ── PurchaseQuotation ──
export interface PurchaseQuotationQuery extends ApiRequestQuery {
  supplierId?: string;
  staffId?: string;
  approveStatus?: string;
}
export interface PurchaseQuotation extends EntityWithStore {
  timeAt: Date;
  code: string;
  type: PurchaseQuotationType;

  // Người phụ trách
  staffId: string | null;
  staffSnapshot: EmployeeSnapshot | null;
  staff: Employee | null;

  // Nhà cung cấp
  supplierId: string | null;
  // Được sinh ra trước khi có partner (hoặc nếu tìm được đơn vị trùng mã số thuế thì gắn cùng luôn)
  // Ban đầu chưa có, khi phê duyệt thì có option là có tạo mới partner luôn hay không
  // ? nếu có thì sẽ gắn supplierId vào partner mới tạo
  // ? nếu không thì để null và chỉ lưu snapshot thông tin nhà cung cấp vào quotation
  supplierSnapshot: PartnerSnapshot | null;
  supplier: Partner | null;

  referralCodeId: string | null;
  referralCode: ReferralCode | null;

  // Người báo giá
  quoterId: string | null;
  quoterSnapshot: PartnerContactSnapshot | null;
  quoter: PartnerContact | null;

  subTotal: number; // Tổng tiền trước thuế và chiết khấu
  taxAmount: number; // Số tiền thuế
  totalAmount: number; // Số tiền cuối cùng phải trả (subTotal + taxAmount)

  approvedAt: Date | null; // Có thể là từ chối hoặc duyệt nhưng đều ghi lại thời điểm xử lý cuối cùng
  approveStatus: ApproveStatus;
  approverId: string | null;
  approverSnapshot: EmployeeSnapshot | null;
  approver: Employee | null;
  rejectReason: string | null; // Nếu bị từ chối thì lưu lý do

  lines: PurchaseQuotationLine[];
}
