import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IEntity } from "./base/entity";
import { IFile } from "./base/file";
import { IAddress } from "./base/interface";
import { IRole } from "./store/role";

export interface StoreQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IStore extends IEntity {
  code: string;
  name: string;

  image?: IFile[] | null;

  email: string | null;
  phone: string | null;

  taxCode: string | null;
  address: IAddress | null;

  isActive: boolean;

  roles: IRole[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StoreResponse extends ApiResponse {}
