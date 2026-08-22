import { useState, useCallback } from "react";
import { notification } from "antd";
import { TOOL_URL } from "../constants/apiEndpoint";

interface GeneratePdfOptions {
  autoPrint?: boolean; // có tự động mở máy in không
}

export const useGeneratePdf = (options?: GeneratePdfOptions) => {
  const [loading, setLoading] = useState(false);

  const generatePdf = useCallback(
    async (content: string, fileName?: string): Promise<string | undefined> => {
      try {
        setLoading(true);

        const response = await fetch(`${TOOL_URL}v1/tools/generate-pdf`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content, fileName }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        const url = TOOL_URL + result?.data?.url;

        if (url && options?.autoPrint) {
          const win = window.open(url, "_blank");
          win?.addEventListener("load", () => {
            win.print();
          });
        }

        return url;
      } catch (error) {
        notification.error({
          message: "Không thành công",
          description: "Tạo file PDF không thành công. Vui lòng thử lại.",
        });
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [options?.autoPrint],
  );

  return {
    generatePdf,
    loading,
  };
};
