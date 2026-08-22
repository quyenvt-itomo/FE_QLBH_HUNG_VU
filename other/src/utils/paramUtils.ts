import { HOST_URL } from "../constants/ApiEndpoint";

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
export const buildUrlWithId = (
  template: string,
  id: string | number,
): string => {
  return template.replace(":id", String(id));
};

export const getHashFromParams = () => {
  return window.location.hash.replace("#", "");
};

export const buildFileUrl = (filePath: string): string => {
  const fullUrl = filePath.includes("http") ? filePath : HOST_URL + filePath;
  return fullUrl.replace("//uploads", "/uploads");
};
