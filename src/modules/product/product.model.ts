import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Attribute } from "../attribute";
import { AttributeType } from "../attribute/attribute.enum";
import { getOptionsByMap } from "@/shared/constants/enum";

export interface ProductQuery extends ApiRequestQuery {
  moreQuery?: any;
  groupId?: string;
}

export enum ProductType {
  FINISHED = "finished",
  MAIN_MATERIAL = "main_material",
  SUB_MATERIAL = "sub_material",
}

export const productTypeMap: Record<ProductType, string> = {
  [ProductType.FINISHED]: "Thành phẩm",
  [ProductType.MAIN_MATERIAL]: "Nguyên liệu chính",
  [ProductType.SUB_MATERIAL]: "Nguyên liệu phụ",
};

export const productTypeOptions = getOptionsByMap(productTypeMap);

/** Product type → Attribute group type */
export const productGroupAttributeMap: Record<ProductType, AttributeType> = {
  [ProductType.FINISHED]: AttributeType.FINISHED_GROUP,
  [ProductType.MAIN_MATERIAL]: AttributeType.MAIN_MATERIAL_GROUP,
  [ProductType.SUB_MATERIAL]: AttributeType.SUB_MATERIAL_GROUP,
};

/** Get type-aware label */
export function productLabel(type: ProductType, base: string): string {
  const typeName = productTypeMap[type] || type;
  return `${base} ${typeName.toLowerCase()}`;
}

export interface ProductSnapshot {
  id: string;
  code: string;
  name: string;
  type: ProductType;
}

export interface Product extends Entity {
  type: ProductType;
  code: string;
  name: string;
  groupId: string;
  group?: Attribute | null;
  baseUnitId: string;
  baseUnit?: Attribute | null;
  price: number;
  taxRate: number;
  stockMetadata?: Record<string, any> | null;
  isPublic: boolean;
  note?: string | null;
  extraUnits?: ProductExtraUnit[];
  priceHistories?: ProductPriceHistory[];
}

export interface ProductExtraUnit extends Entity {
  productId: string;
  unitId: string;
  unit?: Attribute | null;
  conversionRate: number;
  pricePerUnit?: number;
}

export interface ProductPriceHistory extends Entity {
  productId: string;
  unitId: string;
  unit?: Attribute | null;
  pricePerUnit: number;
}
