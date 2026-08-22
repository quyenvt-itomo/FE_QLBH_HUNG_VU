import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Product, ProductSnapshot } from "../product";
import { Attribute, AttributeSnapshot } from "../attribute";
import { Service, ServiceSnapshot } from "../service";
import { Order, OrderCommissionDetail } from "../order/order.model";
import { QuotationLine } from "../quotation";
import { SaleLineType } from "@/shared/constants/enum";

export interface OrderLineQuery extends ApiRequestQuery {
  orderId?: string;
  productId?: string;
}

export interface OrderLine extends Entity {
  orderId: string;
  quotationLineId: string | null;

  type: SaleLineType;

  productId: string | null;
  productSnapshot: ProductSnapshot | null;

  serviceId: string | null;
  serviceSnapshot: ServiceSnapshot | null;

  unitId: string | null;
  unitSnapshot: AttributeSnapshot | null;

  conversionRateAtTime: number;

  // Số lượng thực tế = số lượng tạm tính + tổng số lượng cộng thêm từ người liên hệ
  quantity: number;

  // Giá thực tế = giá tạm tính + giá cộng thêm từ người liên hệ
  unitPrice: number;

  taxRate: number;

  subTotal: number; // Tổng tiền trước thuế và chiết khấu = quantity * unitPrice

  taxAmount: number; // Số tiền thuế của dòng này (subTotal * taxRate)

  grossAmount: number; // Số tiền sau thuế (subTotal + taxAmount)

  // Số tiền hoa hồng
  // = tổng số tiền hoa hồng của tất cả người liên hệ đối với dòng này
  commissionAmount: number;

  costPriceAtTime: number;
  costAmount: number;

  // Kết quả giao
  // deliveredQuantity = sum(stockDocumentLines.billingQuantity)
  // deliveryRate = abs(quantity - deliveredQuantity) / quantity * 100 không vượt quá tolerancePercent
  deliveredQuantity: number;

  // ============================== RELATIONSHIPS ==============================
  order: Order;

  quotationLine: QuotationLine | null;

  product: Product | null;

  service: Service | null;

  unit: Attribute | null;

  commissionDetails: OrderCommissionDetail[];
}
