import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Address } from "@/shared/interfaces/common";
import { Employee } from "../employee";
import { InventoryAdjustment } from "../inventoryAdjustment";

export interface WarehouseSnapshot {
  id: string;
  name: string;
  code: string;
}

export interface WarehouseQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface Warehouse extends Entity {
  code: string;
  name: string;
  phone: string | null;
  address: Address; // địa chỉ

  managerId: string | null; // nhân viên phụ trách
  manager: Employee | null;

  inventoryAdjustments: InventoryAdjustment[];
}
