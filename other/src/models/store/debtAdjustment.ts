import { DebtDirectionEnum, PartnerDebtSideEnum } from "../../constants/enum";
import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IPartner } from "../partner";
import { EmployeeSnapshot, IEmployee } from "./employee";
import { IEntityWithStore } from "./entityWithStore";

export interface DebtAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
  storeId?: string;
  side: PartnerDebtSideEnum;
}

export interface IDebtAdjustment extends IEntityWithStore {
  code: string; // mã phiếu

  occurredAt: Date; // ngày ghi nhận điều chỉnh

  adjustedById: string; // người điều chỉnh
  adjustedBySnapshot: EmployeeSnapshot;
  adjustedBy: IEmployee;

  side: PartnerDebtSideEnum;

  partnerId: string;
  partner: IPartner;

  expectedAmount: number;

  countedAmount: number;

  deltaAmount: number;

  direction: DebtDirectionEnum;

  reason: string | null; // lý do điều chỉnh
}

export interface DebtAdjustmentResponse extends ApiResponse {}
