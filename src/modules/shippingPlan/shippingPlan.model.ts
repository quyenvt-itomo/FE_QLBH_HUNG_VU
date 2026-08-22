import { Entity, EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { ApproveStatus } from "../shared/business.model";
import { Partner, PartnerSnapshot } from "../partner";
import { Employee, EmployeeSnapshot } from "../employee";

export interface ShippingPlanQuery extends ApiRequestQuery {
  purchaseId?: string;
  orderId?: string;
  partnerId?: string;
  approveStatus?: ApproveStatus;
}

export interface ShippingPlanSnapshot {
  id: string;
  code: string;
  partnerId: string | null;
  partnerSnapshot: PartnerSnapshot | null;
  unitPrice: number;
}

export interface ShippingPlan extends EntityWithCompany {
  code: string;
  plannedAt: string;

  // Đơn mua hàng
  purchaseId: string | null;

  // Đơn hàng (sales flow)
  orderId: string | null;

  // Đơn vị vận chuyển
  partnerId: string | null;
  partnerSnapshot: PartnerSnapshot | null;
  partner: Partner | null;

  // Chi phí
  unitPrice: number;
  quantity: number;
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;

  // Duyệt
  approvedAt: string | null;
  approveStatus: ApproveStatus;
  approverId: string | null;
  approverSnapshot: EmployeeSnapshot | null;
  approver: Employee | null;
  rejectReason: string | null;
}
