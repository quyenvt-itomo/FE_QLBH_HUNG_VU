import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Attribute } from "../attribute/attribute.model";
import { AttributeType } from "../attribute/attribute.enum";
import { FilterKey, SortItem } from "@/shared";

export interface ProductQuery extends ApiRequestQuery {
  groupId?: string;
  productCategoryIds?: string[];
}

/** Legacy screen grouping; BE stores this as Attribute.groupId. */
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
export const productTypeOptions = Object.entries(productTypeMap).map(([value, label]) => ({
  key: value,
  value,
  label,
}));
export const productGroupAttributeMap: Record<ProductType, any> = {
  [ProductType.FINISHED]: AttributeType.PRODUCT_GROUP,
  [ProductType.MAIN_MATERIAL]: AttributeType.PRODUCT_GROUP,
  [ProductType.SUB_MATERIAL]: AttributeType.PRODUCT_GROUP,
};
export function productLabel(type: ProductType, base: string): string {
  return `${base} ${(productTypeMap[type] || type).toLowerCase()}`;
}

export interface ProductSnapshot {
  id: string;
  code: string;
  name: string;
  type?: ProductType;
}

export interface ProductStockMetadata {
  total: { quantity: number; value: number };
  byStore: Record<string, { quantity: number; value: number }>;
}

export interface Product extends Entity {
  groupId: string | null;
  group?: Attribute | null;
  brandId: string | null;
  brand?: Attribute | null;
  code: string;
  name: string;
  baseUnitId: string | null;
  baseUnit?: Attribute | null;
  salePrice: number;
  /** @deprecated use salePrice */
  price: number;
  /** @deprecated pricing tax is no longer a Product field */
  taxRate?: number;
  /** @deprecated product grouping is represented by groupId */
  type?: ProductType;
  isPublic?: boolean;
  stockMetadata?: ProductStockMetadata | null;
  isSaling: boolean;
  extraUnits?: ProductExtraUnit[];
  priceHistories?: ProductPriceHistory[];
}

export interface ProductExtraUnit extends Entity {
  productId: string;
  unitId: string;
  unit?: Attribute | null;
  conversionRate: number;
  salePrice: number;
  /** @deprecated use salePrice */
  pricePerUnit?: number;
}

export interface ProductPriceHistory extends Entity {
  storeId: string;
  productId: string | null;
  productSnapshot?: ProductSnapshot | null;
  code: string;
  costPrice: number;
  deltaCostPrice: number;
  unitId?: string;
  unit?: Attribute | null;
  pricePerUnit?: number;
}

export const sortItems: SortItem[] = [
  { label: "Ngày tạo", value: "createAt", ascLabel: "Cũ nhất", descLabel: "Mới nhất" },
  { label: "Mã hàng", value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
  { label: "Tên hàng", value: "name", ascLabel: "A → Z", descLabel: "Z → A" },
  {
    label: "Tồn kho",
    value: "stockQuantity",
    ascLabel: "Tồn ít nhất",
    descLabel: "Tồn nhiều nhất",
  },
];

export const filterUses: FilterKey[] = ["productGroupIds", "brandIds", "locationIds"];
