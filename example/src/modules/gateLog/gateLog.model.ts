import { EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface gateLogQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface GateLog extends EntityWithStore {
  code: string;
  note?: string | null;
  occurredAt: string;
  vehiclePlate: string | null;
  vehicleType: string | null;
  status: string;
  type: string;
}
