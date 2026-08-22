import {
  Modal,
  Button,
  Form,
  FormProps,
  Upload,
  UploadProps,
  Spin,
  notification,
  Radio,
  Space,
  UploadFile,
  Progress,
  Row,
  Col,
} from "antd";
import React, { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { importExcelProgress } from "../../stores/excel/slice";
import { ImportProgressData, ImportJobStatus } from "../../models/base/excel";
import { useExcelData } from "../../hooks/core/useExcelData";
import { apiEndpoint, BASE_URL } from "../../constants/ApiEndpoint";
import {
  ExcelEntityType,
  ImportErrorHandling,
  ImportDuplicateHandling,
  FileCategoryEnum,
  FileEntityEnum,
} from "../../constants/enum";
import { uploads } from "../../utils/fileUtil";
import { IFile } from "../../models/base/file";
import Label from "../display/Label";

const { Dragger } = Upload;

type ModalAddProps = {
  open: boolean;
  entityType: ExcelEntityType;
  setClose: () => void;
  onSuccess?: () => void;
};

const ModalImportExcel: React.FC<ModalAddProps> = ({ open, entityType, setClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedFile, setUploadedFile] = useState<IFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<ImportProgressData | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const { isCheckAdd, loading, currentJobId, getCurrentTemplate, importCurrentExcel } =
    useExcelData();

  // Set default values
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        errorHandling: ImportErrorHandling.SKIP_ERROR,
        duplicateHandling: ImportDuplicateHandling.UPDATE,
      });
    }
  }, [open, form]);

  const connectToSSE = (jobId: string) => {
    const deviceId = localStorage.getItem("deviceId") || "1";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentStoreCode = sessionStorage.getItem("currentStoreCode") || "";

    const params = new URLSearchParams({
      deviceId,
      timezone: timeZone,
      ...(currentStoreCode && { storeCode: currentStoreCode }),
    });

    const url = `${BASE_URL}${apiEndpoint.excel.stream.replace(":jobId", jobId)}?${params.toString()}`;

    // ✅ EventSource native - cookies được gửi tự động khi same-site
    const es = new EventSource(url, { withCredentials: true });

    es.onopen = () => {
      console.log("✅ SSE connected for job:", jobId);
    };

    es.onmessage = (event) => {
      try {
        const data: ImportProgressData = JSON.parse(event.data);

        setProgress(data);
        dispatch(importExcelProgress(data));

        if (data.status === ImportJobStatus.COMPLETED) {
          es.close();
          setEventSource(null);
        } else if (data.status === ImportJobStatus.FAILED) {
          es.close();
          setEventSource(null);
        }
      } catch (error) {
        onSuccess?.();
        console.error("❌ Error parsing SSE data:", error);
      }
    };

    es.onerror = (error) => {
      console.error("❌ SSE error:", error);
      notification.error({
        message: "Mất kết nối",
        description: "Không thể theo dõi tiến trình",
      });
      es.close();
      setEventSource(null);
    };

    setEventSource(es);
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (eventSource) {
        console.log("🔌 Closing SSE connection");
        eventSource.close();
      }
    };
  }, [eventSource]);

  // Kết nối SSE khi có jobId
  useEffect(() => {
    if (currentJobId && !eventSource) {
      console.log("🚀 JobId received, connecting to SSE:", currentJobId);
      connectToSSE(currentJobId);
    }
  }, [currentJobId]);

  useEffect(() => {
    if (!isCheckAdd) return;
    onSuccess?.();
    handleClose();
  }, [isCheckAdd]);

  const props: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".xlsx,.xls",
    fileList,
    beforeUpload: (file: any) => {
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      setFileList(info.fileList);
      setUploadedFile(null); // Reset uploaded file when changing
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  // Step 1: Upload file
  const handleUploadFile = async () => {
    if (fileList.length === 0) {
      notification.error({ message: "Vui lòng chọn file" });
      return;
    }

    setIsUploading(true);
    try {
      const uploadResult = await uploads({
        files: fileList,
        entity: FileEntityEnum.EXCEL_IMPORT,
        category: FileCategoryEnum.DOCUMENT,
      });

      if (uploadResult && uploadResult.length > 0) {
        setUploadedFile(uploadResult[0]);
      }
    } catch (error) {
      notification.error({ message: "Có lỗi xảy ra khi tải file" });
    } finally {
      setIsUploading(false);
    }
  };

  // Step 2: Import with fileId
  const onFinish: FormProps["onFinish"] = async (values) => {
    if (!uploadedFile) {
      notification.error({ message: "Vui lòng tải file lên trước" });
      return;
    }

    importCurrentExcel({
      entityType,
      fileId: uploadedFile.id,
      errorHandling: values.errorHandling,
      duplicateHandling: values.duplicateHandling,
      uniqueFields: values.uniqueFields,
    });

    // onSuccess?.();
    // handleClose();
  };

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setUploadedFile(null);
    setProgress(null);
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    setClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={<div className="flex w-full">Nhập từ Excel</div>}
      footer={null}
      width={700}
      centered
      height="calc(100vh - 20px)"
      className="full-screen-modal"
      destroyOnClose
    >
      <div className="flex flex-col mt-4 py-4 h-full overflow-y-auto scrollbar-hide">
        <p className="font-semibold">Các bước</p>
        <div className="bg-yellow-100 px-5 py-3 leading-8 rounded-normal my-4">
          <span>
            1. Tải file mẫu và nhập dữ liệu{" "}
            {loading ? (
              <Spin />
            ) : (
              <a
                className="text-blue-500 font-bold underline cursor-pointer"
                onClick={() => getCurrentTemplate({ entityType })}
              >
                Tải file mẫu
              </a>
            )}
          </span>
          <p>2. Nhập dữ liệu chính xác theo các trường.</p>
          <p className="text-red-500">Lưu ý: Không thay đổi tên và thứ tự các cột.</p>
        </div>

        <Form form={form} className="flex-1 flex flex-col" onFinish={onFinish} layout="vertical">
          <Form.Item name="files" label="Chọn file Excel">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click hoặc kéo thả file vào đây để tải lên</p>
            </Dragger>
          </Form.Item>

          {fileList.length > 0 && !uploadedFile && (
            <div className="mb-4">
              <Button
                type="default"
                onClick={handleUploadFile}
                loading={isUploading}
                block
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                {isUploading ? "Đang tải lên..." : "Tải file lên server"}
              </Button>
            </div>
          )}

          {uploadedFile && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-700">
                ✓ File đã tải lên: <strong>{uploadedFile.originalName}</strong>
              </p>
            </div>
          )}

          <Form.Item
            name="errorHandling"
            label={<Label title="Xử lý lỗi trong quá trình nhập" width={500} bold />}
            rules={[{ required: true, message: "Vui lòng chọn cách xử lý lỗi" }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value={ImportErrorHandling.SKIP_ERROR}>
                  Bỏ qua dòng lỗi (tiếp tục import các dòng hợp lệ)
                </Radio>
                <Radio value={ImportErrorHandling.STOP_ON_ERROR}>
                  Dừng lại khi có lỗi (không import dòng nào)
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="duplicateHandling"
            label={<Label title="Xử lý khi trùng dữ liệu" width={500} bold />}
            rules={[{ required: true, message: "Vui lòng chọn cách xử lý trùng lặp" }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value={ImportDuplicateHandling.UPDATE}>Cập nhật thông tin mới</Radio>
                <Radio value={ImportDuplicateHandling.SKIP}>Bỏ qua dòng trùng</Radio>
                <Radio value={ImportDuplicateHandling.STOP}>Dừng lại và báo lỗi khi trùng</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <div className="flex justify-center mt-auto mb-0 gap-3 sticky bottom-0 bg-gradient-to-t from-white to-transparent pt-2">
            <Button className="font-light" onClick={handleClose} style={{ width: 100 }}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="font-light"
              disabled={!uploadedFile || isUploading}
              loading={loading}
            >
              Nhập dữ liệu
            </Button>
          </div>
        </Form>
      </div>

      {/* Modal hiển thị tiến độ import */}
      <Modal
        open={loading && progress !== null}
        closable={false}
        footer={null}
        width={500}
        centered
        destroyOnClose
      >
        <div className="py-4">
          <div className="text-center mb-4">
            <Spin size="large" />
          </div>
          <h3 className="text-lg font-semibold text-center mb-4">
            {progress?.status === ImportJobStatus.PROCESSING
              ? "Đang nhập dữ liệu..."
              : "Đang khởi tạo..."}
          </h3>

          {progress && (
            <>
              {/* Hiển thị progress theo layers nếu có */}
              {progress.layers && progress.layers.length > 0 ? (
                <div className="mb-4 space-y-3">
                  {progress.layers.map((layer, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{layer.label}</span>
                        <span className="text-xs text-gray-500">
                          {layer.status === "completed" ? (
                            <span className="text-green-600">✓ Hoàn thành</span>
                          ) : layer.status === "processing" ? (
                            <span className="text-blue-600">Đang xử lý...</span>
                          ) : layer.status === "failed" ? (
                            <span className="text-red-600">✗ Lỗi</span>
                          ) : (
                            <span className="text-gray-400">Chờ xử lý</span>
                          )}
                        </span>
                      </div>
                      <Progress
                        percent={Math.round(layer.progress || 0)}
                        status={
                          layer.status === "failed"
                            ? "exception"
                            : layer.status === "completed"
                              ? "success"
                              : layer.status === "processing"
                                ? "active"
                                : "normal"
                        }
                        strokeColor={{
                          "0%": "#108ee9",
                          "100%": "#87d068",
                        }}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // Fallback: hiển thị progress tổng thể nếu không có layers
                <div className="mb-4">
                  <Progress
                    percent={Math.round(progress.progress || 0)}
                    status={progress.status === ImportJobStatus.PROCESSING ? "active" : "normal"}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <Row gutter={[108, 12]}>
                  <Col span={12}>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng số dòng:</span>
                      <span className="font-semibold">{progress.totalRows || 0}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đã xử lý:</span>
                      <span className="font-semibold">{progress.processedRows || 0}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="flex justify-between">
                      <span className="text-green-600">Thành công:</span>
                      <span className="font-semibold text-green-600">
                        {progress.successRows || 0}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="flex justify-between">
                      <span className="text-red-600">Lỗi:</span>
                      <span className="font-semibold text-red-600">{progress.errorRows || 0}</span>
                    </div>
                  </Col>
                  {progress.skippedRows !== undefined && progress.skippedRows > 0 && (
                    <Col span={24}>
                      <div className="flex justify-between">
                        <span className="text-orange-600">Bỏ qua:</span>
                        <span className="font-semibold text-orange-600">
                          {progress.skippedRows}
                        </span>
                      </div>
                    </Col>
                  )}
                </Row>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                Vui lòng đợi, không đóng trình duyệt...
              </div>
            </>
          )}
        </div>
      </Modal>
    </Modal>
  );
};

export default ModalImportExcel;
