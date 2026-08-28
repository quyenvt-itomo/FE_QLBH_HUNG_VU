/**
 * Enum đồng bộ với BE: excel.types.ts
 */

import { ExportColumnConfig } from "./excel.model";

export enum ImportDuplicateHandling {
  STOP = "stop",
  SKIP = "skip",
  UPDATE = "update",
}

export enum ImportErrorHandling {
  STOP_ON_ERROR = "stop_on_error",
  SKIP_ERROR = "skip_error",
}

export enum ExcelEntityType {
  PARTNER = "partner",
  EMPLOYEE = "employee",
  USER = "user",
  PRODUCT = "product",
  SERVICE = "service",
  JOB_POSITION = "job_position",
  WAREHOUSE = "warehouse",
  PRICE_HISTORY = "price_history",
}

export enum ImportJobStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum ExportJobStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

/**
 * Entity hỗ trợ import - đồng bộ BE
 */
export const ENTITY_SUPPORTS_IMPORT: Record<ExcelEntityType, boolean> = {
  [ExcelEntityType.PARTNER]: true,
  [ExcelEntityType.EMPLOYEE]: false,
  [ExcelEntityType.USER]: false,
  [ExcelEntityType.PRODUCT]: true,
  [ExcelEntityType.SERVICE]: false,
  [ExcelEntityType.JOB_POSITION]: false,
  [ExcelEntityType.WAREHOUSE]: false,
  [ExcelEntityType.PRICE_HISTORY]: false,
};

/**
 * Cấu hình cột export mặc định cho từng entity (FE-side).
 */
export interface ColumnOption {
  field: string;
  header: string;
  width?: number;
  required?: boolean;
  type?: "string" | "number" | "boolean" | "date";
  options?: string[];
  numberFormat?: string;
  /** Nhóm cột vào sheet phụ (dành cho entity có nhiều sheet) */
  sheet?: string;
}

export const allColumnsExportOption: Record<ExcelEntityType, ColumnOption[]> = {
  [ExcelEntityType.PARTNER]: [
    { field: "type", header: "Loại đối tác (*)", width: 22, required: true, options: ["Khách hàng", "Nhà cung cấp", "Đơn vị vận chuyển"] },
    { field: "code", header: "Mã đối tác", width: 20 },
    { field: "name", header: "Tên đối tác (*)", width: 32, required: true },
    { field: "isOrganization", header: "Loại hình", width: 18, options: ["Cá nhân", "Tổ chức"] },
    { field: "groupName", header: "Nhóm đối tác", width: 24 },
    { field: "taxCode", header: "Mã số thuế", width: 20 },
    { field: "phone", header: "Số điện thoại", width: 20 },
    { field: "email", header: "Email", width: 30 },
    { field: "maxDebtAmount", header: "Hạn mức công nợ", width: 20, type: "number", numberFormat: "#,##0.00" },
    { field: "receivableDebtAmount", header: "Công nợ phải thu", width: 20, type: "number", numberFormat: "#,##0.00" },
    { field: "payableDebtAmount", header: "Công nợ phải trả", width: 20, type: "number", numberFormat: "#,##0.00" },
    { field: "representativeName", header: "Tên người đại diện", width: 26 },
    { field: "representativePosition", header: "Chức vụ người đại diện", width: 24 },
    { field: "representativePhone", header: "SĐT người đại diện", width: 20 },
    { field: "representativeEmail", header: "Email người đại diện", width: 28 },
    { field: "representativeIdentityCode", header: "CCCD người đại diện", width: 22 },
    { field: "note", header: "Ghi chú", width: 35 },
    { field: "partnerCode", header: "Mã đối tác (*)", width: 20, required: true, sheet: "Địa chỉ" },
    { field: "state", header: "Tỉnh/Thành phố", width: 24, sheet: "Địa chỉ" },
    { field: "ward", header: "Phường/Xã", width: 24, sheet: "Địa chỉ" },
    { field: "detail", header: "Địa chỉ chi tiết", width: 42, sheet: "Địa chỉ" },
    { field: "isPermanent", header: "Địa chỉ chính", width: 18, options: ["Có", "Không"], sheet: "Địa chỉ" },
    { field: "partnerCode", header: "Mã đối tác (*)", width: 20, required: true, sheet: "Người liên hệ" },
    { field: "name", header: "Tên người liên hệ (*)", width: 28, required: true, sheet: "Người liên hệ" },
    { field: "phone", header: "Số điện thoại", width: 20, sheet: "Người liên hệ" },
    { field: "email", header: "Email", width: 28, sheet: "Người liên hệ" },
    { field: "bankName", header: "Ngân hàng", width: 24, sheet: "Người liên hệ" },
    { field: "accountNumber", header: "Số tài khoản", width: 24, sheet: "Người liên hệ" },
    { field: "accountHolder", header: "Chủ tài khoản", width: 28, sheet: "Người liên hệ" },
    { field: "branch", header: "Chi nhánh", width: 24, sheet: "Người liên hệ" },
    { field: "partnerCode", header: "Mã đối tác (*)", width: 20, required: true, sheet: "Ngân hàng" },
    { field: "bankName", header: "Ngân hàng", width: 24, sheet: "Ngân hàng" },
    { field: "accountNumber", header: "Số tài khoản", width: 24, sheet: "Ngân hàng" },
    { field: "accountHolder", header: "Chủ tài khoản", width: 28, sheet: "Ngân hàng" },
    { field: "branch", header: "Chi nhánh", width: 24, sheet: "Ngân hàng" },
  ],
  [ExcelEntityType.EMPLOYEE]: [
    // THÔNG TIN CÁ NHÂN
    {
      field: "code",
      header: "Mã nhân viên (*)",
      width: 18,
      required: true,
      sheet: "THÔNG TIN CÁ NHÂN",
    },
    {
      field: "name",
      header: "Tên nhân viên (*)",
      width: 30,
      required: true,
      sheet: "THÔNG TIN CÁ NHÂN",
    },
    { field: "gender", header: "Giới tính", width: 12, sheet: "THÔNG TIN CÁ NHÂN" },
    { field: "dob", header: "Ngày sinh", width: 16, sheet: "THÔNG TIN CÁ NHÂN" },
    {
      field: "maritalStatus",
      header: "Tình trạng hôn nhân",
      width: 18,
      sheet: "THÔNG TIN CÁ NHÂN",
    },
    { field: "taxCode", header: "Mã số thuế cá nhân", width: 18, sheet: "THÔNG TIN CÁ NHÂN" },
    { field: "ethnicity", header: "Dân tộc", width: 15, sheet: "THÔNG TIN CÁ NHÂN" },
    { field: "religion", header: "Tôn giáo", width: 15, sheet: "THÔNG TIN CÁ NHÂN" },
    // THÔNG TIN ĐỊNH DANH
    { field: "identityType", header: "Loại giấy tờ", width: 14, sheet: "THÔNG TIN ĐỊNH DANH" },
    { field: "identityCode", header: "Số CCCD/CMND/HC", width: 18, sheet: "THÔNG TIN ĐỊNH DANH" },
    { field: "issuedDate", header: "Ngày cấp", width: 16, sheet: "THÔNG TIN ĐỊNH DANH" },
    { field: "issuedPlace", header: "Nơi cấp", width: 25, sheet: "THÔNG TIN ĐỊNH DANH" },
    { field: "expiredDate", header: "Ngày hết hạn", width: 16, sheet: "THÔNG TIN ĐỊNH DANH" },
    // THÔNG TIN LIÊN HỆ
    { field: "email", header: "Email", width: 28, sheet: "THÔNG TIN LIÊN HỆ" },
    { field: "phone", header: "SĐT", width: 18, sheet: "THÔNG TIN LIÊN HỆ" },
    // ĐỊA CHỈ
    { field: "permanentAddress", header: "Địa chỉ thường trú", width: 45, sheet: "ĐỊA CHỈ" },
    { field: "currentAddress", header: "Nơi ở hiện tại", width: 45, sheet: "ĐỊA CHỈ" },
    // LIÊN HỆ KHẨN CẤP
    { field: "emergencyName", header: "Họ tên", width: 25, sheet: "LIÊN HỆ KHẨN CẤP" },
    { field: "emergencyPhone", header: "SĐT", width: 18, sheet: "LIÊN HỆ KHẨN CẤP" },
    { field: "emergencyRelationship", header: "Quan hệ", width: 18, sheet: "LIÊN HỆ KHẨN CẤP" },
    // CÔNG VIỆC
    { field: "orgName", header: "Đơn vị công tác", width: 25, sheet: "CÔNG VIỆC" },
    { field: "jobPositionName", header: "Vị trí công việc", width: 22, sheet: "CÔNG VIỆC" },
    {
      field: "baseSalary",
      header: "Lương cơ bản",
      width: 18,
      type: "number",
      numberFormat: "#,##0",
      sheet: "CÔNG VIỆC",
    },
    { field: "workingStatus", header: "Tình trạng làm việc", width: 18, sheet: "CÔNG VIỆC" },
    { field: "employeeStatus", header: "Trạng thái NV", width: 18, sheet: "CÔNG VIỆC" },
    { field: "trialDate", header: "Ngày thử việc", width: 16, sheet: "CÔNG VIỆC" },
    { field: "officialDate", header: "Ngày chính thức", width: 16, sheet: "CÔNG VIỆC" },
    // NGÂN HÀNG
    { field: "bankName", header: "Ngân hàng", width: 22, sheet: "NGÂN HÀNG" },
    { field: "bankAccount", header: "Số tài khoản", width: 20, sheet: "NGÂN HÀNG" },
    // BẢO HIỂM
    { field: "insuranceNumber", header: "Số sổ BHXH", width: 18, sheet: "BẢO HIỂM" },
    { field: "insuranceStartDate", header: "Ngày bắt đầu", width: 16, sheet: "BẢO HIỂM" },
    {
      field: "insuranceRate",
      header: "Tỷ lệ đóng (%)",
      width: 16,
      type: "number",
      numberFormat: "#,##0",
      sheet: "BẢO HIỂM",
    },
    // GHI CHÚ
    { field: "note", header: "Ghi chú", width: 40, sheet: "GHI CHÚ" },
  ],
  [ExcelEntityType.USER]: [
    { field: "code", header: "Mã người dùng (*)", width: 18, required: true },
    { field: "name", header: "Tên người dùng (*)", width: 30, required: true },
    { field: "username", header: "Tên đăng nhập (*)", width: 20, required: true },
    { field: "email", header: "Email", width: 25 },
    { field: "phone", header: "SĐT", width: 18 },
    { field: "isActive", header: "Kích hoạt", width: 14 },
    { field: "note", header: "Ghi chú", width: 30 },
  ],
  [ExcelEntityType.PRODUCT]: [
    { field: "code", header: "Mã hàng hóa (*)", width: 20, required: true },
    { field: "name", header: "Tên hàng hóa (*)", width: 30, required: true },
    { field: "type", header: "Loại (*)", width: 20, required: true },
    { field: "groupName", header: "Nhóm hàng hóa", width: 20 },
    { field: "baseUnitName", header: "Đơn vị tính", width: 18 },
    { field: "price", header: "Giá", width: 18, type: "number", numberFormat: "#,##0" },
    { field: "taxRate", header: "%VAT", width: 12, type: "number", numberFormat: "#,##0" },
    { field: "isPublic", header: "Công khai", width: 12 },
    { field: "note", header: "Ghi chú", width: 30 },
    // Sheet phụ: Đơn vị tính phụ
    {
      field: "productCode",
      header: "Mã hàng hóa (*)",
      width: 20,
      required: true,
      sheet: "Đơn vị tính phụ",
    },
    {
      field: "unitName",
      header: "Tên đơn vị tính (*)",
      width: 20,
      required: true,
      sheet: "Đơn vị tính phụ",
    },
    {
      field: "conversionRate",
      header: "Tỷ lệ quy đổi (*)",
      width: 18,
      type: "number",
      numberFormat: "#,##0.00",
      required: true,
      sheet: "Đơn vị tính phụ",
    },
    {
      field: "pricePerUnit",
      header: "Giá",
      width: 18,
      type: "number",
      numberFormat: "#,##0",
      sheet: "Đơn vị tính phụ",
    },
  ],
  [ExcelEntityType.SERVICE]: [
    { field: "code", header: "Mã dịch vụ (*)", width: 20, required: true },
    { field: "name", header: "Tên dịch vụ (*)", width: 30, required: true },
    { field: "type", header: "Loại (*)", width: 18, required: true },
    { field: "taxRate", header: "%VAT", width: 12, type: "number", numberFormat: "#,##0" },
    { field: "note", header: "Ghi chú", width: 30 },
    {
      field: "serviceCode",
      header: "Mã dịch vụ (*)",
      width: 20,
      required: true,
      sheet: "Đơn giá & ĐVT",
    },
    {
      field: "unitName",
      header: "Đơn vị tính (*)",
      width: 20,
      required: true,
      sheet: "Đơn giá & ĐVT",
    },
    {
      field: "costPrice",
      header: "Giá đầu vào",
      width: 18,
      type: "number",
      numberFormat: "#,##0",
      sheet: "Đơn giá & ĐVT",
    },
    {
      field: "unitPrice",
      header: "Giá đầu ra",
      width: 18,
      type: "number",
      numberFormat: "#,##0",
      sheet: "Đơn giá & ĐVT",
    },
  ],
  [ExcelEntityType.JOB_POSITION]: [
    { field: "name", header: "Tên vị trí (*)", width: 30, required: true },
    { field: "level", header: "Cấp bậc", width: 20 },
    { field: "jobTitleName", header: "Chức danh", width: 25 },
    { field: "note", header: "Ghi chú", width: 30 },
  ],
  [ExcelEntityType.WAREHOUSE]: [
    { field: "code", header: "Mã kho (*)", width: 18, required: true },
    { field: "name", header: "Tên kho (*)", width: 30, required: true },
    { field: "phone", header: "SĐT", width: 18 },
    { field: "address", header: "Địa chỉ", width: 40 },
    { field: "managerCode", header: "Mã người quản lý", width: 20 },
    { field: "note", header: "Ghi chú", width: 30 },
  ],
  [ExcelEntityType.PRICE_HISTORY]: [
    { field: "productCode", header: "Mã hàng hóa", width: 20 },
    { field: "productName", header: "Tên hàng hóa", width: 30 },
    { field: "unitName", header: "Đơn vị tính", width: 18 },
    { field: "pricePerUnit", header: "Giá", width: 18, type: "number", numberFormat: "#,##0" },
    { field: "createdAt", header: "Ngày cập nhật", width: 20, type: "date" },
  ],
};

/** Cột cho sheet "Đơn vị tính phụ" khi export/import Product */
export const EXTRA_UNIT_COLUMNS: ExportColumnConfig[] = [
  { field: "productCode", header: "Mã hàng hóa (*)", width: 20, required: true },
  { field: "unitName", header: "Tên đơn vị tính (*)", width: 20, required: true },
  {
    field: "conversionRate",
    header: "Tỷ lệ quy đổi (*)",
    width: 18,
    type: "number",
    required: true,
  },
  {
    field: "pricePerUnit",
    header: "Giá",
    width: 18,
    type: "number",
  },
];

// Cấu hình Product dùng đúng tên field của backend hiện tại.
allColumnsExportOption[ExcelEntityType.PRODUCT] = [
  { field: "code", header: "Mã hàng hóa (*)", width: 20, required: true },
  { field: "name", header: "Tên hàng hóa (*)", width: 30, required: true },
  { field: "barcode", header: "Mã vạch", width: 20 },
  { field: "groupName", header: "Nhóm hàng hóa", width: 22 },
  { field: "brandName", header: "Thương hiệu", width: 22 },
  { field: "baseUnitName", header: "Đơn vị tính", width: 18 },
  {
    field: "salePrice",
    header: "Giá bán",
    width: 18,
    type: "number",
    numberFormat: "#,##0",
  },
  {
    field: "weight",
    header: "Trọng lượng",
    width: 16,
    type: "number",
    numberFormat: "#,##0.00",
  },
  { field: "weightUnit", header: "ĐVT trọng lượng", width: 18, options: ["g", "kg"] },
  { field: "description", header: "Mô tả", width: 35 },
  { field: "note", header: "Ghi chú", width: 30 },
  {
    field: "productCode",
    header: "Mã hàng hóa (*)",
    width: 20,
    required: true,
    sheet: "Đơn vị tính phụ",
  },
  {
    field: "unitName",
    header: "Tên đơn vị tính (*)",
    width: 22,
    required: true,
    sheet: "Đơn vị tính phụ",
  },
  {
    field: "conversionRate",
    header: "Tỷ lệ quy đổi (*)",
    width: 18,
    type: "number",
    numberFormat: "#,##0.0000",
    required: true,
    sheet: "Đơn vị tính phụ",
  },
  {
    field: "salePrice",
    header: "Giá bán theo ĐVT",
    width: 20,
    type: "number",
    numberFormat: "#,##0",
    sheet: "Đơn vị tính phụ",
  },
  {
    field: "isPurchaseUnit",
    header: "ĐVT nhập hàng mặc định",
    width: 25,
    options: ["Có", "Không"],
    sheet: "Đơn vị tính phụ",
  },
  {
    field: "productCode",
    header: "Mã hàng hóa (*)",
    width: 20,
    required: true,
    sheet: "Cửa hàng kinh doanh",
  },
  {
    field: "storeCode",
    header: "Mã cửa hàng (*)",
    width: 20,
    required: true,
    sheet: "Cửa hàng kinh doanh",
  },
  {
    field: "storeName",
    header: "Tên cửa hàng",
    width: 30,
    sheet: "Cửa hàng kinh doanh",
  },
  {
    field: "costPrice",
    header: "Giá vốn",
    width: 18,
    type: "number",
    numberFormat: "#,##0",
    sheet: "Cửa hàng kinh doanh",
  },
  {
    field: "isSelling",
    header: "Đang kinh doanh",
    width: 20,
    options: ["Có", "Không"],
    sheet: "Cửa hàng kinh doanh",
  },
];
