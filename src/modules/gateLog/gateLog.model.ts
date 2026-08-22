import { EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface gateLogQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface GateLog extends EntityWithCompany {
  code: string;
  note?: string | null;
  occurredAt: string;
  vehiclePlate: string | null;
  vehicleType: string | null;
  status: string;
  type: string;
}
