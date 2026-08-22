import { Entity, EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { AdditionalInfo } from "@/shared/interfaces/common";
import { Partner, PartnerSnapshot } from "../partner";
import { Employee, EmployeeSnapshot } from "../employee";
import { MeshSpec, MeshSpecSnapshot, Quotation } from "../quotation";
import { OrderLine } from "../orderLine";
import { PartnerContactSnapshot } from "../partnerContact";
import { Invoice } from "../invoice";
import { CommissionAllocation } from "../incomeExpense";
import { CommissionMode } from "@/shared/constants/enum";

// ── OrderCommission ──
export interface OrderCommission extends Entity {
  orderId: string;

  // Người hưởng (liên hệ đối tác)
  partnerContactId: string | null;
  partnerContactSnapshot: PartnerContactSnapshot | null;

  totalAmount: number;

  // ============================ RELATIONS ========================= //
  order: any;
  partnerContact: any | null;
  details: OrderCommissionDetail[];
}

// ── OrderCommissionDetail ──
export interface OrderCommissionDetail extends Entity {
  orderCommissionId: string;
  orderLineId: string;

  totalAmount: number;

  // ============================ RELATIONS ========================= //
  orderCommission: any | null;
  orderLine: any;
}

// ── Query ──
export interface OrderQuery extends ApiRequestQuery {
  moreQuery?: any;
  customerId?: string;
  staffId?: string;
  isCompleted?: boolean;
  approveStatus?: string;
}

export interface OrderSnapshot {
  id: string;
  code: string;
  timeAt: string;
  customerId: string | null;
  customerSnapshot: PartnerSnapshot | null;
  staffId: string | null;
  staffSnapshot: EmployeeSnapshot | null;
}

// ── Order ──
export interface Order extends EntityWithCompany {
  timeAt: Date;
  code: string;

  commissionMode: CommissionMode | null; // Cách tính hoa hồng: theo giá hay theo lượng

  // Gắn với báo giá
  sourceQuotationId: string | null;

  // Khách hàng
  customerId: string | null;
  customerSnapshot: PartnerSnapshot | null;

  // Người phụ trách
  staffId: string | null;
  staffSnapshot: EmployeeSnapshot | null;

  meshSpecId: string | null;
  meshSpecSnapshot: MeshSpecSnapshot | null;

  additionalInfo: AdditionalInfo[];

  // Đã hoàn thành chưa
  isCompleted: boolean;
  // Hoàn thành khi nào
  completedAt: Date | null;

  // Số lần tạo lệnh sản xuất
  productionCount: number;

  // =====================================================
  // SỐ LIỆU TỔNG HỢP (Aggregate — tránh tính lại khi hiển thị danh sách)
  // =====================================================
  subTotal: number;

  taxAmount: number;

  totalAmount: number;

  totalCommissionAmount: number;

  totalCost: number;

  // ============================ RELATIONS ========================= //
  sourceQuotation: Quotation | null;

  meshSpec: MeshSpec | null;

  customer: Partner | null;

  staff: Employee | null;

  lines: OrderLine[];

  commissions: OrderCommission[];

  commissionAllocations: CommissionAllocation[];

  invoices: Invoice[];
}
