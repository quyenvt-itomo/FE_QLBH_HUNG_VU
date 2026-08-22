export enum AttributeType {
  OPERATION = "operation", // công đoạn sản xuất
  UNIT = "unit", // đơn vị tính
  JOB_TITLE = "job_title", // chuc vu

  INCOME_CATEGORY = "income_category", // loại thu
  EXPENSE_CATEGORY = "expense_category", // loại chi

  // Nhóm hàng hóa
  FINISHED_GROUP = "finished_group", // nhóm thành phẩm
  MAIN_MATERIAL_GROUP = "main_material_group", // nhóm nguyên vật liệu
  SUB_MATERIAL_GROUP = "sub_material_group", // nhóm nguyên vật liệu phụ
  TOOLS_GROUP = "tools_group", // nhóm công cụ dụng cụ

  PARTNER_GROUP = "partner_group",
}

import { getOptionsByMap } from "@/shared/constants/enum";
export const attributeTypeMap: Record<AttributeType, string> = {
  [AttributeType.OPERATION]: "Công đoạn sản xuất",
  [AttributeType.UNIT]: "Đơn vị tính",
  [AttributeType.JOB_TITLE]: "Chức danh",
  [AttributeType.INCOME_CATEGORY]: "Loại thu",
  [AttributeType.EXPENSE_CATEGORY]: "Loại chi",
  [AttributeType.FINISHED_GROUP]: "Nhóm thành phẩm",
  [AttributeType.MAIN_MATERIAL_GROUP]: "Nhóm NVL chính",
  [AttributeType.SUB_MATERIAL_GROUP]: "Nhóm NVL phụ",
  [AttributeType.TOOLS_GROUP]: "Nhóm CCDC",
  [AttributeType.PARTNER_GROUP]: "Nhóm đối tác",
};

export const attributeTypeOptions = getOptionsByMap(attributeTypeMap);

export const VAT_CATEGORY_NAME = "Nộp thuế VAT";
export const INCOME_SALE_CATEGORY_NAME = "Thu tiền khách hàng";
export const INCOME_PURCHASE_CATEGORY_NAME = "NCC hoàn tiền";
export const EXPENSE_PURCHASE_CATEGORY_NAME = "Trả tiền NCC";
export const EXPENSE_SALE_CATEGORY_NAME = "Hoàn tiền khách hàng";

export const SHIPPING_PROVIDER_GROUP_NAME = "Đơn vị vận chuyển";
