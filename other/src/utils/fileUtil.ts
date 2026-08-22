import { apiEndpoint, BASE_URL } from "../constants/ApiEndpoint";
import { message, notification, UploadFile } from "antd";
import { HOST_URL } from "../constants/ApiEndpoint";
import dayjs from "dayjs";
import { IFile } from "../models/base/file";
import { FileCategoryEnum, FileEntityEnum } from "../constants/enum";
import { buildUrlWithId } from "./paramUtils";

export function parseFileInfo(fileName: string) {
  if (!fileName.includes("-")) {
    const [name, ext] = fileName.split(".");
    return {
      name,
      date: dayjs().format("DD/MM/YYYY"),
      ext: ext ? `.${ext}` : "",
    };
  }
  const fullFileName =
    fileName.substring(Math.max(fileName.lastIndexOf("/"), fileName.lastIndexOf("\\")) + 1) || "";

  // Tìm dấu . cuối cùng để tách extension
  const lastDotIndex = fullFileName.lastIndexOf(".");
  const nameWithTimestamp =
    lastDotIndex >= 0 ? fullFileName.substring(0, lastDotIndex) : fullFileName;
  const extension = lastDotIndex >= 0 ? fullFileName.substring(lastDotIndex) : "";

  // Tìm dấu - cuối cùng để tách timestamp
  const lastDashIndex = nameWithTimestamp.lastIndexOf("-");
  let originalName = nameWithTimestamp;
  let date: Date = new Date();

  if (lastDashIndex >= 0) {
    originalName = nameWithTimestamp.substring(0, lastDashIndex);
    const timestampStr = nameWithTimestamp.substring(lastDashIndex + 1);
    const timestamp = parseInt(timestampStr, 10);
    if (!isNaN(timestamp)) {
      date = new Date(timestamp);
    }
  }

  return {
    name: originalName,
    date: dayjs(date).format("DD/MM/YYYY"),
    ext: extension,
  };
}

export const downloadFile = (fileUrl: string) => {
  const url = (HOST_URL + fileUrl)?.replace("//uploads", "/uploads") || "";
  const a = document.createElement("a");
  a.href = url;
  a.download = ""; // backend quyết định filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const mapFileList = (files: string[]): UploadFile[] => {
  return files.map((url, index) => {
    const fullFileName = url.split("/").pop() || "";
    const [nameWithoutTime, ...extParts] = fullFileName.split(".");
    const lastDashIndex = nameWithoutTime.lastIndexOf("-");
    const originalName = nameWithoutTime.substring(0, lastDashIndex);
    const extension = extParts.length ? `.${extParts.join(".")}` : "";

    return {
      uid: `old-${index}`,
      name: `${originalName}${extension}`,
      status: "done",
      url: `${HOST_URL}${url}`,
    };
  });
};

interface UploadProps {
  files: UploadFile[];
  oId?: string;
  entity: FileEntityEnum;
  category: FileCategoryEnum;
  isActive?: boolean;
}
export async function uploads({
  files,
  oId,
  entity,
  category,
  isActive = false,
}: UploadProps): Promise<IFile[] | null> {
  try {
    const deviceId = localStorage.getItem("deviceId");
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formData = new FormData();

    const formatData = files.filter((file) => file.originFileObj && !file.url);

    // Append từng file vào formData
    formatData.forEach((file) => {
      if (file.originFileObj) {
        formData.append("files", file.originFileObj);
      }
    });

    // Append metadata
    if (oId) formData.append("entityId", oId);
    formData.append("entityType", entity);
    formData.append("category", category);
    formData.append("isActive", String(isActive));

    const response = await fetch(BASE_URL + apiEndpoint.files.base, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        "x-device-id": deviceId || "1",
        "x-timezone": timeZone,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result?.data?.files;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);

    notification.error({
      message: "Upload Failed",
      description: "Tải lên không thành công. Vui lòng thử lại.",
    });

    return null;
  }
}

// set main cho ảnh
export async function setMainFile(fileId: string): Promise<boolean> {
  try {
    const deviceId = localStorage.getItem("deviceId") || "1";
    const currentStoreCode = sessionStorage.getItem("currentStoreCode") || "";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(BASE_URL + buildUrlWithId(apiEndpoint.files.setMain, fileId), {
      method: "POST",
      credentials: "include",
      headers: {
        "x-device-id": deviceId || "1",
        "x-timezone": timeZone,
        "x-store-code": currentStoreCode,
      },
    });
    if (!response.ok) {
      const result = await response.json();
      if (result && result.message) {
      }
      console.error("Failed to set main file with id:", result);
      return false;
    }
    return true;
  } catch (error) {
    console.error("There was a problem with the set main operation:", error);
    return false;
  }
}

export async function deleteFile(fileId: string): Promise<boolean> {
  try {
    const deviceId = localStorage.getItem("deviceId");
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(`${BASE_URL + apiEndpoint.files.base}/${fileId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "x-device-id": deviceId || "1",
        "x-timezone": timeZone,
      },
    });
    if (!response.ok) {
      message.error("Xóa file không thành công. Vui lòng thử lại sau.");
      return false;
    }
    return true;
  } catch (error) {
    message.error("Xóa file không thành công. Vui lòng thử lại sau.");
    return false;
  }
}

// Tìm ảnh chính của sản phẩm trong album
export function getMainImage(album: IFile[] | undefined | null): IFile | null {
  if (!album || album.length === 0) return null;
  const existingMain = album.find((file) => file.isMain);
  return existingMain || (album.length > 0 ? album[0] : null);
}
