import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { StoreUser, Organization } from "../organization";
import { File } from "@/shared/interfaces/file";
import { Role } from "../role";
import { Employee } from "../employee";

export interface UserQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface User extends Entity {
  code: string;
  name: string;
  username: string;
  email: string | null;
  phone: string | null;
  password: string;
  avatar: File[];
  sourceStoreId: string | null;
  sourceStore?: Organization | null;

  isActive: boolean;

  companyUsers: StoreUser[];

  // for current company context
  roleId?: string | null;
  role?: Role | null;

  employeeId?: string | null;
  employee?: Employee | null;
}
