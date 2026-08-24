export enum AttributeType {
  // Legacy values kept for old screens until those modules are removed.
  OPERATION = "operation",
  JOB_TITLE = "job_title",

  UNIT = "unit",
  PRODUCT_GROUP = "product_group",
  BRAND = "brand",
  LOCATION = "location",

  INCOME_CATEGORY = "income_category",
  EXPENSE_CATEGORY = "expense_category",

  CUSTOMER_GROUP = "customer_group",
  SUPPLIER_GROUP = "supplier_group",
  SHIPPER_GROUP = "shipper_group",

  // Legacy product/partner group values.
  FINISHED_GROUP = "finished_group",
  MAIN_MATERIAL_GROUP = "main_material_group",
  SUB_MATERIAL_GROUP = "sub_material_group",
  TOOLS_GROUP = "tools_group",
  PARTNER_GROUP = "partner_group",
}

import { getOptionsByMap } from "../../shared/constants/enum";

export const attributeTypeMap: Record<AttributeType, string> = {
  [AttributeType.OPERATION]: "Công đoạn sản xuất",
  [AttributeType.JOB_TITLE]: "Chức danh",
  [AttributeType.UNIT]: "Đơn vị tính",
  [AttributeType.PRODUCT_GROUP]: "Nhóm sản phẩm",
  [AttributeType.BRAND]: "Thương hiệu",
  [AttributeType.LOCATION]: "Vị trí kho/kệ",
  [AttributeType.INCOME_CATEGORY]: "Hạng mục thu",
  [AttributeType.EXPENSE_CATEGORY]: "Hạng mục chi",
  [AttributeType.CUSTOMER_GROUP]: "Nhóm khách hàng",
  [AttributeType.SUPPLIER_GROUP]: "Nhóm nhà cung cấp",
  [AttributeType.SHIPPER_GROUP]: "Nhóm đơn vị vận chuyển",
  [AttributeType.FINISHED_GROUP]: "Nhóm thành phẩm",
  [AttributeType.MAIN_MATERIAL_GROUP]: "Nhóm nguyên vật liệu",
  [AttributeType.SUB_MATERIAL_GROUP]: "Nhóm nguyên vật liệu phụ",
  [AttributeType.TOOLS_GROUP]: "Nhóm công cụ dụng cụ",
  [AttributeType.PARTNER_GROUP]: "Nhóm đối tác",
};

export const attributeTypeOptions = getOptionsByMap(attributeTypeMap);

/** Các loại thuộc tính phải thuộc đúng cửa hàng đang được chọn. */
export const STORE_SCOPED_ATTRIBUTE_TYPES: readonly AttributeType[] = [
  AttributeType.LOCATION,
];

export const isStoreScopedAttributeType = (
  type?: AttributeType | null,
): boolean =>
  type ? STORE_SCOPED_ATTRIBUTE_TYPES.includes(type) : false;

export const VAT_CATEGORY_NAME = "Nộp thuế VAT";
export const INCOME_SALE_CATEGORY_NAME = "Thu tiền khách hàng";
export const INCOME_PURCHASE_CATEGORY_NAME = "NCC hoàn tiền";
export const EXPENSE_PURCHASE_CATEGORY_NAME = "Trả tiền NCC";
export const EXPENSE_SALE_CATEGORY_NAME = "Hoàn tiền khách hàng";

export const SHIPPING_PROVIDER_GROUP_NAME = "Đơn vị vận chuyển";
