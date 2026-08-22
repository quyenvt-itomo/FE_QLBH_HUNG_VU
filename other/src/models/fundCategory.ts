import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IAttribute } from "./base/attribute";
import { IEntity } from "./base/entity";

export interface FundCategoryQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IFundCategory extends IEntity {
  name: string;

  fundCategoryGroupId?: string;
  fundCategoryGroup?: IAttribute;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FundCategoryResponse extends ApiResponse {}
