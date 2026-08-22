import dayjs from "dayjs";
import { FormatData } from "../models/base/format";

export const defaultStartDate = dayjs().startOf("month").format("YYYY-MM-DD");
export const defaultEndDate = dayjs().endOf("month").format("YYYY-MM-DD");

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
 * @param format Định dạng từ useClientData().format
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

export const formatDateDDMMYYYY = (date: string | Date | undefined | null): string => {
  if (!date) return "";

  return dayjs(date).format("DD/MM/YYYY");
};

export const formatDateYYYYMMDD = (value: string | null) => {
  if (!value) return null;
  return dayjs(value).format("YYYY-MM-DD");
};

export function formatDateTimeDDMMYYYY(dateString?: string) {
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

const dateFields: string[] = [
  "dob",
  "timeAt",
  "invoiceDate",
  "deliveryDate",
  "purchaseDate",
  "identification.issuedDate",
  "identification.expirationDate",

  "signedAt",
  "expiresAt",

  "transactionDate",

  "requestReceivedDate",
  "analysisDesignDate",
  "contractDate",
  "startDate",
  "plannedStartDate",
  "plannedEndDate",
  "actualEndDate",
  "plannedInstallationDate",
  "actualInstallationDate",
  "plannedAcceptanceDate",
  "actualAcceptanceDate",

  "workingDate",

  "testDate",
  "fixedDate",

  "task.plannedEndDate",
  "start",
  "end",
  "date",
  "orderAt",
  "occurredAt",

  "startAt",
  "endAt",
];

const dateTimeFields: string[] = ["start", "end", "orderAt", "occurredAt"];

export function formatDateYYYYMMDDNative(value: any): string | null {
  if (!value) return null;

  return dayjs(value).startOf("day").toISOString();
}

export function formatDatetimeNative(value: any): string | null {
  if (!value) return null;

  // Nếu là object từ DatePicker (dayjs clone) thì lấy $d
  const date: Date = value instanceof Date ? value : value.$d instanceof Date ? value.$d : null;
  if (!date) return null;
  return dayjs(date).toISOString();
}

export function formatDateYYYYMMDDToUTC(value: any): string | null {
  if (!value) return null;

  let date: Date | null = null;

  // Nếu là thật sự là Dayjs (vẫn còn prototype)
  if (dayjs.isDayjs(value) && typeof value.toDate === "function") {
    date = value.toDate();
  }
  // Nếu là object từ structuredClone (mất prototype) nhưng có $d
  else if (value && value.$d instanceof Date) {
    date = value.$d;
  }
  // Nếu là Date
  else if (value instanceof Date) {
    date = value;
  }
  // Nếu là string hợp lệ
  else if (typeof value === "string" && !isNaN(Date.parse(value))) {
    date = new Date(value);
  }
  // Không hợp lệ
  else {
    console.warn("⚠️ Invalid date value passed to formatDateYYYYMMDDToUTC:", value);
    return null;
  }

  return dayjs(date).startOf("day").toISOString();
}

// TODO: Gửi về cho Backend
export function formatFormData<T extends Record<string, any>>(data: T): T {
  const formattedData = structuredClone(data);

  for (const path of dateFields) {
    const keys = path.split(".");
    let current: any = formattedData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current = null;
        break;
      }
      current = current[keys[i]];
    }

    if (current) {
      const lastKey = keys[keys.length - 1];

      if (current[lastKey]) {
        // riêng start và end => iso string
        if (dateTimeFields.includes(lastKey)) {
          current[lastKey] = formatDatetimeNative(current[lastKey]);
        } else current[lastKey] = formatDateYYYYMMDDToUTC(current[lastKey]);
      }
    }
  }

  return formattedData;
}

// TODO: Nhận từ Backend
export function parseFormDataDates<T extends Record<string, any>>(data: T): T {
  // Deep clone để tránh lỗi "read-only property"
  const parsedData = structuredClone(data);

  for (const path of dateFields) {
    const keys = path.split(".");
    let current: any = parsedData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current = null;
        break;
      }
      current = current[keys[i]];
    }

    if (current) {
      const lastKey = keys[keys.length - 1];
      if (current[lastKey]) {
        current[lastKey] = dayjs(current[lastKey]);
      }
    }
  }
  return parsedData;
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
