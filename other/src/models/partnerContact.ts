import { ApiRequestQuery, ApiResponse } from "./base/api";

import { IBank } from "./partner";

export interface ContactQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IContact {
  id: string;
  partnerId: string;
  name: string;
  email: string;
  phone: string;
  banks: IBank[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ContactResponse extends ApiResponse {}
