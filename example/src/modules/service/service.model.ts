import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Attribute } from "../attribute";
import { getOptionsByMap } from "@/shared/constants/enum";

export interface ServiceQuery extends ApiRequestQuery {
  type?: ServiceType;
}

export enum ServiceType {
  IN_HOUSE = "in_house",
  OUTSOURCED = "outsourced",
}

export const serviceTypeMap: Record<ServiceType, string> = {
  [ServiceType.IN_HOUSE]: "Nội bộ",
  [ServiceType.OUTSOURCED]: "Thuê ngoài",
};

export const serviceTypeOptions = getOptionsByMap(serviceTypeMap);

export function serviceLabel(type: ServiceType, base: string): string {
  return `${base} dịch vụ ${serviceTypeMap[type].toLowerCase()}`;
}

export interface ServiceSnapshot {
  id: string;
  code: string;
  name: string;
}

export interface Service extends Entity {
  type: ServiceType;
  code: string;
  name: string;
  taxRate: number;
  units?: ServiceUnit[];
}

export interface ServiceUnit extends Entity {
  serviceId: string;
  unitId: string;
  unit?: Attribute | null;
  costPrice: number;
  unitPrice: number;
}
