import { HOST_URL } from "@/shared/constants/apiEndpoint";

export const getIdFromParams = (): number | null => {
  const queryParams = new URLSearchParams(window.location.search);
  if (!queryParams.has("id")) {
    return null;
  }
  return Number(queryParams.get("id"));
};

/**
 * Tạo URL từ template route có chứa param id
 * @param template "/project/:id"
 * @param id 3
 * @returns "/project/3"
 */
export const buildUrlWithId = (template: string, id: string | number): string => {
  return template.replace(":id", String(id));
};

export const getHashFromParams = () => {
  return window.location.hash.replace("#", "");
};

export const buildFileUrl = (filePath: string): string => {
  if (!filePath) return "";

  // Keep inline/browser-generated URLs untouched (e.g. data:image..., blob:...)
  if (filePath.startsWith("data:") || filePath.startsWith("blob:")) {
    return filePath;
  }

  // Keep absolute URLs untouched
  if (/^(https?:)?\/\//i.test(filePath)) {
    return filePath.replace("//uploads", "/uploads");
  }

  const fullUrl = `${HOST_URL}${filePath}`;
  return fullUrl.replace("//uploads", "/uploads");
};

export const getImageExtension = (fileName: string): "png" | "jpeg" | "gif" => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension === "png") return "png";
  if (extension === "jpeg" || extension === "jpg") return "jpeg";
  if (extension === "gif") return "gif";
  return "png"; // default
};
