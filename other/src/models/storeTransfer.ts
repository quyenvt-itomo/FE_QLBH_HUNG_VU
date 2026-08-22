import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IEntity } from "./base/entity";
import { IStore } from "./store";
import { IStoreTransferLine } from "./storeTransferLine";

export interface StoreTransferQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IStoreTransfer extends IEntity {
  code: string;
  occurredAt: string;

  fromStoreId: string;
  fromStore: IStore;

  toStoreId: string;
  toStore: IStore;

  reason?: string;

  lines: IStoreTransferLine[];
}

export interface StoreTransferResponse extends ApiResponse {}
