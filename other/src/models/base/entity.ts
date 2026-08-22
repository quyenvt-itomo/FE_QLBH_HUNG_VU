import { IFile } from "./file";

export interface UserSnapshot {
  id: string;
  name: string;
  code: string;
  username: string;
  phone: string | null;
  avatar: IFile[];
}

export interface IEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  note?: string;
  storeId?: string;
  tempId?: string;
  isDefault?: boolean;
  sortOrder?: number;
  createdBy?: string;
  createdBySnapshot?: UserSnapshot;
  updatedBy?: string;
  updatedBySnapshot?: UserSnapshot;
  isSummary?: boolean;
}
