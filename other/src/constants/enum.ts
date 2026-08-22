import { Module } from "./permission";

export enum ActionType {
  add,
  edit,
  delete,
  none,
}

export enum TypeMessage {
  none,
  success,
  error,
  warning,
  info,
}

export const DEFAULT_ERROR = "Đã xảy ra lỗi không xác định, vui lòng thử lại sau.";

export enum TimeFormat {
  TwelveHour = "12",
  TwentyFourHour = "24",
}

export enum DateFormat {
  DayMonthYear = "DD/MM/YYYY",
  YearMonthDay = "YYYY/MM/DD",
}

export enum FormatValueNumber {
  NoDecimal = 0,
  OneDecimal = 1,
  TwoDecimals = 2,
}

export enum SortOrderEnum {
  ASC = "ASC",
  DESC = "DESC",
}

export enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}
export const genderMap: Record<GenderEnum, string> = {
  [GenderEnum.MALE]: "Nam",
  [GenderEnum.FEMALE]: "Nữ",
  [GenderEnum.OTHER]: "Khác",
};

export enum storeStatusEnum {
  TRIAL = "trial",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  EXPIRED = "expired",
}

export enum storeUserStatusEnum {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  LEFT = "left",
}

export enum FileEntityEnum {
  PRODUCT = "product",
  PRODUCT_VARIANT = "productVariant",

  CUSTOMER = "customer",
  SUPPLIER = "supplier",
  EMPLOYEE = "employee",
  DOCUMENT = "document",
  USER = "user",
  STORE = "store",
  EXCEL_IMPORT = "excelImport",
}

export enum FileCategoryEnum {
  AVATAR = "avatar",
  LOGO = "logo",
  BANNER = "banner",
  ALBUM = "album",
  TRANSACTION = "transaction",
  DOCUMENT = "document",
  OTHER = "other",
  IMAGE = "image",
}

export enum AttributeTypeEnum {
  PRODUCT_CATEGORY = "product_category", // Loại sản phẩm
  PRODUCT_UNIT = "product_unit", // Đơn vị tính
  PRODUCT_TYPE = "product_type", // Loại hàng hóa

  CUSTOMER_GROUP = "customer_group",
  SUPPLIER_GROUP = "supplier_group",
  SHIPPER_GROUP = "shipper_group",
  EMPLOYEE_POSITION = "employee_position",

  INCOME_CATEGORY = "income_category",
  EXPENSE_CATEGORY = "expense_category",
}

export const attributeTypeMap: Record<AttributeTypeEnum, string> = {
  [AttributeTypeEnum.PRODUCT_CATEGORY]: "Danh mục hàng hóa",
  [AttributeTypeEnum.PRODUCT_UNIT]: "Đơn vị tính hàng hóa",
  [AttributeTypeEnum.PRODUCT_TYPE]: "Loại hàng hóa",

  [AttributeTypeEnum.CUSTOMER_GROUP]: "Nhóm khách hàng",
  [AttributeTypeEnum.SUPPLIER_GROUP]: "Nhóm nhà cung cấp",
  [AttributeTypeEnum.SHIPPER_GROUP]: "Nhóm đơn vị vận chuyển",
  [AttributeTypeEnum.EMPLOYEE_POSITION]: "Vị trí công việc",

  [AttributeTypeEnum.INCOME_CATEGORY]: "Hạng mục thu",
  [AttributeTypeEnum.EXPENSE_CATEGORY]: "Hạng mục chi",
};

export const attributeSystemModuleMap: Record<AttributeTypeEnum, Module> = {
  [AttributeTypeEnum.PRODUCT_CATEGORY]: "category",
  [AttributeTypeEnum.PRODUCT_UNIT]: "unit",
  [AttributeTypeEnum.PRODUCT_TYPE]: "productType",

  [AttributeTypeEnum.CUSTOMER_GROUP]: "category",
  [AttributeTypeEnum.SUPPLIER_GROUP]: "category",
  [AttributeTypeEnum.SHIPPER_GROUP]: "category",

  [AttributeTypeEnum.EMPLOYEE_POSITION]: "position",

  [AttributeTypeEnum.INCOME_CATEGORY]: "category",
  [AttributeTypeEnum.EXPENSE_CATEGORY]: "category",
};

export enum ExcelEntityType {
  PRODUCT = "product",
  PARTNER = "partner",
  EMPLOYEE = "employee",
  CUSTOMER = "customer",
  SALE_ORDER = "sale_order",
  INVENTORY_ADJUSTMENT = "inventory_adjustment",
  INVENTORY_REPORT = "inventory_report",
  DASHBOARD = "dashboard",
  INCOME_EXPENSE = "income_expense",
}

export enum ImportErrorHandling {
  STOP_ON_ERROR = "stop_on_error", // Dừng lại khi có lỗi
  SKIP_ERROR = "skip_error", // Bỏ qua dòng lỗi
}

export enum ImportDuplicateHandling {
  STOP = "stop", // Dừng lại báo trùng
  SKIP = "skip", // Bỏ qua dòng trùng
  UPDATE = "update", // Cập nhật thông tin mới
}

export enum FileTypeEnum {
  PDF = "PDF",
  DOC = "DOC",
  EXCEL = "EXCEL",
}

export enum ManagerDataTypeEnum {
  STRING = "STRING",
  NUMBER = "NUMBER",
  DATE = "DATE",
}

// TODO: Notification
export enum NotificationTypeEnum {
  INFO = "INFO",
  WARNING = "WARNING",
  ALERT = "ALERT",
}

export enum NotificationActionTypeEnum {
  VIEW = "VIEW",
  DISMISS = "DISMISS",
}

export enum OrderStatusEnum {
  DRAFT = "draft", // nháp
  POSTED = "posted", // đã duyệt
  CANCELLED = "cancelled", // đã hủy
}

export enum OrderLineTypeEnum {
  NORMAL = "normal",
  RETURN = "return",
}

export const orderStatusMap: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.DRAFT]: "Nháp",
  [OrderStatusEnum.POSTED]: "Đã duyệt",
  [OrderStatusEnum.CANCELLED]: "Đã hủy",
};

export enum FundTypeEnum {
  CASH = "cash",
  BANK = "bank",
}

export const fundTypeMap: Record<FundTypeEnum, string> = {
  cash: "Tiền mặt",
  bank: "Ngân hàng",
};

export enum IncomeExpenseTypeEnum {
  INCOME = "income", // Thu
  EXPENSE = "expense", // Chi
}
export const incomeExpenseTypeMap: Record<IncomeExpenseTypeEnum, string> = {
  income: "Thu tiền",
  expense: "Chi tiền",
};

export enum FundTransactionTypeEnum {
  INCREASE = "increase",
  DECREASE = "decrease",
}

export const fundTransactionTypeMap: Record<FundTransactionTypeEnum, string> = {
  [FundTransactionTypeEnum.INCREASE]: "Tăng",
  [FundTransactionTypeEnum.DECREASE]: "Giảm",
};

export enum FundTransactionRefTypeEnum {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
  ADJUSTMENT = "adjustment",
}
export const fundRefTypeMap: Record<FundTransactionRefTypeEnum, string> = {
  [FundTransactionRefTypeEnum.INCOME]: "Thu tiền",
  [FundTransactionRefTypeEnum.EXPENSE]: "Chi tiền",
  [FundTransactionRefTypeEnum.TRANSFER]: "Chuyển quỹ",
  [FundTransactionRefTypeEnum.ADJUSTMENT]: "Điều chỉnh quỹ",
};

export enum InventoryTransactionTypeEnum {
  IN = "in",
  OUT = "out",
}

export enum InventoryTransactionRefTypeEnum {
  PURCHASE = "purchase",
  SALE = "sale",
  PURCHASE_RETURN = "purchase_return",
  SALE_RETURN = "sale_return",
  TRANSFER = "transfer",
  ADJUST = "adjust",
}

export const inventoryRefTypeMap: Record<InventoryTransactionRefTypeEnum, string> = {
  [InventoryTransactionRefTypeEnum.PURCHASE]: "Nhập từ đơn nhập hàng",
  [InventoryTransactionRefTypeEnum.SALE]: "Xuất hàng theo đơn bán",
  [InventoryTransactionRefTypeEnum.PURCHASE_RETURN]: "Trả hàng NCC",
  [InventoryTransactionRefTypeEnum.SALE_RETURN]: "KH trả hàng",
  [InventoryTransactionRefTypeEnum.TRANSFER]: "Chuyển kho",
  [InventoryTransactionRefTypeEnum.ADJUST]: "Điều chỉnh tồn kho",
};

export enum PartnerTypeEnum {
  CUSTOMER = "customer", // khách hàng
  SUPPLIER = "supplier", // nhà cung cấp
  SHIPPER = "shipper", // đơn vị vận chuyển
}
export const partnerTypeMap: Record<PartnerTypeEnum, string> = {
  [PartnerTypeEnum.CUSTOMER]: "Khách hàng",
  [PartnerTypeEnum.SUPPLIER]: "Nhà cung cấp",
  [PartnerTypeEnum.SHIPPER]: "Đơn vị vận chuyển",
};

export enum PaymentType {
  CASH = "cash",
  BANK = "bank",
}

export enum DiscountTypeEnum {
  AMOUNT = "amount",
  PERCENT = "percent",
}

export enum PartnerDebtSideEnum {
  PAYABLE = "payable", // phải trả
  RECEIVABLE = "receivable", // phải thu
}
export const partnerDebtSideMap: Record<PartnerDebtSideEnum, string> = {
  [PartnerDebtSideEnum.PAYABLE]: "Phải trả",
  [PartnerDebtSideEnum.RECEIVABLE]: "Phải thu",
};

export enum DebtDirectionEnum {
  INCREASE = "increase", // tăng nợ
  DECREASE = "decrease", // giảm nợ
}

export enum DebtRefTypeEnum {
  PURCHASE = "purchase", // nhập hàng
  SALE = "sale", // bán hàng
  PURCHASE_RETURN = "purchase_return", // trả hàng nhà cung cấp
  SALE_RETURN = "sale_return", // trả hàng khách hàng

  INCOME = "income", // thu tiền
  EXPENSE = "expense", // chi tiền
  DEBT_OFFSET = "debt_offset", // đối trừ công nợ
  ADJUSTMENT = "adjustment", // điều chỉnh công nợ

  SHIPPING_FEE = "shipping_fee", // phí vận chuyển
}
export const debtRefTypeMap: Record<DebtRefTypeEnum, string> = {
  [DebtRefTypeEnum.PURCHASE]: "Nhập hàng",
  [DebtRefTypeEnum.SALE]: "Bán hàng",
  [DebtRefTypeEnum.PURCHASE_RETURN]: "Trả hàng nhà cung cấp",
  [DebtRefTypeEnum.SALE_RETURN]: "Trả hàng khách hàng",
  [DebtRefTypeEnum.INCOME]: "Thu tiền",
  [DebtRefTypeEnum.EXPENSE]: "Chi tiền",
  [DebtRefTypeEnum.DEBT_OFFSET]: "Đối trừ công nợ",
  [DebtRefTypeEnum.ADJUSTMENT]: "Điều chỉnh công nợ",
  [DebtRefTypeEnum.SHIPPING_FEE]: "Phí vận chuyển",
};
export enum OrderTypeEnum {
  PURCHASE = "purchase",
  SALE = "sale",
  PURCHASE_RETURN = "purchase_return",
  SALE_RETURN = "sale_return",
}
export const orderTypeMap: Record<OrderTypeEnum, string> = {
  [OrderTypeEnum.PURCHASE]: "Đơn nhập hàng",
  [OrderTypeEnum.SALE]: "Đơn bán hàng",
  [OrderTypeEnum.PURCHASE_RETURN]: "Đơn trả hàng NCC",
  [OrderTypeEnum.SALE_RETURN]: "Đơn KH trả hàng",
};

export enum LoyaltyPointTransactionTypeEnum {
  INCREASE = "increase", // Tăng điểm
  DECREASE = "decrease", // Giảm điểm
}

export enum LoyaltyPointRefTypeEnum {
  ORDER = "order", // Từ đơn hàng (SALE hoặc SALE_RETURN)
  ADJUSTMENT = "adjustment", // Điều chỉnh thủ công
}

export const loyaltyPointRefTypeMap: Record<LoyaltyPointRefTypeEnum, string> = {
  [LoyaltyPointRefTypeEnum.ORDER]: "Đơn hàng",
  [LoyaltyPointRefTypeEnum.ADJUSTMENT]: "Điều chỉnh",
};

export enum ShiftStatusEnum {
  ACTIVE = "active",
  CLOSED = "closed",
}

export const CASH_KEYS = [
  "500000",
  "200000",
  "100000",
  "50000",
  "20000",
  "10000",
  "5000",
  "2000",
  "1000",
] as const;

export const CHECKLIST_KEY = ["printer", "internet", "inventory", "handover"] as const;
export type ChecklistKey = (typeof CHECKLIST_KEY)[number];
export const checklistKeyMap: Record<ChecklistKey, string> = {
  printer: "Máy in hoạt động",
  internet: "Internet ổn định",
  inventory: "Kiểm tra nguyên liệu",
  handover: "Nhận bàn giao từ ca trước",
};

export enum StoreTransferStatusEnum {
  PENDING = "pending",
  EXPORTED = "exported",
  RECEIVED = "received",
  CANCELLED = "cancelled",
}
export const storeTransferStatusMap: Record<StoreTransferStatusEnum, string> = {
  [StoreTransferStatusEnum.PENDING]: "Chờ xuất kho",
  [StoreTransferStatusEnum.EXPORTED]: "Đã xuất kho",
  [StoreTransferStatusEnum.RECEIVED]: "Đã nhập kho",
  [StoreTransferStatusEnum.CANCELLED]: "Đã hủy",
};
