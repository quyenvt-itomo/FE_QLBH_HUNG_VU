import { formatMoney } from "@/shared/utils";
import { Attribute } from "../attribute";
import { Product, ProductSnapshot, StoreProduct } from "./product.model";

export function collectProductUnit(product: Product): { id: string; conversionRate: number }[] {
  const units: { id: string; conversionRate: number }[] = [];
  if (product.baseUnitId) {
    units.push({ id: product.baseUnitId, conversionRate: 1 });
  }
  if (product.extraUnits) {
    product.extraUnits.forEach((eu) => {
      units.push({ id: eu.unitId, conversionRate: eu.conversionRate });
    });
  }
  return units;
}

/**
 * Gom danh sách sản phẩm từ lines (dùng để hideOptions trong select)
 */
export const collectProduct = <
  T extends { product?: Product | null; productSnapshot?: ProductSnapshot | null },
>(
  lines: T[],
): Product[] => {
  return lines
    .map((l) => l.product || l.productSnapshot)
    .filter((p): p is Product => !!p?.id) as unknown as Product[];
};

export function buildProductSnapshot(product: Product) {
  return {
    id: product.id,
    code: product.code,
    name: product.name,
  };
}

export function collectUnits(product: Product, defaultUnit?: Attribute | null): Attribute[] {
  const units: Attribute[] = [];

  if (product.baseUnit) {
    units.push(product.baseUnit);
  }

  if (defaultUnit && !units.find((u) => u.id === defaultUnit.id)) {
    units.push(defaultUnit);
  }

  for (const extraUnit of product.extraUnits || []) {
    if (extraUnit.unit && !units.find((u) => u.id === extraUnit.unitId)) {
      units.push(extraUnit.unit);
    }
  }

  return units;
}

export function getDefaultPurchaseUnit(product?: Product | null): Attribute | null {
  if (!product) return null;
  return (
    product.extraUnits?.find((extraUnit) => extraUnit.isPurchaseUnit)?.unit ||
    product.baseUnit ||
    null
  );
}

export function getDefaultPricePerUnit(product: Product, unitId: string): number | undefined {
  if (product.baseUnitId === unitId) {
    return product.salePrice;
  }

  const extraUnit = product.extraUnits?.find((eu) => eu.unitId === unitId);
  if (extraUnit) {
    return extraUnit.salePrice;
  }

  return undefined;
}

export function collectLocations(product: Product): Attribute[] {
  const result: Attribute[] = [];

  for (const storeProduct of product.storeProducts || []) {
    const locations = collectLocationsFromStoreProducts(storeProduct);
    result.push(...locations);
  }

  return result;
}

export function collectLocationsFromStoreProducts(storeProducts: StoreProduct): Attribute[] {
  const result: Attribute[] = [];

  for (const location of storeProducts.locations || []) {
    if (location.location && !result.find((l) => l.id === location.locationId)) {
      result.push(location.location);
    }
  }

  return result;
}

// danh sách các cửa hàng chung giá vốn của sản phẩm
export function getCostPriceMap(product: Product): Record<string, string[]> {
  const costPriceMap: Record<string, string[]> = {};

  for (const storeProduct of product.storeProducts || []) {
    const costPrice = formatMoney(storeProduct.costPrice);
    if (!costPrice || !storeProduct.store?.name) continue;
    if (!costPriceMap[costPrice]) {
      costPriceMap[costPrice] = [];
    }
    costPriceMap[costPrice].push(storeProduct.store.name);
  }

  return costPriceMap;
}

// Giá vốn theo cửa hàng
export function getCostPriceByStore(data: {
  product: Product;
  storeId?: string;
  unitId?: string | null;
}): number | undefined {
  const { product, storeId, unitId } = data;
  const storeProduct = storeId
    ? product.storeProducts?.find((sp) => sp.storeId === storeId)
    : product.storeProducts?.[0];

  if (!storeProduct) return undefined;

  const conversionRate = unitId
    ? product.extraUnits?.find((eu) => eu.unitId === unitId)?.conversionRate || 1
    : 1;

  return (storeProduct.costPrice || 0) * conversionRate;
}

export const getProductGroupContent = (attribute?: Attribute | null): string => {
  if (!attribute) return "";

  const names: string[] = [];
  let current: Attribute | null | undefined = attribute;

  while (current) {
    if (current.name) {
      names.push(current.name);
    }
    current = current.parent;
  }

  return names.reverse().join(" >> ");
};
