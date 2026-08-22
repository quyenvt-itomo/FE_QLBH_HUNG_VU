import { FormInstance } from "antd";
import { BaseError } from "../stores/baseReducers";
import { apiEndpoint, BASE_URL } from "../constants/ApiEndpoint";

function stripPrefixIfNumber(raw: string, prefix: string): number | null {
  if (raw.startsWith(prefix)) {
    const stripped = raw.slice(prefix.length).replace(/,/g, "").trim();
    const num = Number(stripped);
    if (!isNaN(num)) {
      return num;
    }
  }
  return null;
}

export function handlePasteCommon<T = any>(
  event: React.ClipboardEvent,
  form: FormInstance<T>,
  allFields: (keyof T)[],
) {
  const clipboardData = event.clipboardData.getData("Text");
  const rawValues = clipboardData.trim().split(/\t|\r\n|\n/);

  const newValues: Record<string, any> = {};
  let valueIndex = 0;

  for (let i = 0; i < allFields.length; i++) {
    const field = allFields[i];
    const raw = rawValues[valueIndex]?.trim();
    valueIndex++;

    if (!field || String(field).includes("Id") || !raw) {
      continue;
    }

    if (/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(raw)) {
      newValues[field as string] = Number(raw.replace(/,/g, ""));
    } else if (/^\d+(\.\d+)?$/.test(raw)) {
      newValues[field as string] = Number(raw);
    } else if (stripPrefixIfNumber(raw, "≤") !== null) {
      newValues[field as string] = stripPrefixIfNumber(raw, "≤");
    } else if (stripPrefixIfNumber(raw, "<") !== null) {
      newValues[field as string] = stripPrefixIfNumber(raw, "<");
    } else if (field === "mold") {
      newValues[field as string] = raw.toLocaleLowerCase().includes("mới")
        ? "Khuôn mới"
        : "Khuôn cũ";
    } else {
      newValues[field as string] = raw;
    }
  }

  form.setFieldsValue(newValues);
}

/**
 * Cập nhật lỗi từ API vào Form Ant Design
 * @param form - Đối tượng form của Ant Design
 * @param errors - Danh sách lỗi từ API
 */
export const setFormErrors = (form: FormInstance | undefined, errors: BaseError[] | null) => {
  if (!errors || errors.length === 0) return;

  const formattedErrors = errors.map((error) => ({
    name: error.key?.includes(".") ? error.key.split(".") : error.key, // Key của field
    errors: [error.message], // Mảng lỗi hiển thị dưới field
  }));
  form?.setFields(formattedErrors);
};

/**
 * Cập nhật code từ Api vào Form Ant Design
 * @param form - Đối tượng form của Ant Design
 * @param type - loại đối tượng muốn hiển thị code
 */

type CodeType =
  | "store"
  | "user"
  | "product"
  | "customer"
  | "supplier"
  | "storeTransfer"
  | "fund"
  | "fundAdjustment"
  | "fundTransfer"

  // TODO: Store scope
  | "employee"
  | "purchase"
  | "sale"
  | "purchaseReturn"
  | "saleReturn"
  | "inventoryAdjustment"
  | "partnerDebtAdjustment"
  | "partnerDebtOffset"
  | "income"
  | "expense"
  | "partnerDebtAdjustment"
  | "partnerDebtOffset"
  | "vatDebtAdjustment"
  | "shift";

interface SetFormCodeParams {
  form?: FormInstance;
  type: CodeType;
  field?: string;
}

export const setFormCode = async ({ form, type, field }: SetFormCodeParams) => {
  try {
    const deviceId = localStorage.getItem("deviceId") || "1";
    const currentStoreCode = sessionStorage.getItem("currentStoreCode") || "";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(`${BASE_URL}${apiEndpoint.code}?type=${type}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "x-device-id": deviceId || "",
        "x-timezone": timeZone,
        "x-store-code": currentStoreCode,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    form?.setFieldValue(field || "code", result?.data?.code);
    return result?.data?.code;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};
