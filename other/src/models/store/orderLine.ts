import { DiscountTypeEnum, OrderLineTypeEnum } from "../../constants/enum";
import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IAttribute } from "../base/attribute";
import { IProductVariant, ProductVariantSnapshot } from "../product";
import { IEntityWithStore } from "./entityWithStore";

export interface OrderLineQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IOrderLine extends IEntityWithStore {
  orderId: string;

  lineType: OrderLineTypeEnum;

  productVariantId: string | null;
  productVariant: IProductVariant | null;
  productVariantSnapshot: ProductVariantSnapshot;

  // TODO: Trước giảm giá
  unitPrice: number;
  quantity: number;
  subTotal: number;

  // TODO: Giảm giá trên dòng
  discountValue: number | null; // giá trị giảm (số tiền | % tuỳ discountType)
  discountType: DiscountTypeEnum; // AMOUNT | PERCENT
  discountAmount: number | null; // giá trị giảm của dòng (đã quy ra tiền do BE tính)

  // TODO: Giảm giá của hợp đồng phân bổ xuống dòng (calculate on BE)
  orderDiscountAmount: number | null; // giá trị giảm của hợp đồng được phân bổ xuống dòng (đã quy ra tiền, BE tính)

  // TODO: Sau giảm giá và tính phụ phí
  netAmount: number; // thành tiền sau giảm giá (amount - discountAmount - contractDiscountAmount + contractExtraFeeAmount, BE tính)

  // TODO: Thuế
  taxRate: number | null; // 0, 8, 10
  taxAmount: number; // tiền thuế (calculate on price - discountAmount, BE tính)

  // TODO: Thành tiền cuối dòng
  totalAmount: number; // thành tiền cuối dòng (after discount + tax, BE tính)

  refOrderLineId: string | null;
  refOrderLine: IOrderLine | null;

  sortOrder: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OrderLineResponse extends ApiResponse {}
