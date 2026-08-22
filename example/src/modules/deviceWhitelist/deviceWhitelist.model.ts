import { EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface deviceWhitelistQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface DeviceWhitelist extends EntityWithCompany {
  code: string;
  note?: string | null;
  userId: string;
  deviceId: string;
  status: string;
  expiredAt: string | null;
  requestedAt: string;
  approverId: string | null;
}
