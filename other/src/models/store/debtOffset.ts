import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IPartner } from "../partner";
import { EmployeeSnapshot, IEmployee } from "./employee";
import { IEntityWithStore } from "./entityWithStore";

export interface DebtOffsetQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IDebtOffset extends IEntityWithStore {
  code: string; // mã phiếu

  occurredAt: Date; // ngày ghi nhận điều chỉnh

  offsetById: string | null; // người điều chỉnh
  offsetBySnapshot: EmployeeSnapshot | null;
  offsetBy: IEmployee | null;

  partnerId: string;
  partner: IPartner;

  payableDebtAmount: number;

  receivableDebtAmount: number;

  offsetAmount: number;

  reason: string | null; // lý do điều chỉnh
}

export interface DebtOffsetResponse extends ApiResponse {}
