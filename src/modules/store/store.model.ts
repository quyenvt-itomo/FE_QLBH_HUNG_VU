import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Address } from "@/shared/interfaces/common";

export interface Store extends Entity {
  code: string;
  name: string;
  email: string | null;
  phone: string | null;
  taxCode: string | null;
  address: Address | null;
  isActive: boolean;

  userCount: number;
}
export interface StoreQuery extends ApiRequestQuery {
  isActive?: boolean;
}
