import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Address, FilterKey, SortItem } from "@/shared";
import { Gender } from "@/shared/constants/enum";
import { Role } from "../role";
import { StoreEntity } from "../store";

export interface UserQuery extends ApiRequestQuery {
  storeId?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface StoreUser extends StoreEntity {
  userId: string;
}

export interface User extends Entity {
  code: string;
  name: string;

  username: string;
  password: string;

  email: string | null;
  phone: string | null;
  gender: Gender | null;
  dob: Date | null;
  address: Address | null;

  roleId: string | null;
  role: Role | null;

  isActive: boolean;

  notifications?: Notification[];

  storeUsers?: StoreUser[];
}

export const sortItems: SortItem[] = [
  { label: "Ngày tạo", value: "createAt", ascLabel: "Từ cũ đến mới", descLabel: "Từ mới đến cũ" },
  { label: "Mã người dùng", value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
  { label: "Tên người dùng", value: "name", ascLabel: "A → Z", descLabel: "Z → A" },
  { label: "Tên đăng nhập", value: "username", ascLabel: "A → Z", descLabel: "Z → A" },
];

export const filterUses: FilterKey[] = ["storeIds", "roleIds"];
