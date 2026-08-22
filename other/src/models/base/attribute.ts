import { AttributeTypeEnum } from "../../constants/enum";
import { IFundCategory } from "../fundCategory";
import { ApiRequestQuery, ApiResponse } from "./api";
import { IEntity } from "./entity";

export interface AttributeQuery extends ApiRequestQuery {
  moreQuery?: any;
  type?: AttributeTypeEnum;
}

export interface IAttribute extends IEntity {
  name: string; // Tên đơn vị
  type: AttributeTypeEnum;

  parentId?: string | null;
  parent?: IAttribute | null;

  fundCategories?: IFundCategory[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AttributeResponse extends ApiResponse {}
