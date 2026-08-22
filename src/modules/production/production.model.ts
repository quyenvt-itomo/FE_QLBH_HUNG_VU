import { Entity, EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { AdditionalInfo } from "@/shared/interfaces/common";
import { getOptionsByMap } from "@/shared/constants/enum";
import { Attribute, AttributeSnapshot } from "../attribute";
import { OrderSnapshot } from "../order";
import { MeshSpecSnapshot } from "../quotation";
import { OrganizationSnapshot } from "../organization";
import { ProductSnapshot } from "../product/product.model";
import { EmployeeSnapshot } from "../employee";
import { WarehouseSnapshot } from "../warehouse";

export enum ProductionStatusEnum {
  PLANNING = "planning",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export const productionStatusMap: Record<ProductionStatusEnum, string> = {
  [ProductionStatusEnum.PLANNING]: "Lên kế hoạch",
  [ProductionStatusEnum.IN_PROGRESS]: "Đang sản xuất",
  [ProductionStatusEnum.COMPLETED]: "Hoàn thành",
  [ProductionStatusEnum.CANCELED]: "Đã hủy",
};

export enum ProductionTypeEnum {
  MESH = "mesh",
  STEEL_DRAWING = "steel_drawing",
  NORMAL = "normal",
}

export interface ProductionInput extends Entity {
  productionId: string;
  productId: string | null;
  productSnapshot: ProductSnapshot | null;
  unitId: string | null;
  unitSnapshot: AttributeSnapshot | null;
  conversionRateAtTime: number;
  quantity: number;
  actualQuantity: number;
  unitCost: number;
  totalCost: number;
  warehouseId: string | null;
}

export interface ProductionOutput extends Entity {
  productionId: string;
  productId: string | null;
  productSnapshot: ProductSnapshot | null;
  quantity: number;
  actualQuantity: number;
  costRatio: number;
  unitCost: number;
  totalCost: number;
  lotCode: string | null;
  barcode: string | null;
  manufacturedAt: string | null;
  expiredAt: string | null;
  location: string | null;
}

export interface ProductionQuery extends ApiRequestQuery {
  moreQuery?: any;
  status?: ProductionStatusEnum;
  type?: ProductionTypeEnum;
  orderId?: string;
  warehouseId?: string;
}

export interface ProductionSnapshot {
  id: string;
  type: ProductionTypeEnum;
  timeAt: Date;
  code: string;
  name: string;
  sequenceNumber: number;
  orderId: string | null;
  orderSnapshot: OrderSnapshot | null;
  meshSpecId: string | null;
  meshSpecSnapshot: MeshSpecSnapshot | null;
  staffId: string | null;
  staffSnapshot: EmployeeSnapshot | null;
  factoryId: string | null;
  factorySnapshot: OrganizationSnapshot | null;
}

export interface Production extends EntityWithCompany {
  code: string;
  timeAt: string;
  type: ProductionTypeEnum;
  status: ProductionStatusEnum;
  orderId: string | null;
  staffId: string | null;
  staffSnapshot: EmployeeSnapshot | null;
  warehouseId: string | null;
  warehouseSnapshot: WarehouseSnapshot | null;
  additionalInfo: AdditionalInfo[] | null;
  cancelReason: string | null;
  expectedCompletionDate: string | null;
  exportedAt: string | null;
  exporterId: string | null;
  importedAt: string | null;
  importerId: string | null;
  totalInputCost: number;
  totalOutputCost: number;
  productionVariance: number;
  inputs: ProductionInput[];
  outputs: ProductionOutput[];
}
