import axios from "axios";
import { publicRoutesName } from "../constants/routerName";
import { BASE_URL } from "../constants/apiEndpoint";
import { getInitialCurrentCompany } from "../stores/global.slice";

const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function attachInfo(config: any) {
  const currentCompany = getInitialCurrentCompany();
  const deviceId = localStorage.getItem("deviceId") || "1";
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const ipAddress = sessionStorage.getItem("ipAddress");

  return {
    ...config,
    headers: {
      ...config.headers,
      "x-company-id": currentCompany?.id,
      "x-device-id": deviceId,
      "x-timezone": timeZone,
      "x-ip-address": ipAddress,
    },
  };
}

apiInstance.interceptors.request.use(
  (config) => attachInfo(config),
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
