import { IncomeExpenseTypeEnum } from "../../constants/enum";
import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IFundCategory } from "../fundCategory";
import { IPartner, PartnerSnapshot } from "../partner";
import { EmployeeSnapshot, IEmployee } from "./employee";

import { IEntityWithStore } from "./entityWithStore";
import { IFund } from "../fund";
import { IOrder } from "./order";

export interface IncomeExpenseQuery extends ApiRequestQuery {
  moreQuery?: any;
  type?: IncomeExpenseTypeEnum;
  categoryId?: string;
  fundCategoryGroupId?: string;
}

export interface IIncomeExpense extends IEntityWithStore {
  occurredAt: string;
  code: string;
  type: IncomeExpenseTypeEnum;
  creatorId: string | null;
  creatorSnapshot: EmployeeSnapshot | null;

  fundId: string;
  fund: IFund;

  amount: number;

  categoryId: string;
  category: IFundCategory | null;

  orderId: string | null;
  order: IOrder | null;

  partnerId: string | null;
  partner: IPartner | null;
  partnerSnapshot: PartnerSnapshot | null;

  description: string | null;

  creator: IEmployee | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IncomeExpenseResponse extends ApiResponse {}
