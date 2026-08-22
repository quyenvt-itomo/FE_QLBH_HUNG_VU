import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IPartner } from "../partner";
import { DiscountTypeEnum, OrderStatusEnum, OrderTypeEnum } from "../../constants/enum";
import { IOrderLine } from "./orderLine";
import { PartnerSnapshot } from "../partner";
import { IEntityWithStore } from "./entityWithStore";
import { EmployeeSnapshot, IEmployee } from "./employee";
import { IIncomeExpense } from "./incomeExpense";

export interface OrderQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IOrder extends IEntityWithStore {
  type: OrderTypeEnum;
  code: string;
  partnerId: string | null;
  partner: IPartner | null;
  partnerSnapshot: PartnerSnapshot;

  orderAt: string; // ngày thực hiện đơn hàng - nhập kho, xuất kho

  employeeId: string | null;
  employee: IEmployee | null;
  employeeSnapshot: EmployeeSnapshot | null;

  discountType: DiscountTypeEnum; // AMOUNT | PERCENT

  discountValue: number | null; // % hoặc số tiền, tuỳ discountType

  // TODO ===== Shipping Info =====
  shippingProviderId: string | null;
  shippingProvider: IPartner | null;
  shippingProviderSnapshot: PartnerSnapshot | null;
  shippingFee: number | null; // phí vận chuyển
  isFreeShipping: boolean; // miễn phí vận chuyển

  // TODO ===== Financial summary =====
  grossAmount: number;
  lineDiscountAmount: number | null;
  orderDiscountAmount: number | null;
  netAmount: number; // thành tiền sau giảm giá
  taxAmount: number; // tiền thuế
  totalAmount: number; // thành tiền cuối đơn hàng (sau thuế)

  // TODO ===== Loyalty Points =====
  pointEarnRate: number; // VNĐ cần để tích 1 điểm (ví dụ: 100000)
  pointRedeemRate: number; // 1 điểm = bao nhiêu VNĐ (ví dụ: 1000)

  // Điểm sử dụng trong đơn này
  loyaltyPointsUsed: number; // Điểm khách dùng
  loyaltyPointsDiscountAmount: number | null; // Giá trị giảm từ điểm

  // Điểm tích được từ đơn này (calculated after order)
  loyaltyPointsEarned: number; // Điểm tích được

  status?: OrderStatusEnum | null;

  refOrderId: string | null;
  refOrder: IOrder | null;

  lines: IOrderLine[];

  incomeExpenses?: IIncomeExpense[];
}

export type OrderSnapshot = Pick<
  IOrder,
  | "id"
  | "code"
  | "type"
  | "orderAt"
  | "partnerSnapshot"
  | "employeeSnapshot"
  | "netAmount"
  | "totalAmount"
  | "status"
>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OrderResponse extends ApiResponse {}
