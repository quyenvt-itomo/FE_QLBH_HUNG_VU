import { SortOrder } from "../../constants/enum";
import { IAttribute } from "./attribute";

export interface ApiRequestQuery {
  startAt?: string;
  endAt?: string;
  offsetAt?: string;
  page?: number;
  size?: number;
  keyword?: string;
  type?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  storeId?: string;
}

export interface PayloadWithSubId {
  id: string;
  [key: string]: string;
}

export interface PayloadWithOrderId {
  id: string;
  orderId: string;
}

export interface ImportExcelData {
  url: string;
}

export interface ConfirmData {
  productId: string;
}

export interface ActionProps {
  productId: string;
  oId?: string;
  timeAt?: string;
}

export interface UpdateFileProps {
  productId: string;
  url: string;
}
export interface PaginationProps {
  totalRecords: number;
  size: number;
  totalPages: number;
  currentPage: number;
}

export interface MenuProps {
  label: string;
  value: number;
}

export type SummaryKey =
  | "total"
  | "totalUnread"
  | "beginningBalance"
  | "endingBalance"
  | "totalIncome"
  | "totalExpense"
  | "totalProductAmount"
  | "totalProductDiscountAmount"
  | "totalDiscountAmount"
  | "totalTaxAmount"
  | "totalOrderAmount"
  | "totalPaidAmount"
  | "totalOutstandingAmount"
  | "totalGrossAmount"
  | "totalLineDiscountAmount"
  | "totalOrderDiscountAmount"
  | "totalNetAmount"
  | "totalAmount"
  | "totalIncreaseAmount"
  | "totalDecreaseAmount"
  | "totalLoyaltyPointsUsed"

  // TODO: Tồn kho
  | "closingAmount"
  | "closingQty"
  | "decreaseAmount"
  | "decreaseQty"
  | "increaseAmount"
  | "increaseQty"
  | "openingAmount"
  | "openingQty"
  // TODO: Trạng thái công trình
  | "totalPlanning"
  | "totalInProgress"
  | "totalOnHold"
  | "totalCompleted"
  | "totalOverdue"
  | "totalCancelled"
  | "totalInQty"
  | "totalInAmount"
  | "totalOutQty"
  | "totalOutAmount"
  | "openingBalance"
  | "closingBalance"
  | "totalAdjustmentQty"
  | "totalAdjustmentValue"
  | "totalAdjustmentAmount"
  | "totalOffsetAmount"
  // TODO: Điểm tích lũy
  | "openingPoints"
  | "closingPoints"
  | "increasePoints"
  | "decreasePoints"
  | "pointsEarned"
  | "pointsRedeemed"
  | "openingRevenue"
  | "closingRevenue"
  | "revenueEarned"

  // TODO: Báo cáo ca
  | "totalSaleOrder"
  | "totalSaleReturnOrder"
  | "totalRevenue"
  | "totalDebtAmount"
  | "totalCashInFromOrders"
  | "totalCashIn"
  | "totalCashOut";

export type SummaryData = {
  [key in SummaryKey]: number;
};

export interface FilterItem extends IAttribute {
  parentId?: string;
  value: number;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationProps;
  summary?: SummaryData | null;
  menu: MenuProps[];
  filterItems?: FilterItem[];
  detailError?: any[];
}
