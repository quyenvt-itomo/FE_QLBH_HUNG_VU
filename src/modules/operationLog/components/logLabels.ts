import { logActionMapping, targetEntityMapping } from "../operationLog.model";

const collectionStatusMap: Record<string, string> = {};

/**
 * Map key trường (path trong targetSnapshot / changes) -> nhãn tiếng Việt dễ hiểu.
 * Áp dụng cho mọi entity; nếu path không nằm trong map thì sẽ tự chuyển camelCase/snake_case
 * thành dạng dễ đọc ở fallback.
 */
export const COMMON_LABELS: Record<string, string> = {
  id: "Mã hệ thống",
  code: "Mã",
  name: "Tên",
  note: "Ghi chú",
  amount: "Số tiền",
  total: "Tổng tiền",
  totalAmount: "Tổng tiền",
  status: "Trạng thái",
  type: "Loại",
  isActive: "Đang hoạt động",
  createdAt: "Ngày tạo",
  updatedAt: "Ngày cập nhật",
  deletedAt: "Ngày xóa",
  creatorId: "Người tạo",
  updaterId: "Người cập nhật",
  branchId: "Chi nhánh",
  requestId: "Mã yêu cầu",
  actorId: "Người thao tác",
  targetId: "Đối tượng",
  phone: "Số điện thoại",
  email: "Email",
  address: "Địa chỉ",
  description: "Mô tả",

  // Actor snapshot
  "actorSnapshot.name": "Tên nhân viên",
  "actorSnapshot.code": "Mã nhân viên",
  "actorSnapshot.email": "Email",
  "actorSnapshot.phone": "Số điện thoại",
  "actorSnapshot.roleId": "Vai trò",
  "actorSnapshot.branchId": "Chi nhánh",
};

/**
 * Map nhãn riêng cho từng targetEntity. Key là path đầy đủ trong snapshot.
 * Khi render diff hoặc snapshot, hàm `getFieldLabel` sẽ tra cứu theo thứ tự:
 *   1. label riêng của entity
 *   2. label chung (COMMON_LABELS)
 *   3. fallback: chuyển camelCase/snake_case thành Title Case
 */
export const ENTITY_LABELS: Record<string, Record<string, string>> = {
  user: {
    code: "Mã nhân viên",
    name: "Họ tên",
    email: "Email",
    phone: "Số điện thoại",
    username: "Tài khoản",
    roleId: "Vai trò",
    branchId: "Chi nhánh",
    isActive: "Đang hoạt động",
  },
  employee: {
    code: "Mã nhân viên",
    name: "Họ tên",
    phone: "Số điện thoại",
    email: "Email",
    gender: "Giới tính",
    dob: "Ngày sinh",
    identityNumber: "CMND/CCCD",
    address: "Địa chỉ",
    branchId: "Chi nhánh",
    position: "Chức vụ",
    startDate: "Ngày vào làm",
    isActive: "Đang hoạt động",
  },
  role: {
    name: "Tên vai trò",
    description: "Mô tả",
    isActive: "Đang hoạt động",
  },
  branch: {
    code: "Mã chi nhánh",
    name: "Tên chi nhánh",
    address: "Địa chỉ",
    phone: "Số điện thoại",
    managerId: "Quản lý",
    isActive: "Đang hoạt động",
  },
  company: {
    name: "Tên công ty",
    code: "Mã công ty",
    taxCode: "Mã số thuế",
    address: "Địa chỉ",
    phone: "Số điện thoại",
    email: "Email",
    website: "Website",
    logo: "Logo",
    isActive: "Đang hoạt động",
  },
  product: {
    code: "Mã sản phẩm",
    name: "Tên sản phẩm",
    categoryId: "Danh mục",
    unitId: "Đơn vị tính",
    price: "Giá bán",
    cost: "Giá vốn",
    description: "Mô tả",
    isActive: "Đang hoạt động",
  },
  priceList: {
    code: "Mã bảng giá",
    name: "Tên bảng giá",
    type: "Loại bảng giá",
    startDate: "Ngày hiệu lực",
    endDate: "Ngày hết hạn",
    isActive: "Đang hoạt động",
  },
  billOfMaterial: {
    code: "Mã định mức",
    productId: "Sản phẩm đầu ra",
    quantity: "Số lượng",
    unitId: "Đơn vị tính",
    note: "Ghi chú",
  },
  partner: {
    code: "Mã đối tác",
    name: "Tên đối tác",
    type: "Loại đối tác",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    taxCode: "Mã số thuế",
    debtAmount: "Công nợ",
    isActive: "Đang hoạt động",
  },
  warehouse: {
    code: "Mã kho",
    name: "Tên kho",
    address: "Địa chỉ",
    branchId: "Chi nhánh",
    managerId: "Quản lý",
    isActive: "Đang hoạt động",
  },
  purchase: {
    code: "Mã đơn mua",
    supplierId: "Nhà cung cấp",
    warehouseId: "Kho nhập",
    totalAmount: "Tổng tiền",
    paidAmount: "Đã thanh toán",
    debtAmount: "Còn nợ",
    status: "Trạng thái",
    note: "Ghi chú",
    orderDate: "Ngày đặt",
    expectedDate: "Ngày dự kiến",
  },
  salesOrder: {
    code: "Mã đơn hàng",
    customerId: "Khách hàng",
    warehouseId: "Kho xuất",
    totalAmount: "Tổng tiền",
    paidAmount: "Đã thanh toán",
    debtAmount: "Còn nợ",
    status: "Trạng thái",
    note: "Ghi chú",
    orderDate: "Ngày đặt",
    deliveryDate: "Ngày giao",
  },
  directSale: {
    code: "Mã đơn bán",
    customerId: "Khách hàng",
    totalAmount: "Tổng tiền",
    paidAmount: "Đã thanh toán",
    status: "Trạng thái",
    note: "Ghi chú",
    orderDate: "Ngày bán",
  },
  production: {
    code: "Mã lệnh SX",
    productId: "Sản phẩm",
    quantity: "Số lượng",
    startDate: "Ngày bắt đầu",
    expectedCompletedAt: "Ngày dự kiến HT",
    status: "Trạng thái",
    note: "Ghi chú",
  },
  stockDocument: {
    code: "Mã phiếu kho",
    type: "Loại phiếu",
    warehouseId: "Kho",
    totalAmount: "Tổng tiền",
    status: "Trạng thái",
    note: "Ghi chú",
    referenceType: "Loại tham chiếu",
    referenceId: "Mã tham chiếu",
  },
  warehouseTransfer: {
    code: "Mã phiếu chuyển",
    fromWarehouseId: "Kho gửi",
    toWarehouseId: "Kho nhận",
    totalAmount: "Tổng tiền",
    status: "Trạng thái",
    note: "Ghi chú",
  },
  inventoryAdjustment: {
    code: "Mã phiếu kiểm",
    warehouseId: "Kho",
    status: "Trạng thái",
    note: "Ghi chú",
  },
  inventoryLot: {
    code: "Mã LOT",
    productId: "Sản phẩm",
    warehouseId: "Kho",
    quantity: "Số lượng",
    expiryDate: "Ngày hết hạn",
    status: "Trạng thái",
    note: "Ghi chú",
  },
  fund: {
    code: "Mã quỹ",
    name: "Tên quỹ",
    balance: "Số dư",
    branchId: "Chi nhánh",
    isActive: "Đang hoạt động",
  },
  incomeExpense: {
    code: "Mã phiếu",
    type: "Loại (Thu/Chi)",
    fundId: "Quỹ",
    categoryId: "Danh mục",
    amount: "Số tiền",
    date: "Ngày hạch toán",
    note: "Ghi chú",
    branchId: "Chi nhánh",
  },
  attribute: {
    code: "Mã thuộc tính",
    name: "Tên thuộc tính",
    type: "Loại",
    isActive: "Đang hoạt động",
  },
};

const STATUS_MAPS: Record<string, Record<string, string>> = {};

/** Map snake_case / camelCase -> Title Case tiếng Việt fallback */
export function humanizeFieldName(field: string): string {
  if (!field) return "";
  const cleaned = field
    .replace(/[._]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .toLowerCase()
    .trim();
  return cleaned
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** Tra cứu nhãn tiếng Việt cho một field path theo entity */
export function getFieldLabel(entity: string | null | undefined, path: string): string {
  const e = (entity || "").toLowerCase();
  const entityMap = ENTITY_LABELS[e] || {};
  if (entityMap[path]) return entityMap[path];
  if (COMMON_LABELS[path]) return COMMON_LABELS[path];

  // Thử khớp theo phần cuối của path (vd: "items.0.amount" -> "amount")
  const last = path.split(".").pop() || path;
  if (entityMap[last]) return entityMap[last];
  if (COMMON_LABELS[last]) return COMMON_LABELS[last];
  return humanizeFieldName(last);
}

/** Tra cứu giá trị enum -> nhãn tiếng Việt */
export function getEnumLabel(
  entity: string | null | undefined,
  field: string,
  value: unknown,
): string {
  if (value === null || value === undefined || value === "") return "—";
  const e = (entity || "").toLowerCase();
  const map = STATUS_MAPS[e];
  if (map && typeof value === "string" && map[value]) return map[value];
  if (typeof value === "boolean") return value ? "Có" : "Không";
  return String(value);
}

export function getEntityLabel(entity: string | null | undefined): string {
  if (!entity) return "—";
  return targetEntityMapping[entity] || humanizeFieldName(entity);
}

export function getActionLabel(action: string | null | undefined): string {
  if (!action) return "—";
  return logActionMapping[action] || humanizeFieldName(action);
}
