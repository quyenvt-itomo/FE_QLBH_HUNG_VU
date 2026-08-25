import { Entity, StoreEntity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Attribute } from "../attribute/attribute.model";
import { FilterKey, SortItem } from "@/shared/interfaces";
import { WeightUnit } from "@/shared/constants";
import { File } from "@/shared/interfaces/file";
export interface ProductQuery extends ApiRequestQuery {
  groupId?: string;
  productCategoryIds?: string[];
}

export interface ProductSnapshot {
  id: string;
  code: string;
  name: string;
}
export interface StockMetadata {
  total: { quantity: number; value: number };
  byStore: Record<string, { quantity: number; value: number }>;
}

export interface Product extends Entity {
  code: string;
  barcode: string | null;
  name: string;
  description: string | null;

  image?: File[];

  groupId: string | null;
  group: Attribute | null;

  brandId: string | null;
  brand: Attribute | null;

  baseUnitId: string | null;
  baseUnit: Attribute | null;

  salePrice: number; // Giá bán/ĐVT cơ bản

  weight: number | null; // Trọng lượng/ĐVT cơ bản
  weightUnit: WeightUnit; // ĐVT trọng lượng/ĐVT cơ bản

  stockMetadata: StockMetadata;

  // * Đơn vị quy đổi
  extraUnits: ProductExtraUnit[];

  // * Lịch sử giá vốn
  // Price history is accounting/reporting data. Never cascade-delete it with a product.
  priceHistories: ProductPriceHistory[];

  // * Thông tin tại các cửa hàng
  storeProducts: StoreProduct[];

  // TODO: More fields
  stockQuantity?: number;
  stockValue?: number;
}

export interface ProductExtraUnit extends Entity {
  productId: string;
  product: Product;

  unitId: string;
  unit: Attribute | null;

  conversionRate: number;

  salePrice: number; // Giá bán/ĐVT quy đổi
}

export interface ProductPriceHistory extends StoreEntity {
  code: string; // mã phiếu

  productId: string;
  product: Product;

  costPrice: number; // Giá vốn/ĐVT cơ bản

  deltaCostPrice: number; // = costPrice - costPriceBefore, có dấu: +tăng, -giảm
}

export interface StoreProduct extends StoreEntity {
  productId: string;
  product: Product;

  costPrice: number; // Giá vốn tại cửa hàng

  isSelling: boolean; // Đang bán tại cửa hàng

  locationId: string | null; // Vị trí kho/kệ
  location: Attribute | null;
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

export const rangerItems: SortItem[] = [];

export const filterUses: FilterKey[] = ["productGroupIds", "brandIds", "locationIds"];
