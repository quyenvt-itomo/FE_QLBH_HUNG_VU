import dayjs from "dayjs";
import { apiEndpoint } from "../constants/ApiEndpoint";
import { setIpAddress } from "../utils/common";
import apiInstance from "./apiInstance";
import { ApiResponse } from "../models/base/api";

const getMessage = (statusCode: number): string | null => {
  if (statusCode === 401 || statusCode === 403) {
    return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.";
  }
  return null;
};

const throwError = (error: any) => {
  const { statusCode = 500, message = "Máy chủ gặp sự cố", errors } = error.response?.data || {};
  return {
    statusCode,
    message: getMessage(statusCode) || message,
    errors: statusCode === 401 || statusCode === 403 ? [] : errors,
  };
};

export const parseDynamicParams = (
  url: string,
  payload: any,
): { url: string; errorResponse?: ApiResponse } => {
  try {
    const pattern = /:([a-zA-Z0-9_]+Id)/g;

    let match;
    let newUrl = url;
    while ((match = pattern.exec(url)) !== null) {
      const key = match[1]; // vd: productId
      if (!payload || typeof payload[key] !== "string") {
        return {
          url,
          errorResponse: {
            statusCode: 400,
            success: false,
            message: `${key}.missing`,
            menu: [],
            detailError: [{ key, message: `${key}.missing` }],
          },
        };
      }

      // thay vào url
      newUrl = newUrl.replace(`:${key}`, payload[key]);
      delete payload[key]; // xoá khỏi body/params để tránh bị gửi đi
    }
    return { url: newUrl };
  } catch (error) {
    console.error("Error parsing dynamic params:", error);
    return {
      url,
      errorResponse: {
        statusCode: 500,
        success: false,
        message: "url.parsing.error",
        menu: [],
        detailError: [{ key: "url", message: "url.parsing.error" }],
      },
    };
  }
};

// Hàm GET
export const getData = async <T>(url: string, params?: any) => {
  try {
    const { url: parsedUrl, errorResponse } = parseDynamicParams(url, params);
    if (errorResponse) {
      throw {
        ...errorResponse,
        response: { data: errorResponse },
      };
    }

    if (params?.startAt && params?.endAt) {
      params.startAt = dayjs(params.startAt).startOf("date").toISOString();
      params.endAt = dayjs(params.endAt).endOf("date").toISOString();
    }

    const res = await apiInstance.get<ApiResponse<T>>(parsedUrl, { params });
    return res.data;
  } catch (err) {
    throw throwError(err);
  }
};

// Hàm POST
export const postData = async <T>(url: string, data: any) => {
  try {
    const { url: parsedUrl, errorResponse } = parseDynamicParams(url, data);

    if (errorResponse) {
      throw {
        ...errorResponse,
        response: { data: errorResponse },
      };
    }

    if (parsedUrl.includes(apiEndpoint.auth.login)) {
      await setIpAddress();
    }

    const res = await apiInstance.post<ApiResponse<T>>(parsedUrl, data);
    return res.data;
  } catch (err) {
    throw throwError(err);
  }
};

// Hàm PUT
export const putData = async <T>(url: string, data: any) => {
  try {
    const { url: parsedUrl, errorResponse } = parseDynamicParams(url, data);
    if (errorResponse) {
      throw {
        ...errorResponse,
        response: { data: errorResponse },
      };
    }

    const res = await apiInstance.put<ApiResponse<T>>(parsedUrl, data);
    return res.data;
  } catch (err) {
    throw throwError(err);
  }
};

// Hàm DELETE
export const deleteData = async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
  try {
    const { url: parsedUrl, errorResponse } = parseDynamicParams(url, params);
    if (errorResponse) {
      throw {
        ...errorResponse,
        response: { data: errorResponse },
      };
    }

    const response = await apiInstance.delete<ApiResponse<T>>(parsedUrl);

    return response.data;
  } catch (error: any) {
    console.log("error", error);
    throw throwError(error);
  }
};

// Hàm DELETE nhieu
export const deleteMultiData = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response = await apiInstance.delete<ApiResponse<T>>(url, {
      data: data,
    });
    return response.data;
  } catch (error: any) {
    throw throwError(error);
  }
};
