import { formatMoney } from "@/shared/utils";
import { Attribute, DEFAULT_WEIGHT_UNIT } from "../attribute";
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

interface ConversionParams {
  product?: Product | null;
  unitId?: string | null;
  quantity?: number;
}
// Tính kệ số quy đổi ra kg
export function getConversionRateToKg(data: ConversionParams): number {
  const { product, unitId } = data;
  if (!product || !unitId) return 1;

  const units = collectUnits(product);
  const kgUnit = units.find((u) => u.name === DEFAULT_WEIGHT_UNIT);

  if (!kgUnit || unitId === kgUnit.id) return 1;

  // Đơn vị gốc của sản phẩm
  if (unitId === product.baseUnitId) {
    const kgExtraUnit = product.extraUnits?.find((u) => u.unitId === kgUnit.id);

    if (!kgExtraUnit || !kgExtraUnit.conversionRate) {
      return 1;
    }

    // 1 KG = conversionRate BaseUnit
    // => 1 BaseUnit = 1 / conversionRate KG
    return 1 / kgExtraUnit.conversionRate;
  }

  // Đơn vị phụ cần quy đổi về BaseUnit trước
  const extraUnit = product.extraUnits?.find((u) => u.unitId === unitId);

  if (!extraUnit) return 1;

  // Nếu BaseUnit chính là KG
  if (product.baseUnitId === kgUnit.id) {
    return extraUnit.conversionRate;
  }

  // BaseUnit -> KG
  const kgExtraUnit = product.extraUnits?.find((u) => u.unitId === kgUnit.id);

  if (!kgExtraUnit || !kgExtraUnit.conversionRate) {
    return 1;
  }

  // unit -> BaseUnit -> KG
  return extraUnit.conversionRate / kgExtraUnit.conversionRate;
}

// Tính số lượng khi quy đổi sang Kg
export function getQuantityInKg(data: ConversionParams): number {
  const { product, unitId, quantity = 0 } = data;
  const conversionRate = getConversionRateToKg({ product, unitId });
  return quantity * conversionRate;
}

export function getPriceInKg(product?: Product): number {
  if (!product) return 0;

  const kgUnit = collectUnits(product).find((u) => u.name === DEFAULT_WEIGHT_UNIT);

  if (!kgUnit) return 0;

  return getDefaultPricePerUnit(product, kgUnit.id) || 0;
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
