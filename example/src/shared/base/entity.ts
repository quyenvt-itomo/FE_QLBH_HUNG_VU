import { Attribute } from "@/modules/attribute";
import { Organization } from "@/modules/organization/organization.model";
import { Role } from "@/modules/role";
import { FileCategory, Gender } from "@/shared/constants/enum";
import { Address } from "@/shared/interfaces/common";
import { File } from "@/shared/interfaces/file";

export type ActionKey =
  | "update"
  | "delete"
  | "assign"
  | "unassign"
  | "confirm"
  | "cancelConfirm"
  | "cancel"
  | "approve"
  | "reject"
  | "submit"
  | "complete"
  | "archive"
  | "restore"
  | "start"
  | "pay"
  | "arrive"
  | "accept"
  | "remind"
  | "export"
  | "import"
  | "createPurchase"
  | "createShippingPlan"
  | "createStockDocument"
  | "createInvoice"
  | "createPayment"
  | "createQuotation"
  | "createOrder"
  | "customerApprove"
  | "customerReject"
  | "updateMode"
  | "sendMessage";

export type ActionValue = {
  can: boolean;
  reason?: string;
};

export type ActionMap = Partial<Record<ActionKey, ActionValue>>;

// Auto-derived file category keys (lowercased from FileCategory enum)
type FileCategoryKey = Lowercase<keyof typeof FileCategory>;

export type Entity = {
  id: string;
  tempId: string;
  note?: string | null;
  sortOrder?: number;
  isDefault?: boolean;

  createdAt?: string;
  updatedAt?: string | null;

  // BE audit fields
  creatorId?: string | null;
  creatorSnapshot?: UserSnapshot | null;
  updaterId?: string | null;
  updaterSnapshot?: UserSnapshot | null;
  deleterId?: string | null;
  deleterSnapshot?: UserSnapshot | null;

  // FE-only runtime fields
  _actions?: ActionMap;

  __trashFileIds?: string[];
  __unCloseAfterSucess?: boolean;

  isSummary?: boolean;
} & {
  [K in FileCategoryKey]?: any[];
};

export interface EntityWithStore extends Entity {
  storeId?: string | null;
  company?: Organization | null;
}

export interface User extends Entity {
  code: string;
  name: string;
  avatar: File[];
  email: string | null;
  phone: string | null;
  gender: Gender | null;
  dob: Date | null;
  address: Address | null;

  positionId: string | null;
  position: Attribute | null;

  isActive: boolean;

  // TODO: Thông tin đăng nhập
  canLogin: boolean;
  username: string;
  password: string;

  roleId: string | null;
  role: Role | null;
}

// ── Snapshots (dữ liệu rút gọn để nhúng vào các entity khác) ──

export interface UserSnapshot {
  id: string;
  code: string;
  name: string;
  username?: string | null;
  // FE extended fields (may be returned by API)
  avatar?: File[];
  email?: string | null;
  phone?: string | null;
}
