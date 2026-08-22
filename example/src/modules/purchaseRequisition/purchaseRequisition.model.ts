import { Entity, EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { ApproveStatus } from "../shared/business.model";
import { Employee, EmployeeSnapshot } from "../employee";
import { Order, OrderSnapshot } from "../order";
import { Organization, OrganizationSnapshot } from "../organization";
import { Product, ProductSnapshot } from "../product";
import { Attribute, AttributeSnapshot } from "../attribute";
import { Production, ProductionSnapshot } from "../production";

// ── PurchaseRequisitionLine ──
export interface PurchaseRequisitionLine extends Entity {
  purchaseRequisitionId: string;

  productId: string | null;
  productSnapshot: ProductSnapshot | null;
  product: Product | null;

  unitId: string | null;
  unitSnapshot: AttributeSnapshot | null;
  unit: Attribute | null;

  quantity: number;

  // ============================== RELATIONSHIPS ==============================
  purchaseRequisition: PurchaseRequisition;
}

// ── PurchaseRequisition ──
export interface PurchaseRequisitionQuery extends ApiRequestQuery {
  departmentId?: string;
  requesterId?: string;
  approveStatus?: string;
}
export interface PurchaseRequisition extends EntityWithCompany {
  timeAt: Date;
  code: string;

  // Bộ phận đề nghị
  departmentId: string | null;
  departmentSnapshot: OrganizationSnapshot | null;
  department: Organization | null;

  // Người đề nghị
  requesterId: string | null;
  requesterSnapshot: EmployeeSnapshot | null;
  requester: Employee | null;

  // Mua theo đơn hàng
  orderId: string | null;
  orderSnapshot: OrderSnapshot | null;
  order: Order | null;

  // Mua theo lệnh sản xuất
  productionId: string | null;
  productionSnapshot: ProductionSnapshot | null;
  production: Production | null;

  approvedAt: Date | null; // Có thể là từ chối hoặc duyệt nhưng đều ghi lại thời điểm xử lý cuối cùng

  approveStatus: ApproveStatus;
  approverId: string | null;
  approverSnapshot: EmployeeSnapshot | null;
  approver: Employee | null;

  rejectReason: string | null; // Nếu bị từ chối thì lưu lý do

  lines: PurchaseRequisitionLine[];
}
