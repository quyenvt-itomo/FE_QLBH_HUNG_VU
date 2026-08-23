import { Gender } from "../constants/enum";
import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IEntity } from "./base/entity";
import { IFile } from "./base/file";
import { IAddress } from "./base/interface";
import { IEmployee } from "./store/employee";
import { IStoreUser } from "./store/storeUser";
import { ISystemRole } from "./systemRole";

export interface UserQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export type UserStatusType = "active" | "inactive" | "suspended";

export interface IUser extends IEntity {
  avatar: IFile[];
  username: string;
  password: string;
  name: string;
  code: string;
  email: string | null;
  phone: string | null;
  gender: Gender | null;
  dob: Date | null;
  address: IAddress | null;

  systemRoleId: string | null;
  systemRole?: ISystemRole | null;

  employeeId: string | null;
  employee?: IEmployee | null;

  isActive: boolean;
  storeUsers?: IStoreUser[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserResponse extends ApiResponse {}
