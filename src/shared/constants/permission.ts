/** Permission modules — single source of truth matching BE permission.middleware.ts. */
export const MODULES = [
  "report", "debtReport", "inventoryReport", "fundReport", "vatReport",
  "sale", "saleReturn", "purchase", "purchaseReturn", "storeTransfer", "inventoryAdjustment",
  "income", "expense", "fund", "fundAdjustment", "fundTransfer", "debtAdjustment", "vatAdjustment",
  "customer", "supplier", "shipper", "product", "store", "user", "role", "attribute",
] as const;
export type Module = (typeof MODULES)[number];

export const PERMISSIONS = ["create", "read", "update", "delete", "approve", "complete"] as const;
export type Permission = (typeof PERMISSIONS)[number] | "readAll" | "customerApprove" | "confirmExport" | "confirmImport" | "enter" | "exit" | "link";
export type PermissionStructure = { [key in Module]?: Permission[] };

export const ReadOnlyModules: Module[] = ["report", "debtReport", "inventoryReport", "fundReport", "vatReport"];
export const ReadAllModules: Module[] = [];
export const ApprovalModules: Module[] = [];
export const CustomerApprovalModules: Module[] = [];
export const ConfirmExportModules: Module[] = [];
export const ConfirmImportModules: Module[] = [];
export const CompleteModules: Module[] = ["sale", "saleReturn"];

export const readPermissionFallbackMap: Partial<Record<Module, Module[]>> = {
  product: ["sale", "saleReturn", "purchase", "purchaseReturn", "inventoryAdjustment", "storeTransfer"],
  customer: ["sale", "saleReturn"],
  supplier: ["purchase", "purchaseReturn"],
  fund: ["fundTransfer", "fundAdjustment"],
};

export const moduleMap: Record<Module, string> = {
  report: "Báo cáo tổng quan", debtReport: "Báo cáo công nợ", inventoryReport: "Báo cáo tồn kho", fundReport: "Báo cáo quỹ", vatReport: "Báo cáo VAT",
  sale: "Bán hàng", saleReturn: "Đổi trả hàng", purchase: "Nhập hàng", purchaseReturn: "Đổi trả hàng nhập", storeTransfer: "Chuyển cửa hàng", inventoryAdjustment: "Điều chỉnh tồn kho",
  income: "Thu tiền", expense: "Chi tiền", fund: "Quỹ", fundAdjustment: "Điều chỉnh quỹ", fundTransfer: "Chuyển quỹ", debtAdjustment: "Điều chỉnh công nợ", vatAdjustment: "Điều chỉnh VAT",
  customer: "Khách hàng", supplier: "Nhà cung cấp", shipper: "Đơn vị vận chuyển", product: "Sản phẩm", store: "Cửa hàng", user: "Người dùng", role: "Vai trò", attribute: "Thuộc tính",
};
export const permissionMap: Record<string, string> = { read: "Xem", create: "Thêm", update: "Sửa", delete: "Xóa", approve: "Duyệt", complete: "Hoàn tất", readAll: "Xem tất cả", customerApprove: "Khách hàng duyệt", confirmExport: "Xác nhận xuất", confirmImport: "Xác nhận nhập", enter: "Xe vào", exit: "Xe ra", link: "Liên kết" };

export const role: { title: string; modules: Module[] }[] = [
  { title: "Báo cáo", modules: ["report", "debtReport", "inventoryReport", "fundReport", "vatReport"] },
  { title: "Bán hàng", modules: ["sale", "saleReturn"] },
  { title: "Nhập hàng", modules: ["purchase", "purchaseReturn"] },
  { title: "Kho", modules: ["storeTransfer", "inventoryAdjustment"] },
  { title: "Tài chính", modules: ["income", "expense", "fund", "fundAdjustment", "fundTransfer", "debtAdjustment", "vatAdjustment"] },
  { title: "Đối tác", modules: ["customer", "supplier", "shipper"] },
  { title: "Thiết lập", modules: ["product", "store", "user", "role", "attribute"] },
];

export function getPermissionOptions(module: Module): { value: Permission; label: string }[] {
  const permissions: Permission[] = ReadOnlyModules.includes(module)
    ? ["read"]
    : ["read", "create", "update", "delete"];
  if (CompleteModules.includes(module)) permissions.push("complete");
  return permissions.map((value) => ({ value, label: permissionMap[value] }));
}
