import { ApiResponse } from "./api";

export type DateFormatData = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY/MM/DD";

export type TimeFormatData = "hh:mm A" | "HH:mm";

export type TimeDisplayModeData =
  | "none" // Không hiển thị
  | "form_only" // Chỉ hiển thị trên Form
  | "table_only" // Chỉ hiển thị trên bảng
  | "both"; // Tất cả

export type NumberFormatType = "." | ",";

export type DecimalPrecision = 0 | 1 | 2;

export type SymbolPosition = "none" | "before" | "after";

export interface CountryData {
  code: string; // ISO 3166-1 alpha-2 (e.g., "VN")
  name: string; // "Việt Nam"
  phoneCode: string; // "+84"
}

export interface CurrencyData {
  code: string; // ISO 4217 (e.g., "VND")
  name: string; // "Vietnamese Dong"
  symbol: string; // "₫"
  spaceBetween: boolean; // Có cách giữa số và đơn vị không (100₫ vs 100 ₫)
  symbolPosition: SymbolPosition;
  decimalPrecision: number; // Số lẻ thập phân mặc định (e.g., 0 cho VND)
}

export interface LanguageData {
  code: string; // ISO 639-1 (e.g., "vi")
  name: string; // "Tiếng Việt"
}

export interface TimezoneData {
  name: string; // Tên vùng IANA (e.g., "Asia/Ho_Chi_Minh")
  offset: string; // "+07:00"
}

export interface NumberFormatData {
  decimalPrecision: DecimalPrecision; // Số chữ số sau dấu thập phân
  decimalSeparator: NumberFormatType; // Dấu phân cách phần thập phân (e.g., ",")
  thousandSeparator: NumberFormatType; // Dấu phân cách hàng nghìn (e.g., ".")
}

export interface FormatData {
  country: CountryData;
  currency: CurrencyData;
  language: LanguageData;
  timezone: TimezoneData;
  dateFormat: DateFormatData; // "DD/MM/YYYY"
  timeFormat: TimeFormatData; // "HH:mm:ss"
  timeDisplayMode: TimeDisplayModeData; // "both"
  localeCode: string; // "vi-VN"
  numberFormat: NumberFormatData;
}

export interface StoreSettings {
  timezone?: string;
  currency?: string;
  language?: string;
  dateFormat?: string;
  features?: string[]; // Enabled features
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FormatResponse extends ApiResponse {}
