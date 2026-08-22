import axios from "axios";
import { BASE_URL } from "../constants/ApiEndpoint";
import { publicRoutesName } from "../constants/routerName";

const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function attachDeviceId(config: any) {
  const deviceId = localStorage.getItem("deviceId") || "1";
  const currentStoreCode = sessionStorage.getItem("currentStoreCode") || "";
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const ipAddress = sessionStorage.getItem("ipAddress");
  // const response = await getIpAddress();
  // const ipAddress = response?.data?.ip;
  if (deviceId) {
    return {
      ...config,
      headers: {
        ...config.headers,
        "x-device-id": deviceId,
        "x-timezone": timeZone,
        "x-ip-address": ipAddress,
        "x-store-code": currentStoreCode,
      },
    };
  }
  return config;
}

apiInstance.interceptors.request.use(
  (config) => attachDeviceId(config),
  (error) => Promise.reject(error),
);

let isSessionExpired = false;

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      const { status = 500 } = response || {};

      if ((status === 401 || status === 403) && !isSessionExpired) {
        isSessionExpired = true;

        // Xóa thông tin đăng nhập
        localStorage.removeItem("loginData");
        localStorage.removeItem("data");
        sessionStorage.removeItem("loginData");
        sessionStorage.removeItem("currentStoreCode");

        if (!window.location.href.includes(publicRoutesName.login)) {
          if (status === 401) {
            const redirectPath =
              window.location.pathname + window.location.search + window.location.hash;
            sessionStorage.setItem("redirectPath", redirectPath);
          }
          setTimeout(() => {
            window.location.href = publicRoutesName.login;
          }, 2000);
          console.log({ response });
        }

        return Promise.reject({
          ...error,
          response: {
            ...response,
            message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
          },
        });
      }
    }

    return Promise.reject(error);
  },
);

export default apiInstance;
