import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Address } from "@/shared/interfaces/common";
import { File } from "@/shared/interfaces/file";
import { Gender } from "@/shared/constants/enum";
import { Role } from "../role";

export interface UserQuery extends ApiRequestQuery {
  storeId?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface User extends Entity {
  code: string;
  name: string;
  username: string;
  password?: string;
  email: string | null;
  phone: string | null;
  gender?: Gender | null;
  dob?: Date | null;
  address?: Address | null;
  roleId: string | null;
  role?: Role | null;
  isActive: boolean;
  avatar?: File[];
}
