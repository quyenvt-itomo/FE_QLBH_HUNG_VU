import { FormatData, SymbolPosition } from "../models/base/format";

export const formatNumber = (
  value: number | string,
  decimalPrecision: number,
  thousandSeparator: string,
  decimalSeparator: string,
): string => {
  const locale = thousandSeparator === "," ? "en-US" : "vi-VN";
  const numericValue = Number(value) || 0;

  const formatted = numericValue.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPrecision,
  });

  return formatted;
};

export const formatCurrency = (
  value: number,
  decimalPrecision: number,
  thousandSeparator: string,
  decimalSeparator: string,
  symbolPosition: SymbolPosition,
): string => {
  const formattedNumber = formatNumber(
    value,
    decimalPrecision,
    thousandSeparator,
    decimalSeparator,
  );

  if (symbolPosition === "before") {
    return `₫ ${formattedNumber}`;
  } else if (symbolPosition === "after") {
    return `${formattedNumber} ₫`;
  }
  return formattedNumber; // Không hiển thị ký hiệu
};

export function formatPercentage(value?: number | null, format?: FormatData | null): string {
  if (!value) return "";
  return (
    formatNumber(
      value,
      format?.numberFormat?.decimalPrecision || 2,
      format?.numberFormat?.thousandSeparator || ",",
      format?.numberFormat?.decimalSeparator || ".",
    ) + "%"
  );
}

export const formatMoney = (value?: number | null, format?: FormatData | null) => {
  if (!value) return "";
  const { currency, numberFormat } = format || {};
  const { decimalPrecision = 0, symbolPosition = "none" } = currency || {};
  const { thousandSeparator = ",", decimalSeparator = "." } = numberFormat || {};

  return formatCurrency(
    value || 0,
    decimalPrecision,
    thousandSeparator,
    decimalSeparator,
    symbolPosition,
  );
};

export const formatQuantity = (value?: number | null, format?: FormatData | null) => {
  if (!value) return "";
  const { currency, numberFormat } = format || {};
  const { decimalPrecision = 2 } = currency || {};
  const { thousandSeparator = ",", decimalSeparator = "." } = numberFormat || {};

  return formatNumber(value, decimalPrecision, thousandSeparator, decimalSeparator);
};

export const formatShortMoney = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return value.toString();
};

/**
 * Chuyển đổi số thành chữ tiếng Việt
 */
function convertGroupToWords(num: number, units: string[]): string {
  const hundred = Math.floor(num / 100);
  const ten = Math.floor((num % 100) / 10);
  const unit = num % 10;

  let result = "";

  if (hundred > 0) {
    result += units[hundred] + " trăm";
  }

  if (ten > 1) {
    result += " " + units[ten] + " mươi";
  } else if (ten === 1) {
    result += " mười";
  }

  if (unit > 0) {
    if (ten > 1 && unit === 1) {
      result += " mốt";
    } else if (ten > 0 && unit === 5) {
      result += " lăm";
    } else {
      result += " " + units[unit];
    }
  }

  return result.trim();
}

export function numberToVietnameseWords(num?: number | null): string {
  const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const levels = ["", "nghìn", "triệu", "tỷ"];

  if (!num) return "Không đồng";

  let result = "";
  let levelIndex = 0;

  while (num > 0) {
    const group = num % 1000;
    if (group !== 0) {
      const groupText = convertGroupToWords(group, units);
      result = groupText + " " + levels[levelIndex] + " " + result;
    }
    num = Math.floor(num / 1000);
    levelIndex++;
  }

  return result.trim().charAt(0).toUpperCase() + result.trim().slice(1) + " đồng";
}
