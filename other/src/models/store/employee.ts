import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IAttribute } from "../base/attribute";
import { IFile } from "../base/file";
import { IAddress } from "../base/interface";
import { IEntityWithStore } from "./entityWithStore";

export interface EmployeeQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export type EmployeeStatus = "active" | "inactive" | "terminated";

export interface IEmployee extends IEntityWithStore {
  code: string;
  name: string;

  avatar?: IFile[];

  positionId?: string | null;
  position?: IAttribute | null;

  email: string;
  phone?: string | null;
  address?: IAddress | null;

  identityNumber?: string | null;
}
export interface EmployeeSnapshot {
  id: string;
  code: string;
  name: string;
  email: string | null;
  phone: string | null;
  identityNumber: string | null;

  position: {
    id: string;
    name: string;
  } | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EmployeeResponse extends ApiResponse {}
