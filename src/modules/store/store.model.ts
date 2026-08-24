import { ApiRequestQuery } from "@/shared/interfaces/api";

export type { Store } from "@/shared/base/entity";

export interface StoreQuery extends ApiRequestQuery {
  isActive?: boolean;
}
