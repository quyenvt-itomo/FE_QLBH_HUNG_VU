import { Entity, UserSnapshot } from "@/shared/base/entity";
import { ApiRequestQuery, BaseError } from "@/shared/interfaces/api";
import { User } from "../user";

export interface OperationLogQuery extends ApiRequestQuery {
  moreQuery?: any;
  targetEntity?: string;
  targetId?: string;
  action?: string;
  creatorId?: string;
  success?: boolean;
  startAt?: string;
  endAt?: string;
}

export interface OperationChangeItem {
  path: string;
  before: unknown;
  after: unknown;
}

export interface OperationErrorItem {
  name?: string;
  message: string;
  statusCode?: number;
  code?: string | number;
  errors?: BaseError[];
  stack?: string;
}

export interface OperationLog extends Entity {
  action: string;
  targetEntity: string;
  targetId: string | null;
  requestBody: Record<string, unknown> | null;
  targetSnapshot: Record<string, unknown> | null;
  changes: OperationChangeItem[] | null;
  actorId: string | null;
  actor: User;
  actorSnapshot: UserSnapshot | null;
  requestId: string | null;
  method: string | null;
  endpoint: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
  error: OperationErrorItem | null;
  metadata: Record<string, unknown> | null;
}

export const logActionMapping: Record<string, string> = {
  create: "Tạo mới",
  update: "Cập nhật",
  delete: "Xóa",
  login: "Đăng nhập",
  logout: "Đăng xuất",
  cancel: "Hủy",
  start: "Bắt đầu",
  complete: "Hoàn thành",
  approve: "Duyệt",
  accept: "Tiếp nhận",
  reject: "Từ chối",
  confirm: "Xác nhận",
  updateInfo: "Cập nhật thông tin cá nhân",
  changePassword: "Đổi mật khẩu",
  verify: "Xác thực",
  upload: "Tải lên",
  setMain: "Đặt làm File chính",
  sync: "Đồng bộ",
  retry: "Thử lại",
  confirmPayment: "Xác nhận đã thanh toán",
  clearQueue: "Xóa khỏi hàng đợi",
  export: "Xuất dữ liệu",
  import: "Nhập dữ liệu",
};

export const targetEntityMapping: Record<string, string> = {
  user: "Người dùng",
  role: "Vai trò",
  employee: "Nhân viên",
  company: "Công ty",
  branch: "Chi nhánh",
  product: "Sản phẩm",
  priceList: "Bảng giá",
  billOfMaterial: "Định mức BOM",
  partner: "Đối tác",
  warehouse: "Kho",
  attribute: "Danh mục",
  purchase: "Đơn mua",
  production: "Lệnh sản xuất",
  salesOrder: "Đơn đặt hàng",
  directSale: "Đơn bán trực tiếp",
  order: "Đơn hàng",
  stockDocument: "Phiếu kho",
  warehouseTransfer: "Chuyển kho",
  inventoryAdjustment: "Kiểm kê",
  inventoryLot: "Quản lý LOT",
  fund: "Quỹ",
  incomeExpense: "Thu chi",
  payableDebtAdjustment: "ĐCCN phải trả",
  receivableDebtAdjustment: "ĐCCN phải thu",
  debtOffset: "Đối trừ công nợ",
  log: "Nhật ký thao tác",
  report: "Báo cáo",
};
