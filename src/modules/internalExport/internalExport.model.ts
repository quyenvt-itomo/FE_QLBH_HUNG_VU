import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Product, ProductSnapshot } from "../product/product.model";
import { Attribute } from "../attribute/attribute.model";
import { getOptionsByMap } from "@/shared/constants";

export type InternalExportQuery = ApiRequestQuery;

export enum InternalExportType {
  DAMAGED = "damaged",
  USAGE = "usage",
}
export const internalExportTypeMap: Record<InternalExportType, string> = {
  [InternalExportType.USAGE]: "Xuất sử dụng",
  [InternalExportType.DAMAGED]: "Xuất hỏng",
};

export const internalExportTypeOptions = getOptionsByMap(internalExportTypeMap);

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
  type: InternalExportType;
  occurredAt: string;
  reason: string | null;
  lines: InternalExportLine[];
}
