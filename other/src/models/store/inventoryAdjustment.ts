import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IEmployee } from "./employee";
import { IEntityWithStore } from "./entityWithStore";
import { IInventoryAdjustmentLine } from "./inventoryAdjustmentLine";

export interface InventoryAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IInventoryAdjustment extends IEntityWithStore {
  code?: string;
  occurredAt?: string;

  adjustedById?: string;
  adjustedBy?: IEmployee;

  reason?: string;

  totalAdjustmentQty: number;
  totalAdjustmentValue: number;

  lines?: IInventoryAdjustmentLine[];
}

export interface InventoryAdjustmentResponse extends ApiResponse {}
