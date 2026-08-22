import { notification } from "antd";
import { TOOL_URL } from "../constants/ApiEndpoint";

export const generatePdf = async (
  content: string,
  fileName?: string,
): Promise<string | undefined> => {
  try {
    const response = await fetch(`${TOOL_URL}v1/tools/generate-pdf`, {
      method: "POST",
      body: JSON.stringify({ content, fileName }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json(); // ✅ Giữ kiểu chính xác từ keys
    return TOOL_URL + result?.data?.url || "";
  } catch (error) {
    notification.error({
      message: "Không thành công",
      description: "Tạo file PDF không thành công. Vui lòng thử lại.",
    });
    return undefined;
  }
};
