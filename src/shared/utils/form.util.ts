import { FormInstance } from "antd";
import { BaseError } from "../interfaces/api";
import { apiEndpoint, BASE_URL } from "../constants/apiEndpoint";
import { getInitialCurrentStore } from "../stores/global.slice";

interface DefaultProvinceValue {
  id?: string;
  code?: string;
  name?: string;
}

interface ApplyDefaultProvinceToFormParams {
  form: FormInstance;
  defaultProvince?: DefaultProvinceValue | null;
  addressPath?: (string | number)[];
}

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
 * - Hỗ trợ định dạng Ant Design: { name: ["lines","0","billingQuantity"], errors: ["msg"] }
 * - Hỗ trợ định dạng cũ: { field: "lines.0.billingQuantity", message: "msg" }
 * @param form - Đối tượng form của Ant Design
 * @param errors - Danh sách lỗi từ API
 */
export const setFormErrors = (
  form: FormInstance | undefined,
  errors: BaseError[] | null,
  options?: { scrollToFirst?: boolean },
) => {
  if (!errors || errors.length === 0) return;

  const formattedErrors = errors
    .map((error: any) => {
      const rawName = error.name ?? error.field;
      let name: any = rawName;
      if (typeof rawName === "string") {
        name = rawName.includes(".") ? rawName.split(".") : rawName;
      }
      const messages: string[] = Array.isArray(error.errors)
        ? error.errors
        : [error.message ?? error.errors];
      const hasName =
        name != null && (Array.isArray(name) ? name.length > 0 : String(name).length > 0);
      if (!hasName || !messages.length) return null;
      return { name, errors: messages.filter(Boolean) as string[] };
    })
    .filter(Boolean) as { name: any; errors: string[] }[];

  form?.setFields(formattedErrors);

  if (options?.scrollToFirst && formattedErrors.length > 0) {
    form?.scrollToField(formattedErrors[0].name);
  }
};

/**
 * Trích xuất các cell bị lỗi trong Form.List từ danh sách BaseError
 * @param errors - Danh sách lỗi từ API
 * @param listField - Tên field của Form.List (vd: "lines")
 * @returns Map<rowIndex, Set<fieldName>> — vd: Map { 0 => Set("quantity") }
 */
export const extractListErrorCells = (
  errors: BaseError[] | null | undefined,
  listField: string,
): Map<number, Set<string>> => {
  const result = new Map<number, Set<string>>();
  if (!errors) return result;

  // normalize: { name: ["lines","0","quantity"] } | { field: "lines.0.quantity" }
  const toParts = (raw: any): string[] => {
    if (Array.isArray(raw)) return raw.map(String);
    if (typeof raw === "string") return raw.includes(".") ? raw.split(".") : [raw];
    return [];
  };

  for (const error of errors) {
    const parts = toParts((error as any).name ?? error.field);
    // Field dạng ["lines", "0", "quantity"] (hoặc "lines.0.quantity")
    if (parts[0] === listField && parts.length >= 3) {
      const idx = Number(parts[1]);
      const fieldName = parts[2];
      if (!isNaN(idx) && fieldName) {
        if (!result.has(idx)) result.set(idx, new Set());
        result.get(idx)!.add(fieldName);
      }
    }
  }
  return result;
};

export const applyDefaultProvinceToForm = ({
  form,
  defaultProvince,
  addressPath = ["address"],
}: ApplyDefaultProvinceToFormParams) => {
  if (!defaultProvince) return;

  const currentProvinceCode = form.getFieldValue([...addressPath, "provinceCode"]);
  if (currentProvinceCode) return;

  const currentAddress = form.getFieldValue(addressPath) || {};
  form.setFieldValue(addressPath, {
    ...currentAddress,
    province: defaultProvince.name,
    provinceId: defaultProvince.id,
    provinceCode: defaultProvince.code,
  });
};

/**
 * Cập nhật code từ Api vào Form Ant Design
 * @param form - Đối tượng form của Ant Design
 * @param type - loại đối tượng muốn hiển thị code
 */

export type CodeType =
  | "user"
  | "organization"
  | "attribute"
  | "employee"
  | "paymentterm"
  | "partner"
  | "product"
  | "service"
  | "bom"
  | "warehouse"
  | "fund"
  | "fundadjustment"
  | "fundtransfer"
  | "income"
  | "expense"
  | "stockdocument"
  | "inventoryin"
  | "inventoryout"
  | "inventoryadjustment"
  | "warehousetransfer"
  | "inventorylot"
  | "order"
  | "purchase"
  | "production"
  | "partnerdebtoffset"
  | "partnerdebtadjustment"
  | "inventoryadjustment"
  | "inventoryconversion"
  | "commissiondebtadjustment"
  | "commissionDebtAdjustment"
  | "inventoryAdjustment"
  | "inventoryConversion"
  | "invoice"
  | "paymentRequest"
  | "purchaseRequisition"
  | "purchaseQuotation"
  | "quotation"
  | "quotationRequest"
  | "shippingPlan"
  | "stockDocument"
  | "warehouseTransfer";

interface SetFormCodeParams {
  form?: FormInstance;
  type: CodeType;
  field?: string;
}

export const setFormCode = async ({ form, type, field }: SetFormCodeParams) => {
  // Mã chứng từ được backend sinh khi lưu nếu người dùng để trống.
  // Giữ API cũ để các module chưa migrate đồng loạt không bị lỗi import.
  void form;
  void type;
  void field;
  return undefined;

  /* legacy code generation flow
  try {
    const currentStore = getInitialCurrentStore();
    const ipAddress = sessionStorage.getItem("ipAddress");
    const deviceId = localStorage.getItem("deviceId") || "1";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const storeId = currentStore?.id || "";
    const response = await fetch(
      `${BASE_URL}${apiEndpoint.code}?type=${type}&storeId=${storeId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "x-company-id": storeId,
          "x-device-id": deviceId || "",
          "x-timezone": timeZone,
          "x-ip-address": ipAddress || "",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    form?.setFieldValue(field || "code", result?.data?.code);
    return result?.data?.code;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
  */
};
