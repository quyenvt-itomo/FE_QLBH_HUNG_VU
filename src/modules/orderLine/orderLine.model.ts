import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { ProductSnapshot } from "../product/product.model";
import { AttributeSnapshot } from "../attribute/attribute.model";

export interface OrderLineQuery extends ApiRequestQuery { orderId?: string; productId?: string; }

export interface OrderLine extends Entity {
  orderId: string | null;
  returnOrderId: string | null;
  refOrderLineId: string | null;
  productId: string | null;
  productSnapshot: ProductSnapshot;
  unitId: string | null;
  unitSnapshot: AttributeSnapshot | null;
  conversionRateAtTime: number;
  unitPrice: number;
  quantity: number;
  subTotal: number;
  totalCost: number;
  costPriceAtTime: number;
  /** Deprecated fields retained for report/print adapters during migration. */
  quotationLineId?: string | null;
  type?: string;
  serviceId?: string | null;
  serviceSnapshot?: any;
  taxRate?: number;
  taxAmount?: number;
  grossAmount?: number;
  commissionAmount?: number;
  deliveredQuantity?: number;
  product?: any;
  unit?: any;
}
