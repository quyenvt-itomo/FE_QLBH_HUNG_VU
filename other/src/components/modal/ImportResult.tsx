import { Button, Modal } from "antd";
import { ImportExcelResult } from "../../models/base/excel";
import { downloadFile } from "../../utils/fileUtil";

export const showImportResultModal = (result: ImportExcelResult) => {
  const { totalRows, successRows, errorRows, skippedRows, errorFileUrl } = result;
  console.log({ result });

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
        {errorFileUrl && (
          <Button type="link" onClick={() => downloadFile(errorFileUrl)} style={{ padding: 0 }}>
            Tải file lỗi
          </Button>
        )}
      </div>
    ),
    okText: "Đóng",
    centered: true,
    width: 400,
  });
};
