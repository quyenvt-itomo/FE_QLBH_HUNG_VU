import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { CompanyUser, Organization } from "../organization";
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
  sourceCompanyId: string | null;
  sourceCompany?: Organization | null;

  isActive: boolean;

  companyUsers: CompanyUser[];

  // for current company context
  roleId?: string | null;
  role?: Role | null;

  employeeId?: string | null;
  employee?: Employee | null;
}
