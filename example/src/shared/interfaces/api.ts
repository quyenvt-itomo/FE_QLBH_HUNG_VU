import { Attribute } from "@/modules/attribute";
import { SortOrderEnum } from "../constants/enum";

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
  sortOrder?: SortOrderEnum;
  storeId?: string;
  reload?: boolean;
  isLocked?: boolean;
  isLockedReport?: boolean;
  isLockedTransaction?: boolean;
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

export interface BaseFailurePayload {
  message: string;
  errors: BaseError[];
}

export type SummaryKey =
  // Common
  | "totalUnread"

  // Order / Sale
  | "totalSubTotal"
  | "totalLineDiscountAmount"
  | "totalOrderDiscountAmount"
  | "totalNetAmount"
  | "totalTaxAmount"
  | "totalAmount"
  | "totalSurchargeAmount"
  | "totalCost"
  | "totalPaidAmount"
  | "totalCustomerCount"

  // Inventory
  | "openingAmount"
  | "inAmount"
  | "outAmount"
  | "closingAmount"
  | "openingQuantity"
  | "inQuantity"
  | "outQuantity"
  | "closingQuantity"
  | "totalAdjustmentAmount"
  | "totalAdjustmentQuantity"
  | "totalAdjustmentValue"
  | "totalInQuantity"
  | "totalInAmount"
  | "totalOutQuantity"
  | "totalOutAmount"

  // Shift / Cashier
  | "totalOpeningCash"
  | "totalClosingCash"
  | "totalExpectedCash"
  | "totalDifference"
  | "totalOrders"
  | "totalSuccessOrders"
  | "totalRevenue"
  | "totalRefundedAmount"
  | "totalDebtAmount"
  | "totalCashInFromOrders"
  | "totalCashOutFromOrders"
  | "totalCashInByFund"
  | "totalCashOutByFund"
  | "totalNetCashFlow"

  // Accountant
  | "totalIncome"
  | "totalExpense"

  // Current debt (nợ hiện tại theo hóa đơn)
  | "totalDebt"
  | "totalNotDue"
  | "totalOverdue"
  | "under30Days"
  | "under60Days"
  | "under90Days"
  | "over90Days";

export type SummaryData = {
  [key in SummaryKey]: number;
};

export interface FilterItem extends Attribute {
  value: number;
}

// ===== Types =====
export interface BaseError {
  message: string;
  field: string;
  elementKey?: string;
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
  detailError?: BaseError[];
}

export interface SortData {
  id: string;
  sortOrder: number;
}
