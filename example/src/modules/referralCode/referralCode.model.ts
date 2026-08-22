import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Employee, EmployeeSnapshot } from "../employee";
import { PurchaseRequisition } from "../purchaseRequisition";
import { Partner, PartnerSnapshot } from "../partner";

// ── ReferralCode ──
export interface ReferralCodeQuery extends ApiRequestQuery {
  purchaseRequisitionId?: string;
}

export interface ReferralCodeLineSnapshot {
  productId: string;
  productCode: string;
  productName: string;
  unitId: string;
  unitName: string;
  quantity: number;
}

export interface ReferralCode extends Entity {
  code: string;

  purchaseRequisitionId: string;
  purchaseRequisition: PurchaseRequisition;

  staffId: string;
  staffSnapshot: EmployeeSnapshot | null;
  staff: Employee | null;

  expiresAt: Date | null;

  isUsed: boolean;
  isLock: boolean;

  usedAt: Date | null;

  partnerId: string | null;
  partnerSnapshot: PartnerSnapshot | null;
  partner: Partner | null;

  linesSnapshot: ReferralCodeLineSnapshot[] | null;
}
