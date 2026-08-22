import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Product, ProductSnapshot } from "../product";
import { Attribute, AttributeSnapshot } from "../attribute";

export interface PurchaseLineQuery extends ApiRequestQuery {
  purchaseId?: string;
  productId?: string;
}

export interface PurchaseLine extends Entity {
  purchaseId: string;

  productId: string | null;
  productSnapshot: ProductSnapshot | null;
  product: Product | null;

  unitId: string | null;
  unitSnapshot: AttributeSnapshot | null;

  conversionRateAtTime: number;
  unit: Attribute | null;

  quantity: number;
  unitPrice: number;
  taxRate: number;

  subTotal: number;
  taxAmount: number;
  grossAmount: number;

  commissionRate: number;
  commissionAmount: number;

  deliveredQuantity: number;
  actualCommissionAmount: number;
}
