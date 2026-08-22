import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IRole } from "./role";
import { IUser } from "../user";
import { IEntityWithStore } from "./entityWithStore";

export interface StoreUserQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export type StoreUserStatusType = "active" | "inactive" | "suspended";

export interface IStoreUser extends IEntityWithStore {
  userId: string;
  roleId: string | null;
  user: IUser;
  role: IRole | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StoreUserResponse extends ApiResponse {}
