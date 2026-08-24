import { Entity, EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { AdditionalInfo } from "@/shared/interfaces/common";
import { getOptionsByMap } from "@/shared/constants/enum";
import { Attribute, AttributeSnapshot } from "../attribute";
import { ProductSnapshot } from "../product";
import { WarehouseSnapshot } from "../warehouse";

// ── InventoryAdjustmentLine ──
export interface InventoryAdjustmentLine extends Entity {
  inventoryAdjustmentId: string;
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
export interface inventoryAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
  status?: string;
}

// ── Main Entity ──
export interface InventoryAdjustment extends EntityWithStore {
  code: string;
  effectiveDate: string;
  status: string;
  warehouseId: string | null;
  warehouseSnapshot: WarehouseSnapshot | null;
  occurredAt: string;
  reason: string | null;
  totalAdjustmentQuantity: number;
  totalAdjustmentValue: number;
  isInitial: boolean;
  subTotal: number;
  discountAmount: number;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  lines: InventoryAdjustmentLine[];
}
