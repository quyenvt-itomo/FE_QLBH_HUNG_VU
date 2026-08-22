import axios from "axios";
import { apiEndpoint, apiGetIpAddress, BASE_URL } from "../constants/ApiEndpoint";
import { useLocation } from "react-router-dom";
import { NotificationData } from "../models/base/notification";
import { message } from "antd";
import { publicRoutesName } from "../constants/routerName";
import { IAddress } from "../models/base/interface";
import { IProductType, IProductVariant, ProductVariantSnapshot } from "../models/product";
import { TAG_COLORS } from "../constants/UI";
import {
  AttributeTypeEnum,
  CHECKLIST_KEY,
  checklistKeyMap,
  DiscountTypeEnum,
  OrderLineTypeEnum,
  PartnerTypeEnum,
} from "../constants/enum";
import { formatMoney, formatQuantity } from "./formatNumber";
import { IAttribute } from "../models/base/attribute";
import { IPartner } from "../models/partner";
import { IOrder } from "../models/store/order";
import { IOrderLine } from "../models/store/orderLine";
import { InventoryStreamData } from "../models/store/inventory";
import { CashKey } from "../models/store/shift";

export const getIpAddress = () => axios.get(apiGetIpAddress);

export const setIpAddress = async () => {
  try {
    const response = await getIpAddress();
    const ipAddress = response?.data?.ip;
    if (ipAddress) {
      sessionStorage.setItem("ipAddress", ipAddress);
    }
  } catch (error) {
    console.error("Failed to fetch IP address:", error);
  }
};

export const getLocationNotification = () => {
  const location = useLocation();
  const notification: NotificationData = location.state?.notification;
  return notification;
};

export async function copyText(text: string) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      message.success("Đã sao chép vào clipboard");
      return;
    }

    // fallback cho browser cũ
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);

    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (ok) {
      message.success("Đã sao chép vào clipboard");
    } else {
      message.error("Không thể sao chép");
    }
  } catch (err) {
    console.error(err);
    message.error("Lỗi khi sao chép");
  }
}

export const randomId = (): string => {
  return crypto.randomUUID();
};

export function normalizeIdsField(
  field: any[] | any | undefined,
  mapKey: string = "id",
): string[] | undefined {
  if (!field) return undefined;

  // Nếu là array object → trả về array id
  if (Array.isArray(field)) {
    return field.map((item) => {
      if (typeof item === "object") {
        return item[mapKey];
      }
      return item;
    });
  }

  // Nếu là 1 object → trả về array 1 id
  if (typeof field === "object") {
    return [field[mapKey]];
  }

  // Nếu là string / number đơn → cho vào array
  return [field];
}
export const formatPayload = (payload?: any) => {
  const {
    employeeIds,
    partnerIds,
    supplierIds,
    customerIds,
    shipperIds,
    productIds,
    storeIds,
    userIds,
    fundIds,
    productCategoryIds,
    unitIds,
    ...rest
  } = (payload as any) || {};

  return {
    ...rest,
    employeeIds: normalizeIdsField(employeeIds),
    partnerIds: normalizeIdsField(partnerIds),
    supplierIds: normalizeIdsField(supplierIds),
    customerIds: normalizeIdsField(customerIds),
    shipperIds: normalizeIdsField(shipperIds),
    productIds: normalizeIdsField(productIds),
    storeIds: normalizeIdsField(storeIds),
    userIds: normalizeIdsField(userIds),
    fundIds: normalizeIdsField(fundIds),
    productCategoryIds: normalizeIdsField(productCategoryIds),
    unitIds: normalizeIdsField(unitIds),
  };
};

interface RefreshTokenParams {
  refreshToken: string;
}

export const refreshAuthToken = async ({ refreshToken }: RefreshTokenParams) => {
  try {
    const deviceId = localStorage.getItem("deviceId") || "1";
    const currentStoreCode = sessionStorage.getItem("currentStoreCode") || "";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const res = await fetch(`${BASE_URL}/${publicRoutesName.refreshToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-device-id": deviceId || "",
        "x-timezone": timeZone,
        "x-store-code": currentStoreCode,
      },
      credentials: "include", // tương đương withCredentials: true
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      // đọc message backend nếu có
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || "Refresh token failed");
    }

    const data = await res.json();
    const loginData = data?.data;

    if (loginData) {
      localStorage.setItem("loginData", JSON.stringify(loginData));
      sessionStorage.setItem("loginData", JSON.stringify(loginData));
    }

    return loginData;
  } catch (error) {
    console.error("refreshAuthToken failed:", error);
    throw error;
  }
};

export const getFullAddress = (address?: IAddress | null): string => {
  if (!address) return "";

  return [address.detail, address.ward, address.state].filter(Boolean).join(", ");
};

export const getProductVariantByBarcode = async (
  barcode: string,
): Promise<IProductVariant | null> => {
  try {
    const deviceId = localStorage.getItem("deviceId") || "1";
    const currentStoreCode = sessionStorage.getItem("currentStoreCode") || "";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const res = await fetch(`${BASE_URL}${apiEndpoint.product.base}/barcode/${barcode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-device-id": deviceId || "",
        "x-timezone": timeZone,
        "x-store-code": currentStoreCode,
      },
      credentials: "include", // tương đương withCredentials: true
    });

    if (!res.ok) {
      // đọc message backend nếu có
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || "Refresh token failed");
    }

    const data = await res.json();

    const variant: IProductVariant = data?.data;

    return variant;
  } catch (error) {
    console.error("getProductVariantByBarcode failed:", error);
    return null;
  }
};

export const getVariantOptionContent = (data?: IProductVariant | ProductVariantSnapshot | null) => {
  if (!data?.options || data.options.length === 0) return "";
  const options = [...data.options];
  const content = options
    .sort((a, b) => a.typeIndex - b.typeIndex)
    .map((opt) => opt.value)
    .join(" - ");

  return content || "";
};

export const getFullVariantOptionContent = (
  data?: ProductVariantSnapshot | IProductVariant | null,
) => {
  if (!data?.options || data.options.length === 0) return "";
  const options = [...data.options];
  const content = options
    .sort((a, b) => a.typeIndex - b.typeIndex)
    .map((opt) => `${opt.type?.name || ""}: ${opt.value || ""}`)
    .join(" - ");

  return content || "";
};

export const hashStringToIndex = (str: string, modulo: number) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // convert to 32bit
  }
  return Math.abs(hash) % modulo;
};

export const getTagColorByName = (name?: string) => {
  if (!name) return "default";

  const index = hashStringToIndex(name, TAG_COLORS.length);
  return TAG_COLORS[index];
};

export function getDiscontContent<
  T extends {
    discountType?: DiscountTypeEnum | null;
    discountValue?: number | null;
  },
>(data: T): string {
  if (!data.discountType || !data.discountValue) return "";

  if (data.discountType === DiscountTypeEnum.PERCENT) {
    return `${data.discountValue}%`;
  }

  return formatMoney(data.discountValue);
}

export function sortData<T extends { sortOrder?: number }>(data: T[]): T[] {
  return [...data].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });
}

export const getDefaultVariant = () => {
  const variantTempId = randomId();

  return {
    variants: [
      {
        tempId: variantTempId,
      },
    ],
    units: [
      {
        isBaseUnit: true,
        conversionRate: 1,
        variantUnits: [
          {
            tempId: variantTempId,
          },
        ],
      },
    ],
  };
};

export const getPublic = async ({ refreshToken }: RefreshTokenParams) => {
  try {
    const deviceId = localStorage.getItem("deviceId") || "1";
    const currentStoreCode = sessionStorage.getItem("currentStoreCode") || "";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const res = await fetch(`${BASE_URL}/${publicRoutesName.refreshToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-device-id": deviceId || "",
        "x-timezone": timeZone,
        "x-store-code": currentStoreCode,
      },
      credentials: "include", // tương đương withCredentials: true
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      // đọc message backend nếu có
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || "Refresh token failed");
    }

    const data = await res.json();
    const loginData = data?.data;

    if (loginData) {
      localStorage.setItem("loginData", JSON.stringify(loginData));
      sessionStorage.setItem("loginData", JSON.stringify(loginData));
    }

    return loginData;
  } catch (error) {
    console.error("refreshAuthToken failed:", error);
    throw error;
  }
};

// Tính toán giá từ lines
export const calculatePricesFromLines = (lines: any[] = []) => {
  const laborUnitPrice = lines
    .filter((l) => l.type === "LABOR")
    .reduce((sum, l) => sum + (l.normQuantity * (l?.unitPrice ?? 0) || 0), 0);

  const equipmentUnitPrice = lines
    .filter((l) => l.type === "EQUIPMENT")
    .reduce((sum, l) => sum + (l.normQuantity * (l?.unitPrice ?? 0) || 0), 0);
  const materialUnitPrice = lines
    .filter((l) => l.type === "MATERIAL")
    .reduce((sum, l) => sum + (l.normQuantity * (l?.unitPrice ?? 0) || 0), 0);

  return { laborUnitPrice, equipmentUnitPrice, materialUnitPrice };
};

// Cập nhật lại giá từ lines hiện tại trong form
export const updatePricesFromCurrentLines = (
  form: any,
  sectionIndex: number,
  taskIndex: number,
) => {
  const basePath = ["sections", sectionIndex, "tasks", taskIndex];
  const lines = form.getFieldValue([...basePath, "lines"]) || [];
  const { laborUnitPrice, equipmentUnitPrice, materialUnitPrice } = calculatePricesFromLines(lines);

  form.setFields([
    { name: [...basePath, "materialUnitPrice"], value: materialUnitPrice || 0 },
    { name: [...basePath, "laborUnitPrice"], value: laborUnitPrice },
    { name: [...basePath, "equipmentUnitPrice"], value: equipmentUnitPrice },
  ]);
};

// Tính thành tiền = khối lượng × đơn giá × hệ số điều chỉnh
export const calculateAmount = (
  quantity: number = 0,
  price: number = 0,
  factor: number = 1,
): number => {
  const q = Number(quantity) || 0;
  const p = Number(price) || 0;
  const f = Number(factor) || 1;
  return q * p * f;
};

// Thu thập productVariant từ lines
export const collectProductVariantFromLines = (
  lines: {
    productVariantId?: string | null;
    productVariant?: IProductVariant | null;
    lineType?: OrderLineTypeEnum;
    [key: string]: any;
  }[] = [],
): IProductVariant[] => {
  const variants: IProductVariant[] = [];
  lines.forEach((line) => {
    if (
      line.productVariantId &&
      line.productVariant &&
      line.lineType !== OrderLineTypeEnum.RETURN
    ) {
      variants.push(line.productVariant);
    }
  });

  return variants;
};

export const collectTypeInPoductTypes = (productTypes: IProductType[] = []): IAttribute[] => {
  const types: IAttribute[] = [];
  productTypes.forEach((pt) => {
    if (pt.type) {
      types.push(pt.type);
    }
  });
  return types;
};

// Biến một chuỗi thành viết tắt in hoa
export const stringToAcronym = (str: string): string => {
  if (!str) return "";
  const words = str.split(" ");
  const acronym = words.map((word) => word.charAt(0).toUpperCase()).join("");
  return acronym;
};

export const getProductCategoryContent = (attribute?: IAttribute | null): string => {
  if (!attribute) return "";

  const names: string[] = [];
  let current: IAttribute | null | undefined = attribute;

  while (current) {
    if (current.name) {
      names.push(current.name);
    }
    current = current.parent;
  }

  return names.reverse().join(" >> ");
};

export const filterPartnersByType = (partners: IPartner[], type: PartnerTypeEnum): IPartner[] => {
  // Lọc các đối tác có type khác với type truyền vào và subtypes cũng không có type đó
  const result: IPartner[] = [];

  partners.forEach((partner) => {
    if (partner.type === type) {
      result.push(partner);
      return;
    }

    const hasSubtype = partner.subTypes.some((subType) => subType.type === type);
    if (hasSubtype) {
      result.push(partner);
    }
  });

  return result;
};

export const filterAttributesByType = (
  attributes: IAttribute[],
  type: AttributeTypeEnum,
): IAttribute[] => {
  const result: IAttribute[] = [];

  attributes.forEach((attribute) => {
    if (attribute.type === type) {
      result.push(attribute);
    }
  });
  return result;
};

export const checkSelection = (): boolean => {
  const selection = window.getSelection();
  if (selection && selection.toString()) return true;
  return false;
};

export function calculateOrderFee(order?: IOrder | null) {
  const lines = order?.lines || [];
  const shippingFee: number = order?.shippingFee || 0;
  const isFreeShipping: boolean = order?.isFreeShipping || false;
  const orderDiscount: number = order?.discountValue || 0;
  const discountType = order?.discountType;
  const result = {
    totalMoney: 0, // tiền hàng gốc
    totalProductDiscount: 0, // giảm giá SP
    totalOrderDiscount: 0, // giảm giá đơn
    totalTaxableAmount: 0, // tiền tính thuế (sau mọi giảm)
    totalVat: 0, // tổng VAT
    totalAmount: 0, // tổng phải trả
  };

  const tempItems: {
    baseAmount: number;
    vatRate: number;
  }[] = [];

  // 1️⃣ Giảm theo sản phẩm
  lines.forEach((item) => {
    const quantity = item.quantity || 0;
    const price = item.unitPrice || 0;
    const vatRate = item.taxRate || 0;

    const money = quantity * price;

    const discountPerUnit =
      item.discountType === DiscountTypeEnum.PERCENT
        ? (price * (item.discountValue || 0)) / 100
        : item.discountValue || 0;

    const productDiscount = quantity * discountPerUnit;
    const baseAmount = money - productDiscount;

    result.totalMoney += money;
    result.totalProductDiscount += productDiscount;

    tempItems.push({
      baseAmount,
      vatRate,
    });
  });

  // 2️⃣ Tổng tiền sau giảm SP (chưa VAT)
  const totalBaseAmount = tempItems.reduce((sum, i) => sum + i.baseAmount, 0);

  // 3️⃣ Tính giảm giá đơn (chưa VAT)
  const orderDiscountAmount =
    discountType === DiscountTypeEnum.PERCENT
      ? (totalBaseAmount * orderDiscount) / 100
      : orderDiscount || 0;

  result.totalOrderDiscount = Math.min(orderDiscountAmount, totalBaseAmount);

  // 4️⃣ Phân bổ giảm giá đơn + tính VAT
  let allocatedSum = 0;

  tempItems.forEach((item, index) => {
    let allocatedDiscount = 0;

    if (index === tempItems.length - 1) {
      allocatedDiscount = result.totalOrderDiscount - allocatedSum;
    } else {
      allocatedDiscount = (item.baseAmount / totalBaseAmount) * result.totalOrderDiscount;

      allocatedDiscount = Math.round(allocatedDiscount);
      allocatedSum += allocatedDiscount;
    }

    const taxableAmount = item.baseAmount - allocatedDiscount;
    const vatAmount = (taxableAmount * item.vatRate) / 100;

    result.totalTaxableAmount += taxableAmount;
    result.totalVat += vatAmount;
  });

  // 5️⃣ Tổng thanh toán
  result.totalAmount =
    result.totalTaxableAmount + result.totalVat + (isFreeShipping ? 0 : shippingFee);

  return result;
}

export const isPhoneNumber = (value?: string) => {
  if (!value) return false;
  return /^[0-9]{9,11}$/.test(value);
};

// Cập nhật số lượng tồn của variant trong các line của order
export const updateVariantStockInOrderLines = async (order: IOrder): Promise<IOrder> => {
  try {
    const deviceId = localStorage.getItem("deviceId") || "1";
    const currentStoreCode = sessionStorage.getItem("currentStoreCode") || "";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const url = `${BASE_URL}${apiEndpoint.sale.updateStock.replace(":orderId", order.id)}`;

    const response = await fetch(url, {
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

    return result?.data?.code;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return order; // Nếu có lỗi, trả về đơn gốc không cập nhật
  }
};

export const getPriceContent = (item: IOrderLine) => {
  if (item.discountValue) {
    const discountedPrice =
      item.discountType === DiscountTypeEnum.PERCENT
        ? item.unitPrice * (1 - item.discountValue / 100)
        : item.unitPrice - item.discountValue;
    item.unitPrice - item.discountValue;
    return `
      <div class="flex gap-1">
        <span>${formatMoney(discountedPrice)}</span>
        <span class="line-through text-gray-400">${formatMoney(item.unitPrice)}</span>
      </div>
      `;
  }

  return `<span>${formatMoney(item.unitPrice)}</span>`;
};

export const connectToInventoryStream = (
  setStreamData: React.Dispatch<React.SetStateAction<InventoryStreamData | undefined>>,
) => {
  const deviceId = localStorage.getItem("deviceId") || "1";
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentStoreCode = sessionStorage.getItem("currentStoreCode") || "";

  const params = new URLSearchParams({
    deviceId,
    timezone: timeZone,
    ...(currentStoreCode && { storeCode: currentStoreCode }),
  });

  const url = `${BASE_URL}${apiEndpoint.inventory.recalculateStream}?${params.toString()}`;

  // ✅ EventSource native - cookies được gửi tự động khi same-site
  const es = new EventSource(url, { withCredentials: true });

  es.onopen = () => {
    console.log("✅ SSE connection opened:", url);
  };

  es.onmessage = (event) => {
    try {
      const data: InventoryStreamData = JSON.parse(event.data);

      if (data) setStreamData(data);
    } catch (error) {
      console.error("❌ Error parsing SSE data:", error);
    }
  };

  es.onerror = (error) => {
    console.error("❌ SSE error:", error);

    es.close();
  };
};

export const generateCashTooltipContent = (
  ashSnapshot?: Record<CashKey, number> | null,
): string => {
  if (!ashSnapshot) return "Không có dữ liệu chi tiết";

  const denominations: CashKey[] = [
    "500000",
    "200000",
    "100000",
    "50000",
    "20000",
    "10000",
    "5000",
    "2000",
    "1000",
  ];

  const contentLines: string[] = [];
  denominations.forEach((denom) => {
    const count = ashSnapshot[denom] || 0;
    if (count > 0) {
      contentLines.push(`${formatQuantity(Number(denom))} VND: ${formatQuantity(count)} tờ`);
    }
  });

  return contentLines.join("\n");
};

export const generateChecklistTooltipContent = (
  checklist: Record<string, boolean> | null,
): string => {
  if (!checklist) return "Không có dữ liệu chi tiết";

  const contentLines = CHECKLIST_KEY.map((key) => {
    const status = checklist[key] ? "✓" : "✗";
    return `${checklistKeyMap[key]}: ${status}`;
  });

  return contentLines.join("\n");
};
