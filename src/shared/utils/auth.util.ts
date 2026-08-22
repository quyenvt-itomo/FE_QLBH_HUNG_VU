import { NavigateFunction } from "react-router-dom";
import { privateRoutesName } from "../constants/routerName";

const REDIRECT_PATH_KEY = "redirectPath";

/**
 * Lưu lại đường dẫn người dùng muốn truy cập trước khi bị chuyển hướng tới trang auth.
 */
export const saveRedirectPath = (path: string) => {
  if (!path) return;
  sessionStorage.setItem(REDIRECT_PATH_KEY, path);
};

/**
 * Đọc và xoá đường dẫn redirect đã lưu.
 */
export const consumeRedirectPath = (): string | null => {
  const path = sessionStorage.getItem(REDIRECT_PATH_KEY);
  if (path) {
    sessionStorage.removeItem(REDIRECT_PATH_KEY);
  }
  return path;
};

/**
 * Chuyển hướng người dùng về trang đích sau khi đăng nhập thành công.
 * Ưu tiên đường dẫn đã lưu trước đó, mặc định về dashboard.
 */
export const redirectAfterAuth = (navigate: NavigateFunction) => {
  const target = consumeRedirectPath() ?? privateRoutesName.dashboard;
  navigate(target, { replace: true });
};

/**
 * Lưu dữ liệu đăng nhập vào local/session storage tuỳ theo rememberMe.
 */
export const persistLoginData = (data: unknown, rememberMe: boolean) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("loginData", JSON.stringify(data));
};

/**
 * Xoá toàn bộ dữ liệu đăng nhập trong cả hai storage.
 */
export const clearLoginData = () => {
  localStorage.removeItem("loginData");
  sessionStorage.removeItem("loginData");
};

/**
 * Validate trường username cho AntD Form.
 */
export const usernameRules = [
  { required: true, message: "Vui lòng nhập tên đăng nhập" },
] as const;

/**
 * Validate trường password cho AntD Form.
 */
export const passwordRules = [
  { required: true, message: "Vui lòng nhập mật khẩu" },
  { min: 6, message: "Mật khẩu cần tối thiểu 6 ký tự" },
  { pattern: /^\S*$/, message: "Mật khẩu không được chứa khoảng trắng" },
] as const;

/**
 * Validate trường email cho AntD Form.
 */
export const emailRules = [
  { required: true, message: "Vui lòng nhập email" },
  { type: "email" as const, message: "Email không đúng định dạng" },
];
