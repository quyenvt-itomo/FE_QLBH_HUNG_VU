import { DebtDirectionEnum, PartnerDebtSideEnum } from "../../constants/enum";
import { ApiRequestQuery, ApiResponse } from "../base/api";
import { EmployeeSnapshot, IEmployee } from "./employee";
import { IEntityWithStore } from "./entityWithStore";

export interface VatAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IVatAdjustment extends IEntityWithStore {
  code: string; // mã phiếu

  occurredAt: Date; // ngày ghi nhận điều chỉnh

  adjustedById: string; // người điều chỉnh
  adjustedBySnapshot: EmployeeSnapshot;
  adjustedBy: IEmployee;

  side: PartnerDebtSideEnum;

  expectedAmount: number;

  countedAmount: number;

  deltaAmount: number;

  direction: DebtDirectionEnum;

  reason: string | null; // lý do điều chỉnh
}

export interface VatAdjustmentResponse extends ApiResponse {}
