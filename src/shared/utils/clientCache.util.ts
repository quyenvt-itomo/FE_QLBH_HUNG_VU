const CLIENT_CACHE_VERSION_KEY = "hungvu-client-cache-version";
const CLIENT_CACHE_VERSION_COOKIE = "hungvu-client-cache-version";
const CLIENT_CACHE_VERSION = "10.09.2026";

// Giữ lại các dữ liệu cần thiết để người dùng không bị đăng xuất khi reset cache.
const PRESERVED_LOCAL_STORAGE_KEYS = new Set([
  "loginData",
  "deviceId",
  "themeMode",
  "currentStore",
]);
const PRESERVED_SESSION_STORAGE_KEYS = new Set(["loginData", "lastUsername"]);

const getCookie = (name: string): string | null => {
  const prefix = `${encodeURIComponent(name)}=`;
  const item = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix));

  return item ? decodeURIComponent(item.slice(prefix.length)) : null;
};

const setCookie = (name: string, value: string) => {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value,
  )}; path=/; max-age=31536000; samesite=lax`;
};

const clearStorageExcept = (storage: Storage, preservedKeys: Set<string>) => {
  Object.keys(storage).forEach((key) => {
    if (!preservedKeys.has(key)) {
      storage.removeItem(key);
    }
  });
};

/**
 * Xoá cache giao diện khi phiên bản frontend thay đổi.
 * Cập nhật VITE_CLIENT_CACHE_VERSION trong mỗi lần release cần reset cache.
 * Cookie phiên đăng nhập của server (đặc biệt HttpOnly) không bị can thiệp.
 */
export const ensureClientCacheVersion = () => {
  if (typeof window === "undefined") return;

  const storageVersion = localStorage.getItem(CLIENT_CACHE_VERSION_KEY);
  const cookieVersion = getCookie(CLIENT_CACHE_VERSION_COOKIE);
  const hasCurrentVersion =
    storageVersion === CLIENT_CACHE_VERSION || cookieVersion === CLIENT_CACHE_VERSION;

  if (!hasCurrentVersion) {
    clearStorageExcept(localStorage, PRESERVED_LOCAL_STORAGE_KEYS);
    clearStorageExcept(sessionStorage, PRESERVED_SESSION_STORAGE_KEYS);
  }

  localStorage.setItem(CLIENT_CACHE_VERSION_KEY, CLIENT_CACHE_VERSION);
  setCookie(CLIENT_CACHE_VERSION_COOKIE, CLIENT_CACHE_VERSION);
};
