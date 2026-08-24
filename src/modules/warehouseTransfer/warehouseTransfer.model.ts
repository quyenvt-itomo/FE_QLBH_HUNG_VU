import { Entity, EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Attribute, AttributeSnapshot } from "../attribute";
import { ProductSnapshot } from "../product";
import { WarehouseSnapshot } from "../warehouse/warehouse.model";

// ── WarehouseTransferLine ──
export interface WarehouseTransferLine extends Entity {
  warehouseTransferId: string;
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
export interface warehouseTransferQuery extends ApiRequestQuery {
  moreQuery?: any;
  status?: string;
}

// ── Main Entity ──
export interface WarehouseTransfer extends EntityWithStore {
  code: string;
  effectiveDate: string;
  status: string;
  fromWarehouseId: string | null;
  fromWarehouseSnapshot: WarehouseSnapshot | null;
  toWarehouseId: string | null;
  toWarehouseSnapshot: WarehouseSnapshot | null;
  exportedAt: string | null;
  importedAt: string | null;
  subTotal: number;
  discountAmount: number;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  lines: WarehouseTransferLine[];
}
