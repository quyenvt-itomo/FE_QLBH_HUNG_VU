import {
  ExcelEntityType,
  FileTypeEnum,
  ImportErrorHandling,
  ImportDuplicateHandling,
} from "../../constants/enum";
import { ApiRequestQuery, ApiResponse } from "./api";

// Column configuration for export
export interface ExportColumnConfig {
  field: string; // Field name trong entity
  header: string; // Tên hiển thị trong Excel
  width?: number; // Độ rộng cột
  format?: string; // Format cho cell (date, number, etc.)
  required?: boolean; // Bắt buộc khi import
  hidden?: boolean; // Ẩn cột khi export
  sheet?: string; // Tên sheet (cho export nhiều sheet)
}

// Export options
export interface ExportOptions {
  entityType: ExcelEntityType;
  columns: ExportColumnConfig[]; // Các cột cần export
  filters?: Record<string, any>; // Filters để lọc data
  filename?: string; // Tên file
  includeStock?: boolean;
}

export interface ExportExcelResult {
  url: string;
  filename: string;
  expiresAt?: Date; // Thời gian hết hạn (cho temp files)
}

export interface ExportExcelQuery extends Omit<ApiRequestQuery, "page" | "size" | "keyword"> {
  entityType: ExcelEntityType;
  id?: number;
  fileType?: FileTypeEnum;
}

// Template query
export interface ExcelTemplateQuery {
  entityType: ExcelEntityType;
  storeId?: string; // Cho các template cần context (điều chỉnh kho, etc.)
  filters?: Record<string, any>; // Các filters khác
}

// Import options
export interface ImportOptions {
  entityType: ExcelEntityType;
  fileId: string; // ID của file đã upload
  errorHandling: ImportErrorHandling;
  duplicateHandling: ImportDuplicateHandling;
  uniqueFields?: string[]; // Các field dùng để check duplicate (mặc định: code)
}

export interface ImportExcelData {
  entityType: ExcelEntityType;
  fileId: string; // Thay đổi từ fileUrl sang fileId
  errorHandling: ImportErrorHandling;
  duplicateHandling: ImportDuplicateHandling;
  uniqueFields?: string[];
}

// Import error
export interface ImportError {
  row: number;
  field?: string;
  message: string;
  value?: any;
}

// Import result
export interface ImportExcelResult {
  totalRows: number;
  successRows: number;
  errorRows: number;
  skippedRows: number;
  errors: ImportError[];
  data?: any[]; // Dữ liệu đã import thành công
  errorFileUrl?: string; // URL file lỗi (nếu có)
}

export interface Import extends ApiResponse {
  data: ImportExcelResult;
}

// Job-based import response
export interface ImportJobResponse extends ApiResponse {
  data: {
    jobId: string;
  };
}

// Import job status
export enum ImportJobStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

// Layer progress (cho SSE chi tiết)
export interface ImportLayerProgress {
  label: string; // "Validation", "Import", "Recalculation"
  progress: number; // 0-100
  status: "pending" | "processing" | "completed" | "failed";
}

// Import progress data (from socket)
export interface ImportProgressData {
  jobId: string;
  status: ImportJobStatus;
  progress: number; // 0-100 (tổng thể)
  totalRows?: number;
  processedRows?: number;
  successRows?: number;
  errorRows?: number;
  skippedRows?: number;
  errors?: ImportError[]; // 10 lỗi gần nhất
  errorFileUrl?: string; // URL file lỗi đầy đủ khi completed
  layers?: ImportLayerProgress[]; // Chi tiết tiến độ từng layer
  startedAt?: Date;
  completedAt?: Date;
}

// Template result
export interface ExcelTemplateData {
  url: string;
  filename: string;
  expiresAt?: Date; // Thời gian hết hạn (cho temp files)
}

export interface ExcelResponse extends ApiResponse {
  data: ExcelTemplateData | string;
}

export enum CustomerKey {
  // String keys
  TYPE = "type", // Cá nhân hoặc tổ chức
  CODE = "code",
  NAME = "name",
  PHONE = "phone",
  EMAIL = "email",
  ADDRESS = "address", // Địa chỉ Tỉnh/Thành phố - Phường/Xã
  DETAIL_ADDRESS = "detailAddress", // Địa chỉ chi tiết
  TAX_CODE = "taxCode",
  GROUP = "group", // Nhóm khách hàng (nếu có)
  NOTE = "note",
  // Number keys
  CURRENT_REVENUE = "currentRevenue", // Doanh số tích lũy hiện có
  CURRENT_LOYALTY_POINTS = "currentLoyaltyPoints", // Điểm tích lũy hiện có
  RECEIVABLE_AMOUNT = "receivableAmount", // Số tiền đang nợ (nếu có)
}

/**
 * Enum cho các trường của Order (cột bên trái)
 */
export enum OrderKey {
  CODE = "code", // Mã đơn hàng
  PARTNER_CODE = "partnerCode", // Mã khách hàng
  PARTNER_NAME = "partnerName", // Tên khách hàng (optional, có thể dùng để tạo mới)
  PARTNER_PHONE = "partnerPhone", // SĐT khách hàng (optional)
  EMPLOYEE_CODE = "employeeCode", // Mã nhân viên
  EMPLOYEE_NAME = "employeeName", // Tên nhân viên
  ORDER_AT = "orderAt", // Ngày thực hiện đơn

  // Discount (order-level)
  DISCOUNT_TYPE = "discountType", // Số tiền | %
  DISCOUNT_VALUE = "discountValue", // % hoặc số tiền

  // Shipping
  SHIPPING_PROVIDER_CODE = "shipperCode", // Mã nhà vận chuyển
  SHIPPING_FEE = "shippingFee", // Phí vận chuyển
  IS_FREE_SHIPPING = "isFreeShipping", // Miễn phí vận chuyển

  // Loyalty points
  LOYALTY_POINTS_USED = "loyaltyPointsUsed", // Điểm khách dùng

  // Calculated fields (order-level)
  GROSS_AMOUNT = "grossAmount", // Tổng tiền hàng
  LINE_DISCOUNT_AMOUNT = "lineDiscountAmount", // Giảm giá sản phẩm
  ORDER_DISCOUNT_AMOUNT = "orderDiscountAmount", // Giảm giá đơn hàng
  NET_AMOUNT = "netAmount", // Tổng sau giảm giá
  TAX_AMOUNT = "taxAmount", // Tiền VAT
  TOTAL_AMOUNT = "totalAmount", // Tổng đơn hàng
}

/**
 * Enum cho các trường của OrderLine (cột bên phải)
 */
export enum OrderLineKey {
  PRODUCT_VARIANT_CODE = "productVariantCode", // Mã sản phẩm/SKU
  PRODUCT_VARIANT_NAME = "productVariantName", // Tên sản phẩm
  SPECIFICATION = "specification", // Quy cách (Size: M - Màu: Đỏ)
  UNIT_PRICE = "unitPrice", // Đơn giá
  QUANTITY = "quantity", // Số lượng

  // Discount (line-level)
  LINE_DISCOUNT_TYPE = "lineDiscountType", // Số tiền | %
  LINE_DISCOUNT_VALUE = "lineDiscountValue", // Giá trị giảm

  // Tax
  TAX_RATE = "taxRate", // % thuế (0, 8, 10)

  // Calculated fields (line-level)
  SUB_TOTAL = "subTotal", // Thành tiền (giá × số lượng)
  DISCOUNT_AMOUNT = "lineDiscAmount", // Giảm giá dòng (đã tính)
  ORDER_DISCOUNT_AMOUNT = "lineOrdDiscAmount", // Giảm giá ĐH phân bổ
  NET_AMOUNT = "lineNetAmount", // Thành tiền sau giảm
  TAX_AMOUNT = "lineTaxAmount", // Tiền VAT dòng
  TOTAL_AMOUNT = "lineTotalAmount", // Tổng tiền dòng
}

enum IncomeExpenseKey {
  OCCURRED_AT = "occurredAt",
  CODE = "code",
  TYPE = "type",
  DESCRIPTION = "description",
  AMOUNT = "amount",
  FUND_NAME = "fundName",
  CATEGORY_NAME = "categoryName",
  PARTNER_NAME = "partnerName",
  CREATOR_NAME = "creatorName",
  STORE_NAME = "storeName",
}

export const allColumnsExportOption: Record<ExcelEntityType, ExportColumnConfig[]> = {
  [ExcelEntityType.PRODUCT]: [
    { header: "Mã hàng hóa", field: "code", width: 20 },
    { header: "Tên sản phẩm", field: "name", width: 30 },
    { header: "Danh mục", field: "categoryName", width: 25 },
    { header: "ĐVT", field: "unitName", width: 20 },
    { header: "Mã vạch", field: "barcode", width: 20 },
    { header: "%VAT", field: "taxRate", width: 12 },
    { header: "Giá vốn", field: "costPrice", width: 15 },
    { header: "Giá bán", field: "price", width: 15 },
    { header: "Tồn kho", field: "stockQty", width: 15 },
    { header: "Giá trị tồn", field: "stockValue", width: 18 },
    { header: "Mô tả", field: "description", width: 50 },
  ],
  [ExcelEntityType.PARTNER]: [],
  [ExcelEntityType.EMPLOYEE]: [],
  [ExcelEntityType.CUSTOMER]: [
    {
      field: CustomerKey.TYPE,
      header: "Loại khách hàng",
      width: 20,
    },
    {
      field: CustomerKey.CODE,
      header: "Mã khách hàng",
      width: 20,
    },
    {
      field: CustomerKey.NAME,
      header: "Tên khách hàng",
      width: 30,
      required: true,
    },
    {
      field: CustomerKey.PHONE,
      header: "Số điện thoại",
      width: 20,
    },
    {
      field: CustomerKey.EMAIL,
      header: "Email",
      width: 30,
    },
    {
      field: CustomerKey.ADDRESS,
      header: "Địa chỉ",
      width: 50,
    },
    {
      field: CustomerKey.DETAIL_ADDRESS,
      header: "Địa chỉ chi tiết",
      width: 50,
    },
    {
      field: CustomerKey.TAX_CODE,
      header: "Mã số thuế",
      width: 20,
    },
    {
      field: CustomerKey.GROUP,
      header: "Nhóm khách hàng",
      width: 20,
    },
    {
      field: CustomerKey.NOTE,
      header: "Ghi chú",
      width: 30,
    },
    {
      field: CustomerKey.CURRENT_REVENUE,
      header: "Doanh số hiện tại",
      width: 25,
    },
    {
      field: CustomerKey.CURRENT_LOYALTY_POINTS,
      header: "Điểm tích lũy",
      width: 25,
    },
    {
      field: CustomerKey.RECEIVABLE_AMOUNT,
      header: "Số tiền đang nợ",
      width: 25,
    },
  ],
  [ExcelEntityType.SALE_ORDER]: [
    // ===== ORDER INFO (LEFT) =====
    {
      field: OrderKey.CODE,
      header: "Mã đơn hàng",
      width: 20,
      required: true,
    },
    {
      field: OrderKey.PARTNER_CODE,
      header: "Mã khách hàng",
      width: 20,
      required: true,
    },
    {
      field: OrderKey.PARTNER_NAME,
      header: "Tên khách hàng",
      width: 25,
    },
    {
      field: OrderKey.PARTNER_PHONE,
      header: "SĐT",
      width: 15,
    },
    {
      field: OrderKey.EMPLOYEE_CODE,
      header: "Mã nhân viên",
      width: 15,
    },
    {
      field: OrderKey.EMPLOYEE_NAME,
      header: "Tên nhân viên",
      width: 25,
    },
    {
      field: OrderKey.ORDER_AT,
      header: "Ngày đơn hàng",
      width: 20,
    },
    {
      field: OrderKey.DISCOUNT_TYPE,
      header: "Loại giảm giá ĐH",
      width: 18,
    },
    {
      field: OrderKey.DISCOUNT_VALUE,
      header: "Giá trị giảm ĐH",
      width: 18,
    },
    {
      field: OrderKey.SHIPPING_PROVIDER_CODE,
      header: "Mã ĐVVC",
      width: 15,
    },
    {
      field: OrderKey.SHIPPING_FEE,
      header: "Phí vận chuyển",
      width: 15,
    },
    {
      field: OrderKey.IS_FREE_SHIPPING,
      header: "Miễn phí VC",
      width: 12,
    },
    {
      field: OrderKey.LOYALTY_POINTS_USED,
      header: "Điểm sử dụng",
      width: 15,
    },
    {
      field: OrderKey.GROSS_AMOUNT,
      header: "Tổng tiền hàng",
      width: 18,
    },
    {
      field: OrderKey.LINE_DISCOUNT_AMOUNT,
      header: "Giảm giá SP",
      width: 18,
    },
    {
      field: OrderKey.ORDER_DISCOUNT_AMOUNT,
      header: "Giảm giá ĐH",
      width: 18,
    },
    {
      field: OrderKey.NET_AMOUNT,
      header: "Tổng sau giảm",
      width: 18,
    },
    {
      field: OrderKey.TAX_AMOUNT,
      header: "Tiền VAT",
      width: 18,
    },
    {
      field: OrderKey.TOTAL_AMOUNT,
      header: "Tổng đơn hàng",
      width: 18,
    },

    // ===== ORDER LINE INFO (RIGHT) =====
    {
      field: OrderLineKey.PRODUCT_VARIANT_CODE,
      header: "Mã sản phẩm/SKU",
      width: 20,
      required: true,
    },
    {
      field: OrderLineKey.PRODUCT_VARIANT_NAME,
      header: "Tên sản phẩm",
      width: 30,
    },
    {
      field: OrderLineKey.SPECIFICATION,
      header: "Quy cách",
      width: 20,
    },
    {
      field: OrderLineKey.UNIT_PRICE,
      header: "Đơn giá",
      width: 15,
      required: true,
    },
    {
      field: OrderLineKey.QUANTITY,
      header: "Số lượng",
      width: 12,
      required: true,
    },
    {
      field: OrderLineKey.LINE_DISCOUNT_TYPE,
      header: "Loại giảm giá dòng",
      width: 18,
    },
    {
      field: OrderLineKey.LINE_DISCOUNT_VALUE,
      header: "Giá trị giảm dòng",
      width: 18,
    },
    {
      field: OrderLineKey.TAX_RATE,
      header: "%VAT",
      width: 10,
    },
    {
      field: OrderLineKey.SUB_TOTAL,
      header: "Thành tiền dòng",
      width: 18,
    },
    {
      field: OrderLineKey.DISCOUNT_AMOUNT,
      header: "Giảm giá dòng",
      width: 18,
    },
    {
      field: OrderLineKey.ORDER_DISCOUNT_AMOUNT,
      header: "Giảm giá ĐH (phân bổ)",
      width: 20,
    },
    {
      field: OrderLineKey.NET_AMOUNT,
      header: "Sau giảm dòng",
      width: 18,
    },
    {
      field: OrderLineKey.TAX_AMOUNT,
      header: "VAT dòng",
      width: 15,
    },
    {
      field: OrderLineKey.TOTAL_AMOUNT,
      header: "Tổng tiền dòng",
      width: 18,
    },
  ],
  [ExcelEntityType.INVENTORY_ADJUSTMENT]: [
    // ===== ADJUSTMENT INFO =====
    { field: "code", header: "Mã phiếu", width: 20 },
    { field: "storeName", header: "Kho", width: 25 },
    { field: "occurredAt", header: "Ngày điều chỉnh", width: 20 },
    { field: "reason", header: "Lý do", width: 30 },
    { field: "totalAdjustmentQty", header: "Tổng SL điều chỉnh", width: 18 },
    { field: "totalAdjustmentValue", header: "Tổng GT điều chỉnh", width: 18 },
    { field: "isInitial", header: "Tồn đầu kỳ", width: 12 },
    { field: "staffName", header: "Nhân viên", width: 25 },
    // ===== ADJUSTMENT LINE INFO =====
    { field: "productVariantCode", header: "Mã sản phẩm/SKU", width: 20 },
    { field: "productVariantName", header: "Tên sản phẩm", width: 30 },
    { field: "specification", header: "Quy cách", width: 25 },
    { field: "systemQty", header: "SL hệ thống", width: 15 },
    { field: "actualQty", header: "SL thực tế", width: 15 },
    { field: "adjustmentQty", header: "SL điều chỉnh", width: 15 },
    { field: "costPrice", header: "Giá vốn", width: 15 },
    { field: "adjustmentValue", header: "GT điều chỉnh", width: 18 },
  ],
  [ExcelEntityType.INVENTORY_REPORT]: [
    { field: "code", header: "Mã hàng", width: 15 },
    { field: "name", header: "Tên hàng hóa", width: 30 },
    { field: "categoryName", header: "Danh mục", width: 20 },
    { field: "unitName", header: "ĐVT", width: 12 },
    { field: "openingQty", header: "Tồn đầu kỳ - Số lượng", width: 18 },
    { field: "openingAmount", header: "Tồn đầu kỳ - Giá trị", width: 18 },
    { field: "increaseQty", header: "Nhập trong kỳ - Số lượng", width: 18 },
    { field: "increaseAmount", header: "Nhập trong kỳ - Giá trị", width: 18 },
    { field: "decreaseQty", header: "Xuất trong kỳ - Số lượng", width: 18 },
    { field: "decreaseAmount", header: "Xuất trong kỳ - Giá trị", width: 18 },
    { field: "closingQty", header: "Tồn cuối kỳ - Số lượng", width: 18 },
    { field: "closingAmount", header: "Tồn cuối kỳ - Giá trị", width: 18 },
  ],
  // Dashboard export: bao gồm 2 sheet (Bán hàng + Lợi nhuận), cột được nhóm theo sheet
  [ExcelEntityType.DASHBOARD]: [
    // Sheet Bán hàng
    { field: "date", header: "Ngày", width: 15, sheet: "Bán hàng" },
    { field: "orderCount", header: "Số đơn", width: 12, sheet: "Bán hàng" },
    { field: "grossAmount", header: "Tiền hàng", width: 18, sheet: "Bán hàng" },
    { field: "lineDiscount", header: "Giảm giá hàng", width: 18, sheet: "Bán hàng" },
    { field: "orderDiscount", header: "Giảm giá đơn", width: 18, sheet: "Bán hàng" },
    { field: "netAmount", header: "Doanh thu thuần", width: 18, sheet: "Bán hàng" },
    { field: "shippingFee", header: "Phí giao hàng", width: 16, sheet: "Bán hàng" },
    { field: "taxAmount", header: "Tiền thuế", width: 16, sheet: "Bán hàng" },
    { field: "totalAmount", header: "Tổng doanh thu", width: 18, sheet: "Bán hàng" },
    { field: "grossProfit", header: "Lợi nhuận gộp", width: 18, sheet: "Bán hàng" },
    { field: "grossProfitMargin", header: "Tỷ suất LN gộp", width: 16, sheet: "Bán hàng" },
    // Sheet Lợi nhuận
    { field: "salesRevenue", header: "Doanh thu bán hàng", width: 22, sheet: "Lợi nhuận" },
    { field: "cogs", header: "Giá vốn hàng bán", width: 20, sheet: "Lợi nhuận" },
    { field: "shippingExpense", header: "Phí vận chuyển", width: 18, sheet: "Lợi nhuận" },
    { field: "otherIncome", header: "Doanh thu khác", width: 18, sheet: "Lợi nhuận" },
    { field: "totalRevenue", header: "Tổng doanh thu", width: 18, sheet: "Lợi nhuận" },
    { field: "otherExpense", header: "Chi phí", width: 18, sheet: "Lợi nhuận" },
    { field: "inventoryAdjustment", header: "ĐC tồn kho", width: 16, sheet: "Lợi nhuận" },
    { field: "partnerDebtAdjustment", header: "ĐC công nợ", width: 16, sheet: "Lợi nhuận" },
    { field: "fundAdjustment", header: "ĐC số dư quỹ", width: 16, sheet: "Lợi nhuận" },
    { field: "totalAdjustments", header: "Tổng điều chỉnh", width: 18, sheet: "Lợi nhuận" },
    { field: "netProfit", header: "Lợi nhuận ròng", width: 18, sheet: "Lợi nhuận" },
    { field: "netProfitMargin", header: "Tỷ suất LN ròng", width: 16, sheet: "Lợi nhuận" },
  ],

  [ExcelEntityType.INCOME_EXPENSE]: [
    {
      field: IncomeExpenseKey.OCCURRED_AT,
      header: "Ngày",
      width: 20,
    },
    {
      field: IncomeExpenseKey.CODE,
      header: "Số phiếu",
      width: 18,
    },
    {
      field: IncomeExpenseKey.TYPE,
      header: "Loại",
      width: 15,
    },
    {
      field: IncomeExpenseKey.DESCRIPTION,
      header: "Diễn giải",
      width: 40,
    },
    {
      field: IncomeExpenseKey.AMOUNT,
      header: "Số tiền",
      width: 18,
    },
    {
      field: IncomeExpenseKey.FUND_NAME,
      header: "Quỹ",
      width: 20,
    },
    {
      field: IncomeExpenseKey.CATEGORY_NAME,
      header: "Hạng mục",
      width: 25,
    },
    {
      field: IncomeExpenseKey.PARTNER_NAME,
      header: "Đối tác",
      width: 30,
    },
    {
      field: IncomeExpenseKey.CREATOR_NAME,
      header: "Người xử lý",
      width: 25,
    },
    {
      field: IncomeExpenseKey.STORE_NAME,
      header: "Cửa hàng",
      width: 25,
    },
  ],
};
