import { AdditionalInfo } from "../interfaces/common";

export const APP_NAME = import.meta.env.VITE_APP_NAME || "iTomo Soft";
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

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}
export const genderMap: Record<Gender, string> = {
  [Gender.MALE]: "Nam",
  [Gender.FEMALE]: "Nữ",
  [Gender.OTHER]: "Khác",
};
export const genderOptions = Object.values(Gender).map((gender) => ({
  label: genderMap[gender],
  value: gender,
}));

export enum CommissionMode {
  PRICE = "PRICE", // Tính hoa hồng dựa trên giá bán
  QUANTITY = "QUANTITY", // Tính hoa hồng dựa trên số lượng
}
export const commissionModeMap: Record<CommissionMode, string> = {
  [CommissionMode.PRICE]: "Theo giá",
  [CommissionMode.QUANTITY]: "Theo lượng",
};
export const commissionModeOptions = getOptionsByMap(commissionModeMap);
export enum SaleLineType {
  PRODUCT = "product",
  SERVICE = "service",
}

export enum FileCategory {
  AVATAR = "avatar",
  RECEIPT = "receipt",
  ATTACHMENT = "attachment",
  DOCUMENT = "document",
  LOGO = "logo",
  IMAGE = "image",
  VIDEO = "video",
  ALBUM = "album",
  MEDIA = "media",
  EDUCATION_DOC = "educationDoc", // Tài liệu học vấn, bằng cấp
}

export enum NotificationType {
  SYSTEM = "system",
  USER = "user",
  ORDER = "order",
  ORDER_LINE = "order_line",
  PRODUCTION = "production",
  // Approval modules
  QUOTATION_REQUEST = "quotationRequest",
  QUOTATION = "quotation",
  PURCHASE_REQUISITION = "purchaseRequisition",
  PURCHASE_QUOTATION = "purchaseQuotation",
  PURCHASE = "purchase",
  SHIPPING_PLAN = "shippingPlan",
  PAYMENT_REQUEST = "paymentRequest",
}

export enum ActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  PENDING = "PENDING",
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  FAILED = "FAILED",
  UNFIXED = "UNFIXED",
  DAILY_WARNING = "DAILY_WARNING",
  REPLY = "REPLY",
  NOTIFICATION = "NOTIFICATION",
  REMINDER = "REMINDER",
  ASSIGN = "ASSIGN",
  COMPLETE = "COMPLETE",
  CANCEL = "CANCEL",
}

export enum MaritalStatusEnum {
  SINGLE = "SINGLE", // Độc thân
  MARRIED = "MARRIED", // Đã kết hôn
  DIVORCED = "DIVORCED", // Đã ly hôn
}
export const maritalStatusMap: Record<MaritalStatusEnum, string> = {
  [MaritalStatusEnum.SINGLE]: "Độc thân",
  [MaritalStatusEnum.MARRIED]: "Đã kết hôn",
  [MaritalStatusEnum.DIVORCED]: "Đã ly hôn",
};
export const maritalStatusOptions = Object.values(MaritalStatusEnum).map((status) => ({
  label: maritalStatusMap[status],
  value: status,
}));

export enum IdentificationType {
  CCCD = "CCCD", // Căn cước công dân
  CMND = "CMND", // Chứng minh nhân dân
  HC = "HC", // Hộ chiếu
}

export enum ExcelEntityType {
  PRODUCT = "product",
  PARTNER = "partner",
  EMPLOYEE = "employee",
  CUSTOMER = "customer",
  SALE_ORDER = "sale_order",
  INVENTORY_ADJUSTMENT = "inventory_adjustment",
  INVENTORY_REPORT = "inventory_report",
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

export enum FileType {
  IMAGE = "image",
  VIDEO = "video",
  DOCUMENT = "document",
  AUDIO = "audio",
  OTHER = "other",
}

export enum EntityType {
  AUTH = "auth",
  USER = "user",
  NOTIFICATION = "notification",
  ROLE = "role",
  ITEM = "item",
  SUPPLIER = "supplier",
  CUSTOMER = "customer",
  ATTRIBUTE = "attribute",
  ORDER = "order",
  WAREHOUSE = "warehouse",
  STORE = "store",
  FUND = "fund",
  EMPLOYEE = "employee",
  EMPLOYEE_CONTRACT = "employeeContract",
  EXCEL_IMPORT = "excelImport",
  ORGANIZATION = "organization",
}

export enum FileStatus {
  PENDING = "pending",
  ACTIVE = "active",
  ARCHIVED = "archived",
}

export enum OrderStatusEnum {
  PENDING = "pending", // moi tao
  IN_PROGRESS = "in_progress", // da goi mon (cho bep), da thanh toan 1 phan
  SERVED = "served", // da phuc vu xong, chua thanh toan
  COMPLETED = "completed", // da thanh toan het, da phuc vu xong
  CANCELED = "canceled", // da huy
}

export enum PurchaseStatusEnum {
  PENDING = "pending", // moi tao
  PARTIAL = "partial", // da nhap 1 phan
  COMPLETED = "completed", // da nhap het
  CANCELED = "canceled", // da huy
}

export enum TransactionType {
  IN = "in",
  OUT = "out",
}

export enum ReferenceTypeEnum {
  IN = "IN", // phieu nhap
  OUT = "OUT", // phieu xuat
  ADJUSTMENT = "ADJUSTMENT", // phieu dieu chinh
  TRANSFER = "TRANSFER", // phieu chuyen kho
}

export enum InventoryTypeEnum {
  IN = "IN",
  OUT = "OUT",
}

export enum DiscountTypeEnum {
  AMOUNT = "amount",
  PERCENT = "percent",
}

export enum FundTypeEnum {
  CASH = "cash",
  BANK = "bank",
}
export const DEFAULT_FUND_CASH_TYPE_NAME = "QUỸ TIỀN MẶT CỬA HÀNG";
export enum IncomeExpenseTypeEnum {
  INCOME = "income", // Thu
  EXPENSE = "expense", // Chi
}

export enum FundTransactionRefTypeEnum {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
  ADJUSTMENT = "adjustment",
  ORDER = "order",
}

// TODO: Debt
export enum DebtSideEnum {
  RECEIVABLE = "receivable",
  PAYABLE = "payable",
}
export const debtSideMap: Record<DebtSideEnum, string> = {
  [DebtSideEnum.RECEIVABLE]: "Nợ phải thu",
  [DebtSideEnum.PAYABLE]: "Nợ phải trả",
};
export const debtSideOptions = getOptionsByMap(debtSideMap);

export enum DebtDirectionEnum {
  INCREASE = "increase",
  DECREASE = "decrease",
}

export enum DebtRefTypeEnum {
  ORDER = "order", // SALE -> RECEIVABLE
  PURCHASE = "purchase", // -> PAYABLE
  INCOME = "income", // thu tiền KH -> giảm RECEIVABLE
  EXPENSE = "expense", // chi trả NCC -> giảm PAYABLE
  ADJUSTMENT = "adjustment", // điều chỉnh đầu/cuối kỳ
  DEBT_OFFSET = "debt_offset", // đối trừ payable <-> receivable
}

// ── Helpers ──

/**
 * Chuyển map Record<Enum, string> thành mảng options { value, label }
 */
export function getOptionsByMap<T extends string>(
  map: Partial<Record<T, string>>,
): { value: T; label: string; key: T }[] {
  const result: { value: T; label: string; key: T }[] = [];

  (Object.keys(map) as T[]).forEach((key) => {
    const label = map[key];
    if (label) {
      result.push({
        value: key,
        label: label,
        key: key,
      });
    }
  });

  return result;
}

export const defaultAdditionalInfo: AdditionalInfo[] = [
  {
    label: "Chất lượng hàng",
  },
  {
    label: "Địa điểm giao hàng",
  },
  {
    label: "Phương thức giao hàng",
  },
  {
    label: "Thời gian giao hàng",
  },
  {
    label: "Thanh toán",
  },
  {
    label: "Thời hạn báo giá",
  },
  {
    label: "Lời nhắn",
    value: "Rất mong nhận được sự hợp tác với quý công ty",
  },
];
