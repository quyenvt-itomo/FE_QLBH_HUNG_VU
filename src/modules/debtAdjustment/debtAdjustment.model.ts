import { StoreEntity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { DebtSide } from "@/shared/constants/enum";
import { Partner, PartnerSnapshot } from "@/modules/partner/partner.model";

export interface DebtAdjustmentQuery extends ApiRequestQuery {
  side?: DebtSide;
  partnerIds?: string[];
  partnerGroupId?: string;
  partnerGroupIds?: string[];
}

export interface DebtAdjustment extends StoreEntity {
  code: string;
  occurredAt: string;
  side: DebtSide;
  partnerId: string | null;
  partnerSnapshot: PartnerSnapshot | null;
  partner?: Partner | null;
  expectedAmount: number;
  countedAmount: number;
  deltaAmount: number;
  reason: string | null;
  isInitial?: boolean;
}

export { DebtSide };
