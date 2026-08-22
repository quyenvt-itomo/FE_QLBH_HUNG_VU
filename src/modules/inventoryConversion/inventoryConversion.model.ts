import { Entity, EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Attribute, AttributeSnapshot } from "../attribute";
import { ProductSnapshot } from "../product";
import { WarehouseSnapshot } from "../warehouse";

// ── InventoryConversionLine ──
export interface InventoryConversionLine extends Entity {
  inventoryConversionId: string;
  productId: string | null;
  productSnapshot: ProductSnapshot | null;
  unitId: string | null;
  unit: Attribute | null;
  unitSnapshot: AttributeSnapshot | null;
  conversionRateAtTime: number;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  discountAmount: number;
  netAmount: number;
  taxRate: number;
  taxAmount: number;
  grossAmount: number;
  note?: string | null;
}

// ── Query ──
export interface inventoryConversionQuery extends ApiRequestQuery {
  moreQuery?: any;
  status?: string;
}

// ── Main Entity ──
export interface InventoryConversion extends EntityWithCompany {
  code: string;
  effectiveDate: string;
  status: string;
  warehouseId: string | null;
  warehouseSnapshot: WarehouseSnapshot | null;
  fromProductId: string | null;
  fromUnitId: string | null;
  fromQuantity: number;
  toProductId: string | null;
  toUnitId: string | null;
  toQuantity: number;
  subTotal: number;
  discountAmount: number;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  lines: InventoryConversionLine[];
}
