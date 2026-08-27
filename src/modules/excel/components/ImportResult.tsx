import { Button, Modal, message } from "antd";
import { ImportExcelResult } from "../excel.model";

const downloadErrorFile = async (url: string) => {
  try {
    const deviceId = localStorage.getItem("deviceId") || "1";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await fetch(url, {
      credentials: "include",
      headers: { "x-device-id": deviceId, "x-timezone": timeZone },
    });
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "error_report.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    message.success("Tải file lỗi thành công");
  } catch (error) {
    console.error("Error downloading error file:", error);
    message.error("Không thể tải file lỗi");
  }
};

export const openImportResultModal = (result: ImportExcelResult) => {
  const { totalRows, successRows, errorRows, skippedRows, errors, errorFileUrl } = result;

  Modal.info({
    title: "Kết quả nhập Excel",
    content: (
      <div>
        <p>
          Tổng số dòng: <b>{totalRows}</b>
        </p>
        <p>
          Số dòng thành công: <b className="text-green-600">{successRows}</b>
        </p>
        {errorRows > 0 && (
          <p>
            Số dòng lỗi: <b className="text-red-600">{errorRows}</b>
          </p>
        )}
        {skippedRows > 0 && (
          <p>
            Số dòng bỏ qua: <b className="text-orange-600">{skippedRows}</b>
          </p>
        )}
        {errors && errors.length > 0 && (
          <div className="mt-2 max-h-40 overflow-y-auto rounded bg-red-50 px-2 py-1.5 text-xs text-red-600">
            {errors.slice(0, 5).map((err, i) => (
              <div key={i} className="truncate leading-5" title={err.message}>
                {err.row > 0 ? `Dòng ${err.row}: ` : ""}
                {err.message}
              </div>
            ))}
            {errors.length > 5 && (
              <div className="text-red-400">...và {errors.length - 5} lỗi khác</div>
            )}
          </div>
        )}
        {errorFileUrl && (
          <Button
            type="link"
            onClick={() => downloadErrorFile(errorFileUrl)}
            style={{ padding: 0 }}
          >
            Tải file lỗi
          </Button>
        )}
      </div>
    ),
    okText: "Đóng",
    centered: true,
    width: 480,
  });
};
