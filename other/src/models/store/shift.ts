import { ApiRequestQuery, ApiResponse } from "../base/api";
import { ShiftStatusEnum, ChecklistKey, CASH_KEYS } from "../../constants/enum";
import { IEntityWithStore } from "./entityWithStore";

export interface ShiftQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export type ShiftChecklistItem = Record<ChecklistKey, boolean>;

export type CashKey = (typeof CASH_KEYS)[number];

export interface IShift extends IEntityWithStore {
  code: string;

  // vào ca
  startAt: string;
  openingCash: number; // số tiền mặt khi vào ca (1)
  openingCashSnapshot: Record<CashKey, number> | null; // snapshot số lượng tiền mặt theo mệnh giá khi vào ca, ví dụ { "100000": 2, "50000": 3 }

  openingChecklist: ShiftChecklistItem | null;

  // ra ca
  endAt: string | null;

  totalSaleOrder: number | null; // Tổng đơn hàng trong ca
  totalSaleReturnOrder: number | null; // Tổng đơn hoàn trả trong ca
  totalDebtAmount: number | null; // Tổng tiền khách chưa thanh toán trong ca

  totalCashInFromOrders: number | null; // tổng tiền mặt thu vào từ đơn hàng trong ca (2)
  totalCashIn: number | null; // tổng tiền mặt thu vào trong ca (không theo đơn hàng) (3)
  totalCashOut: number | null; // tổng tiền mặt chi ra trong ca (không theo đơn hàng hoặc theo đơn nhập hàng) (4)
  expectedCash: number | null; // số tiền mặt dự kiến phải có khi ra ca = (1 + 2 + 3 - 4)

  closingCash: number | null;
  closingCashSnapshot: Record<CashKey, number> | null; // snapshot số lượng tiền mặt theo mệnh giá khi ra ca

  difference: number | null; // = closingCash - expectedCash, nếu dương là thừa tiền, âm là thiếu tiền
  closingChecklist: ShiftChecklistItem | null;

  status: ShiftStatusEnum;
}

export interface OpenShiftPayload {
  openingCash: number;
  openingCashSnapshot: Record<CashKey, number> | null;
  openingChecklist: ShiftChecklistItem | null;
  note?: string;
}

export interface CloseShiftPayload {
  id: string;
  closingCash: number;
  closingCashSnapshot: Record<CashKey, number> | null;
  closingChecklist: ShiftChecklistItem | null;
  note?: string;
}

export interface ShiftSummary {
  shift: IShift;

  totalSaleOrder: number | null; // Tổng đơn hàng trong ca
  totalSaleReturnOrder: number | null; // Tổng đơn hoàn trả trong ca
  totalRevenue: number | null; // Tổng doanh thu trong ca (đã trừ hoàn trả)
  totalDebtAmount: number | null; // Tổng tiền khách chưa thanh toán trong ca

  totalCashInFromOrders: number | null; // tổng tiền mặt thu vào từ đơn hàng trong ca (2)
  totalCashIn: number | null; // tổng tiền mặt thu vào trong ca (không theo đơn hàng) (3)
  totalCashOut: number | null; // tổng tiền mặt chi ra trong ca (không theo đơn hàng hoặc theo đơn nhập hàng) (4)
  expectedCash: number | null; // số tiền mặt dự kiến phải có khi ra ca = (1 + 2 + 3 - 4)
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ShiftResponse extends ApiResponse {}
