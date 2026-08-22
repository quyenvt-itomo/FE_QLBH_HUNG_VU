import { IStore } from "../store";
import { IUser } from "../user";
import { FormatData } from "./format";
import { IRole } from "../store/role";
import { ISystemRole } from "../systemRole";
import { PermissionStructure } from "../../constants/permission";
import { IFund } from "../fund";
import { IShift } from "../store/shift";

// TODO: Đăng nhập
export interface LoginRequest {
  identifier: string;
  password: string;
}

// TODO: Đăng ký
export interface RegisterRequest {
  email: string;
}

// TODO: Quên mật khẩu
export interface ForgotPasswordRequest {
  email: string;
}

// TODO: Xác thực OTP
export interface VerifyOtpRequest {
  otp: string;
}

// TODO: Xác nhận mật khẩu mới / Xác thực đăng ký
export interface ConfirmPasswordRequest {
  password: string;
  isLogout?: boolean; // TODO: Nếu là xác nhận mật khẩu mới thì có thể đăng xuất tất cả phiên đăng nhập
  storeCode?: string;
  storeName?: string;
}

// TODO: Đặt lại mật khẩu
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  isLogout?: boolean;
}

// TODO: Dữ liệu đăng nhập thành công
export interface LoginData {
  id: string; // ID của người dùng
  username: string; // Tên đăng nhập
  name: string; // Họ và tên đầy đủ
  email: string; // Email của người dùng
  phone: string | null; // Số điện thoại (nullable)
  departmentId: string | null; // ID phòng ban (nullable)
  avatar: string | null; // Ảnh đại diện (nullable)
  role: string; // Vai trò của người dùng (VD: ADMIN, USER, v.v.)
  accessToken: string; // Token xác thực
  refreshToken: string; // Token refresh
}
export interface LogoutRequest {
  username: string;
  password: string;
}

// TODO: Dữ liệu cài đặt người dùng
export interface SettingData {}

// TODO: Thông tin người dùng khi getInfo
export interface UserInfo extends IUser {
  format: FormatData;
  settings: FormatData;
  role: IRole | null;
  permissions: PermissionStructure | null;
  systemRole?: ISystemRole | null;
  systemPermissions?: PermissionStructure | null;
  currentStore?: IStore | null;
  stores: IStore[];
  defaultFund: IFund | null;
  currentShift?: IShift | null;
}
