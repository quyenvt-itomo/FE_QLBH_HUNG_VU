import dayjs, { Dayjs } from "dayjs";
import { FormatData } from "@/shared/interfaces/format";
import { Entity } from "../base/entity";
import { sortData } from "./common.util";

export const defaultStartDate = dayjs().startOf("month").format("YYYY-MM-DD");
export const defaultEndDate = dayjs().endOf("month").format("YYYY-MM-DD");

export type DateInput = Dayjs | string | Date | null | undefined | any;

const normalize = (value: DateInput): Dayjs | null => {
  if (!value) return null;

  if (dayjs.isDayjs(value)) {
    if (typeof value?.toDate === "function") return value as Dayjs;

    // structuredClone của Dayjs có thể vẫn mang cờ $isDayjsObject
    // nhưng mất prototype/method.
    const rawValue = value as { $d?: unknown };
    if (rawValue.$d instanceof Date) {
      return dayjs(rawValue.$d);
    }

    return null;
  }

  if (value instanceof Date) return dayjs(value);

  if (typeof value === "string") {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }

  // structuredClone case
  if (value?.$d instanceof Date) {
    return dayjs(value.$d);
  }

  return null;
};

/**
 * Lấy ngày đầu và cuối của tháng hiện tại dưới dạng chuỗi ISO.
 * @returns Một object chứa `fromDate` (ngày đầu tháng) và `toDate` (ngày cuối tháng).
 */
export const getStartAndEndOfMonth = (): {
  fromDate: string;
  toDate: string;
} => {
  const fromDate = dayjs().startOf("month").toISOString();
  const toDate = dayjs().endOf("month").toISOString();
  return { fromDate, toDate };
};

/**
 * Format ngày giống như DatePicker sử dụng client format config
 * @param date Chuỗi hoặc đối tượng Date
 * @param format Định dạng từ useGlobalData().format
 * @returns Chuỗi ngày đã format hoặc ""
 */
export const formatDate = (
  date: string | Date | undefined | null,
  format?: FormatData | null,
): string => {
  if (!date) return "";

  const d = dayjs(date);
  if (!d.isValid()) return "";

  const showTime = format?.timeDisplayMode === "both" || format?.timeDisplayMode === "form_only";

  const fullFormat = showTime
    ? `${format.dateFormat} ${format.timeFormat}`
    : format?.dateFormat || "DD/MM/YYYY";

  return d.format(fullFormat);
};

/** Format ngày + giờ mặc định (DD/MM/YYYY HH:mm:ss) */
export const formatDateTime = (
  date: string | Date | undefined | null,
  format: string = "DD/MM/YYYY HH:mm:ss",
): string => {
  if (!date) return "";
  const d = dayjs(date);
  if (!d.isValid()) return "";
  return d.format(format);
};

export const formatDateDDMMYYYY = (date: string | Date | undefined | null): string => {
  if (!date) return "";

  return dayjs(date).format("DD/MM/YYYY");
};

export const formatDateYYYYMMDD = (value: string | null) => {
  if (!value) return null;
  return dayjs(value).format("YYYY-MM-DD");
};

export function formatDateTimeDDMMYYYY(dateString?: Date | string | null): string {
  if (!dateString) return "";
  return dayjs(dateString).format("DD/MM/YYYY HH:mm");
}

export const getSessionStartDate = (): string => {
  const startDate = sessionStorage.getItem("dateRangeStart");
  return startDate || defaultStartDate;
};
export const getSessionEndDate = (): string => {
  const endDate = sessionStorage.getItem("dateRangeEnd");
  return endDate || defaultEndDate;
};

// Tổng hợp từ tất cả model hiện tại — các field có kiểu Date / string date
const dateFields: string[] = [
  // Employee
  "hireDate",
  "lastHeartbeatAt",
  "dob",
  "trialDate",
  "officialDate",
  "identification.issuedDate",
  "identification.expiredDate",
  "insuranceInfo.startDate",

  // EmployeeContract
  "startDate",
  "endDate",

  // Machine
  "installedAt",
  "warrantyExpiredAt",

  // WorkOrder
  "requestedAt",
  "scheduledAt",
  "completedAt",
  "slaResponseDeadline",
  "slaResolutionDeadline",
  "availableTimeFrames.start",
  "availableTimeFrames.end",

  // CustomerMachineAssignment
  "assignedAt",
  "unassignedAt",

  // User
  "lastLoginAt",
  "lockedUntil",

  // Dispatch
  "acceptedAt",
  "startedAt",
  "finishedAt",
  "cancelledAt",

  // Maintenance
  "scheduledDate",
  "completedDate",

  // Purchase
  "orderedAt",
  "approvedAt",
  "completedAt",

  // PurchaseQuotation
  "timeAt",

  // PurchaseRequisition
  "timeAt",

  // Order
  "orderAt",
  "timeAt",

  // Quotation
  "validUntil",
  "customerApprovedAt",

  // QuotationRequest
  "timeAt",

  // Invoice
  "invoiceDate",

  // StockDocument
  "effectiveDate",
  "actualExportDate",
  "actualImportDate",

  // WarehouseTransfer
  "exportedAt",
  "importedAt",

  // PaymentRequest
  "timeAt",

  // GateLog
  "entryTime",
  "exitTime",

  // ReferralCode
  "expiresAt",
  "usedAt",

  // ShippingPlan
  "approvedAt",

  // Production / MeshSpec
  "timeAt",

  // CommissionAllocation / InvoiceAllocation
  "allocatedAt",

  // Các module dùng chung occurredAt:
  // FundAdjustment, FundTransfer, FundTransaction,
  // CommissionDebtAdjustment, CommissionDebtTransaction,
  // IncomeExpense, InventoryAdjustment, InventoryTransaction,
  // PartnerDebtAdjustment, PartnerDebtOffset, DebtTransaction,
  // VatDebtAdjustment, VatDebtTransaction
  "occurredAt",
  "referenceDate",
];

// Chỉ các field cần giữ nguyên ISO datetime (không convert sang startOf("day"))
// Các field date-only như dob, startDate, endDate, invoiceDate, validUntil,
// expiresAt, effectiveDate, identification.issuedDate, identification.expiredDate,
// insuranceInfo.startDate, trialDate, officialDate, warrantyExpiredAt...
// → KHÔNG thêm vào đây, sẽ tự động dùng startOf("day")
const dateTimeFields: string[] = [
  "lastHeartbeatAt",
  "requestedAt",
  "slaResponseDeadline",
  "slaResolutionDeadline",
  "lastLoginAt",
  "lockedUntil",

  // Common datetime fields
  "orderAt",
  "timeAt",
  "occurredAt",
  "orderedAt",
  "approvedAt",
  "completedAt",
  "allocatedAt",

  // Dispatch
  "acceptedAt",
  "startedAt",
  "finishedAt",
  "cancelledAt",

  // GateLog
  "entryTime",
  "exitTime",

  // Quotation
  "customerApprovedAt",

  // StockDocument
  "actualExportDate",
  "actualImportDate",

  // WarehouseTransfer
  "exportedAt",
  "importedAt",

  // ReferralCode
  "usedAt",
];

export function formatDateYYYYMMDDNative(value: any): string | null {
  if (!value) return null;

  return dayjs(value).startOf("day").toISOString();
}

export function formatDatetimeNative(value: DateInput): string | null {
  const d = normalize(value);
  if (!d) return null;

  return d.toDate().toISOString();
}

export function formatDateYYYYMMDDToUTC(value: DateInput): string | null {
  const d = normalize(value);
  if (!d) return null;

  return d.startOf("day").toDate().toISOString();
}

function setDateValue(obj: any, keys: string[]) {
  if (!obj) return;

  const key = keys[0];

  // Nếu là mảng → apply cho từng phần tử
  if (Array.isArray(obj)) {
    obj.forEach((item) => setDateValue(item, keys));
    return;
  }

  // Nếu là key cuối
  if (keys.length === 1) {
    if (!obj[key]) return;

    if (dateTimeFields.includes(key)) {
      obj[key] = formatDatetimeNative(obj[key]);
    } else {
      obj[key] = formatDateYYYYMMDDToUTC(obj[key]);
    }

    return;
  }

  // Đi tiếp xuống
  setDateValue(obj[key], keys.slice(1));
}

// TODO: Gửi về cho Backend
export function formatFormData<T extends Entity>(data: T, sortOrderFields?: (keyof T)[]): T {
  const formattedData = structuredClone(data);

  for (const path of dateFields) {
    const keys = path.split(".");
    setDateValue(formattedData, keys);
  }

  if (sortOrderFields) {
    for (const field of sortOrderFields) {
      if (formattedData[field] !== undefined && Array.isArray(formattedData[field])) {
        // // Nạp sortOrder từ 10 lên, tăng dần 10
        // (formattedData[field] as any[]).forEach((item, index) => {
        //   if (typeof item === "object" && item !== null) {
        //     (formattedData[field] as any[])[index] = { ...item, sortOrder: 10 * (index + 1) };
        //   }
        // });
        (formattedData[field] as any[]) = [...(formattedData[field] as any[])].map(
          (item, index) => {
            if (typeof item === "object" && item !== null) {
              return { ...item, sortOrder: 10 * (index + 1) };
            }
            return item;
          },
        );
      }
    }
  }

  return formattedData;
}

// TODO: Nhận từ Backend
export function parseFormDataDates<T>(data: Partial<T>, sortOrderFields?: (keyof T)[]): any {
  try {
    // Deep clone để tránh lỗi "read-only property"
    const parsedData = structuredClone(data);
    for (const path of dateFields) {
      const keys = path.split(".");
      parseDateField(parsedData, keys);
    }

    if (sortOrderFields) {
      // sort lại các mảng có sortOrder
      for (const field of sortOrderFields) {
        if (parsedData[field] !== undefined && Array.isArray(parsedData[field])) {
          (parsedData[field] as any[]) = sortData([...(parsedData[field] as any[])]);
        }
      }
    }

    return parsedData;
  } catch (error) {
    console.error("Error parsing form data dates:", error);
    return data; // Trả về dữ liệu gốc nếu có lỗi
  }
}

function parseDateField(obj: any, keys: string[]) {
  if (!obj) return;

  const key = keys[0];

  // Nếu là mảng → apply cho từng phần tử
  if (Array.isArray(obj)) {
    obj.forEach((item) => parseDateField(item, keys));
    return;
  }

  // Nếu là key cuối
  if (keys.length === 1) {
    if (obj[key]) {
      obj[key] = dayjs(obj[key]);
    }
    return;
  }

  // Đi tiếp xuống
  parseDateField(obj[key], keys.slice(1));
}

export const formatTime = (
  date: string | Date | undefined | null,
  format?: FormatData | null,
): string => {
  if (!date) return "";
  const d = dayjs(date);
  if (!d.isValid()) return "";
  return d.format(format?.timeFormat || "HH:mm");
};

export function timeAgo(isoString?: string): string {
  if (!isoString) return "";
  const now = new Date();
  const past = new Date(isoString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ngày trước`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} năm trước`;
}

export const formatVietNamDate = (date: string | Date | undefined | null): string => {
  if (!date) return "";

  const d = dayjs(date);
  if (!d.isValid()) return "";

  const day = d.locale("vi");

  return `Ngày ${day.date()} tháng ${day.month() + 1} năm ${day.year()}`;
};

export const calculateDateProgress = (start: DateInput, end: DateInput): number => {
  const startDate = normalize(start);
  const endDate = normalize(end);
  if (!startDate || !endDate) return 0;

  const today = dayjs();

  if (today.isBefore(startDate)) return 0;
  if (today.isAfter(endDate)) return 100;

  const totalDuration = endDate.diff(startDate, "second");
  const elapsed = today.diff(startDate, "second");
  return Math.round((elapsed / totalDuration) * 100);
};

// Hàm tính ngày hết hạn
export const calculateExpirationDate = (
  manufacturedAt: DateInput,
  shelfLifeInMonths: number | null,
): string | null => {
  if (!shelfLifeInMonths || !shelfLifeInMonths) return null;
  const manufacturedDate = normalize(manufacturedAt);
  if (!manufacturedDate) return null;

  const expirationDate = manufacturedDate.add(shelfLifeInMonths, "month");
  return expirationDate.format("YYYY-MM-DD");
};
