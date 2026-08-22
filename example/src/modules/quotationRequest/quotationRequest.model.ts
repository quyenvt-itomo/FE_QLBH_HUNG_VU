import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Entity, EntityWithCompany } from "@/shared/base/entity";
import { Partner, PartnerSnapshot } from "../partner";
import { Employee, EmployeeSnapshot } from "../employee";
import { Product, ProductSnapshot } from "../product";
import { Attribute, AttributeSnapshot } from "../attribute";
import { ApproveStatus } from "../shared/business.model";
import { PartnerContact, PartnerContactSnapshot } from "../partnerContact";

// ── QuotationRequestLine ──
export interface QuotationRequestLine extends Entity {
  quotationRequestId: string;

  productId: string | null;
  productSnapshot: ProductSnapshot | null;
  product: Product | null;

  unitId: string | null;
  unitSnapshot: AttributeSnapshot | null;
  unit: Attribute | null;

  quantity: number;

  // ============================== RELATIONSHIPS ==============================
  quotationRequest: QuotationRequest;
}

// ── Query ──
export interface QuotationRequestQuery extends ApiRequestQuery {
  moreQuery?: any;
  customerId?: string;
  staffId?: string;
  approveStatus?: string;
}

// ── Main Entity ──
export interface QuotationRequest extends EntityWithCompany {
  timeAt: Date;
  code: string;

  // Người phụ trách
  staffId: string | null;
  staffSnapshot: EmployeeSnapshot | null;
  staff: Employee | null;

  // Khách hàng
  customerId: string | null;
  customerSnapshot: PartnerSnapshot | null;
  customer: Partner | null;

  // Người đề nghị
  requesterId: string | null;
  requesterSnapshot: PartnerContactSnapshot | null;
  requester: PartnerContact | null;

  approvedAt: Date | null; // Có thể là từ chối hoặc duyệt nhưng đều ghi lại thời điểm xử lý cuối cùng
  approveStatus: ApproveStatus;

  approverId: string | null;
  approverSnapshot: EmployeeSnapshot | null;
  approver: Employee | null;

  rejectReason: string | null; // Nếu bị từ chối thì lưu lý do

  lines: QuotationRequestLine[];
}

export const QuotationRequestSortOrderFields: (keyof QuotationRequest)[] = ["lines"];
