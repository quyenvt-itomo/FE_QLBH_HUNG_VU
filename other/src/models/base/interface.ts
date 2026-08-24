import { FormInstance } from "antd";
import { BaseError } from "../../stores/baseReducers";
import { ApiRequestQuery, PaginationProps } from "./api";
import { ActionType, AttributeTypeEnum, SortOrder, TypeMessage } from "../../constants/enum";
import { IEntity } from "./entity";

export interface AddUpdateModalProps<T> {
  open: boolean;
  editData?: T;
  errors: BaseError[] | null;
  loading?: boolean;
  type?: string;
  form?: FormInstance<any>;
  onClose: () => void;
  onEdit?: (data: Partial<T>) => void;
  onAdd?: (data: T) => void;
}

export interface DetailModalProps<T> {
  open: boolean;
  data: T;
  loading?: boolean;
  type?: string;
  onClose: () => void;
  onEdit?: (data: Partial<T>) => void;
}

export interface IAddress {
  state?: string; // Tỉnh/Thành phố
  ward?: string; // Phường/Xã
  detail?: string; // Địa chỉ chi tiết
}

export interface DocumentModel {
  name: string; // Tên tài liệu
  url: string; // Đường dẫn đến tài liệu
}

export interface FilterItemProps {
  key: string;
  value: number;
  text: string;
}

// * === Hook Interface ===
export interface UseDataParams extends ApiRequestQuery {
  id?: string;
  storeId?: string;
  isLockHook?: boolean;
  filter?: Filter;
  ranger?: Ranger;
  search?: Search;
  reload?: boolean;
  offsetAt?: string;
  onCloseModal?: (data?: { isAdded?: boolean; isUpdated?: boolean; isDeleted?: boolean }) => void;
}

// * === Filter Interface ===
export interface ListItemProps<T = any> {
  dataSource: T[];
  pagination?: PaginationProps | null;
  loading?: boolean;
  onClick?: (data: T) => void;
  setPage?: (page: number) => void;
}

// * === Manager Moadel Interface ===
export interface ManagerModalProps<T> {
  open: boolean;
  loading?: boolean;
  selectedValue?: string | null;
  dataSource: T[];
  label: string;
  dataType?: "string" | "number";
  validateFormat?: boolean;
  type?: AttributeTypeEnum;
  onClose: () => void;
  onAdd?: (data: T) => void;
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  onSelect: (data: T) => void;
}
export interface MultipleManagerModalProps<T> {
  open: boolean;
  loading?: boolean;
  selectedValues?: string[] | null;
  dataSource: T[];
  label: string;
  dataType?: "string" | "number";
  validateFormat?: boolean;
  type?: AttributeTypeEnum;
  onClose: () => void;
  onAdd?: (data: T) => void;
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  onSelect: (data: T[]) => void;
}

// * === Add Modal Interface ===
export interface AddModalProps<T> {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onAdd: (data: T) => void;
}

// * === Message Toast Interface ===
export interface MessageToastModel {
  type: TypeMessage;
  message?: string;
  action?: ActionType;
}

// * === Filter Interface ===
export type FilterKey =
  | "userIds"
  | "employeeIds"
  | "partnerIds"
  | "supplierIds"
  | "customerIds"
  | "shipperIds"
  | "fundIds"
  | "productIds"
  | "productCategoryIds"
  | "unitIds"
  | "customerGroupId";
export type Filter = {
  [key in FilterKey]?: any[];
};

export type RangeOperator = "Gte" | "Gt" | "Eq" | "Lte" | "Lt";

export type RangerKey =
  // TODO: PRODUCT
  | "taxRate"
  | "costPrice"
  | "price"

  // TODO: ORDER
  | "grossAmount"
  | "subtotal"
  | "lineDiscountAmount"
  | "orderDiscountAmount"
  | "netAmount"
  | "taxAmount"
  | "totalAmount"
  | "amount"
  | "totalStockQty"
  | "totalStockValue"

  // TODO: Adjustment
  | "totalAdjustmentQty"
  | "totalAdjustmentValue"

  // TODO: Inventory Transaction
  | "quantity"
  | "quantityInBaseUnit"
  | "totalCost"
  | "openingQty"
  | "openingAmount"
  | "closingQty"
  | "closingAmount"
  | "increaseQty"
  | "increaseAmount"
  | "decreaseQty"
  | "decreaseAmount"

  // TODO: Transfer & Adjustment
  | "countedAmount"
  | "expectedAmount"
  | "deltaAmount"

  // TODO: Partner
  | "loyaltyPoints"
  | "totalRevenue"

  // TODO: Shift
  | "openingCash"
  | "closingCash"
  | "difference";

export type Ranger = {
  [key in `${RangerKey}${RangeOperator}`]?: number;
};

export type RangerItem = {
  key: RangerKey;
  label: string;
};

export type SearchItem = {
  key: string;
  label: string;
};

export type Search = {
  [key: string]: string | undefined;
};

export interface SortValue {
  sortBy?: string;
  sortOrder?: SortOrder;
}
export interface SortItem {
  label: string;
  value: string;
  ascLabel: string;
  descLabel: string;
}

export type PartialFilterProps<T extends IEntity = any> = {
  // filterKey: string;
  // value?: string[];
  // onChange?: (value?: string[]) => void;
  data: T[];
  setData: (data: T[]) => void;
};
