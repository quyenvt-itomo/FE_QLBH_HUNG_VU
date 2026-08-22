import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Product, ProductType } from "../product";
import { Attribute, AttributeSnapshot } from "../attribute";

export interface BOMOperationMaterial extends Entity {
  bomOperationId: string;
  bomOperation: BOMOperation;

  type: ProductType; // Không lấy FINISHED

  materialGroupId: string | null; // Nhóm nguyên vật liệu chính (nếu type là MAIN_MATERIAL)
  materialGroup: Attribute | null;

  materialId: string | null; // Nguyên vật liệu cụ thể (nếu type là SUB_MATERIAL)
  material: Product | null;

  unitId: string | null; // Đơn vị tính
  unitSnapshot: AttributeSnapshot | null; // Lưu snapshot tên đơn vị để tránh join khi tính toán

  quantity: number; // Số lượng nguyên vật liệu cần cho công đoạn này
}

export interface BOMOperation extends Entity {
  billOfMaterialId: string;
  billOfMaterial: BillOfMaterial;

  operationId: string;
  operation: Attribute;

  // Giá sản xuất của công đoạn này
  unitProductionCost: number;

  materials: BOMOperationMaterial[];
}

// ── BOM Query ──
export interface BOMQuery extends ApiRequestQuery {
  moreQuery?: any;
  productId?: string;
}

// ── Main Entity ──
export interface BillOfMaterial extends Entity {
  productId: string;
  product: Product;

  unitId: string;
  unit: Attribute;

  operations: BOMOperation[];
}
