import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Product, ProductSnapshot } from "../product/product.model";
import { Attribute } from "../attribute/attribute.model";

export type InternalExportQuery = ApiRequestQuery;

export enum InternalExportTypeEnum {
  DAMAGED = "damaged",
  USAGE = "usage",
}

export const internalExportTypeItems = [
  { label: "Xuất hỏng", value: InternalExportTypeEnum.DAMAGED },
  { label: "Xuất sử dụng", value: InternalExportTypeEnum.USAGE },
];

export interface InternalExportLine extends Entity {
  internalExportId: string;
  productId: string;
  productSnapshot: ProductSnapshot | null;
  product?: Product | null;
  unitId: string | null;
  unitSnapshot: { id: string; name: string } | null;
  unit?: Attribute | null;
  conversionRateAtTime: number;
  quantity: number;
}

export interface InternalExport extends Entity {
  code: string;
  storeId: string;
  type: InternalExportTypeEnum;
  occurredAt: string;
  reason: string | null;
  lines: InternalExportLine[];
}
