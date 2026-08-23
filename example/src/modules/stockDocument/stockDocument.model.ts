import { EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { getOptionsByMap } from "@/shared/constants/enum";
import { Representative } from "@/shared/interfaces/common";
import { Partner, PartnerSnapshot } from "../partner";
import { Warehouse, WarehouseSnapshot } from "../warehouse";
import { ShippingPlan, ShippingPlanSnapshot } from "../shippingPlan";
import { Order, OrderSnapshot } from "../order";
import { Purchase, PurchaseSnapshot } from "../purchase";
import { Production, ProductionSnapshot } from "../production";
import { GateLog } from "../gateLog";
import { InvoiceType } from "../invoice";
import { StockDocumentLine } from "../stockDocumentLine";

export enum StockDocumentType {
  PURCHASE_RECEIPT = "purchase_receipt",
  MATERIAL_ISSUE = "material_issue",
  PRODUCTION_RECEIPT = "production_receipt",
  ORDER_ISSUE = "order_issue",
}
export const stockDocumentTypeMap: Record<StockDocumentType, string> = {
  [StockDocumentType.PURCHASE_RECEIPT]: "Nhập mua",
  [StockDocumentType.MATERIAL_ISSUE]: "Xuất NVL",
  [StockDocumentType.PRODUCTION_RECEIPT]: "Nhập thành phẩm",
  [StockDocumentType.ORDER_ISSUE]: "Xuất bán",
};
export const stockDocumentTypeOptions = getOptionsByMap(stockDocumentTypeMap);
// Các type có chênh lệch giữa chứng từ và thực tế (có thể có lợi hoặc có hại)
export const stockDocumentTypeWithVariance = [
  StockDocumentType.PURCHASE_RECEIPT,
  StockDocumentType.ORDER_ISSUE,
];

export enum StockDocumentStatus {
  PENDING = "pending",
  EXPORTED = "exported",
  COMPLETED = "completed",
}
export const stockDocumentStatusMap: Record<StockDocumentStatus, string> = {
  [StockDocumentStatus.PENDING]: "Chờ xử lý",
  [StockDocumentStatus.EXPORTED]: "Đã xuất",
  [StockDocumentStatus.COMPLETED]: "Hoàn thành",
};
export const stockDocumentStatusOptions = getOptionsByMap(stockDocumentStatusMap);
export const stockDocumentStatusOptionsWithoutExported = getOptionsByMap({
  [StockDocumentStatus.PENDING]: stockDocumentStatusMap[StockDocumentStatus.PENDING],
  [StockDocumentStatus.COMPLETED]: stockDocumentStatusMap[StockDocumentStatus.COMPLETED],
});

export interface StockDocumentSnapshot {
  id: string;
  code: string;
  effectiveDate: Date | null;
  type: StockDocumentType;
  partnerId: string | null;
  partnerSnapshot: PartnerSnapshot | null;
  representative: Representative | null;
  vehicleType: string | null;
  vehiclePlate: string | null;
  warehouseId: string | null;
  warehouseSnapshot: WarehouseSnapshot | null;
  shippingPlanId: string | null;
  shippingPlanSnapshot: ShippingPlanSnapshot | null;
  totalVarianceAmount: number;
  actualExportDate: Date | null;
  actualImportDate: Date | null;
}

export interface StockDocumentQuery extends ApiRequestQuery {
  type?: StockDocumentType;
  partnerId?: string;
  warehouseId?: string;
  purchaseId?: string;
  orderId?: string;
  productionId?: string;
  shippingPlanId?: string;
  status?: string;
}

export interface StockDocument extends EntityWithCompany {
  // Ngày hiệu lực dự kiến (Ngày nhập đối với nhập mua, ngày xuất dự kiến đối với xuất bán)
  effectiveDate: Date | null;
  code: string;
  type: StockDocumentType;

  orderId: string | null; // Đơn hàng liên quan (nếu có)
  orderSnapshot: OrderSnapshot | null; // Snapshot của đơn hàng liên quan (nếu có)
  order: Order | null;

  purchaseId: string | null; // Đơn mua liên quan (nếu có)
  purchaseSnapshot: PurchaseSnapshot | null; // Snapshot của đơn mua liên quan (nếu có)
  purchase: Purchase | null;

  productionId: string | null; // Lệnh sản xuất liên quan (nếu có)
  productionSnapshot: ProductionSnapshot | null; // Snapshot của lệnh sản xuất liên quan (nếu có)
  production: Production | null;

  sequenceNumber: number; // Số thứ tự (Vì là theo đơn hàng, đơn mua, hoặc lệnh sản xuất)

  partnerId: string | null;
  partnerSnapshot: PartnerSnapshot | null;
  partner: Partner | null;

  shipperId: string | null;
  shipperSnapshot: PartnerSnapshot | null;
  shipper: Partner | null;

  // Người đại diện giao dịch (nếu là purchase_receipt, hoặc order_issue)
  representative: Representative | null;

  // Loại phương tiện vận chuyển
  vehicleType: string | null;

  // Biển số xe
  vehiclePlate: string | null;

  warehouseId: string | null;
  warehouseSnapshot: WarehouseSnapshot | null;
  warehouse: Warehouse | null;

  shippingPlanId: string | null;
  shippingPlanSnapshot: ShippingPlanSnapshot | null;
  shippingPlan: ShippingPlan | null;

  // Tổng tiền chênh lệch
  totalVarianceAmount: number;

  // Ngày xuất kho thực tế (chỉ có đối với xuất bán, mặc định = timeAt nếu là xuất NVL)
  actualExportDate: Date | null;

  // Ngày nhập kho thực tế (chỉ có đối với nhập mua, mặc định = timeAt nếu là nhập thành phẩm)
  actualImportDate: Date | null;
  status: StockDocumentStatus;

  lines: StockDocumentLine[];

  gateLogs: GateLog[];

  invoices: InvoiceType[];
}

export type ConfirmImportDto = {
  lines: {
    id: string;
    stockQuantity: number;
  }[];
  actualImportDate?: Date | null | undefined;
};

export type ConfirmExportDto = {
  lines: {
    id: string;
    stockQuantity: number;
    additionalQuantity?: number | undefined;
  }[];
  actualExportDate?: Date | null | undefined;
};

export type ConfirmBillingPayload = {
  lines: {
    id: string;
    billingQuantity: number;
  }[];
};
