import {
  Modal,
  Button,
  Form,
  FormProps,
  Upload,
  UploadProps,
  Spin,
  notification,
  UploadFile,
  Radio,
} from "antd";
import React, { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { useExcelStore } from "../excel.store";
import { FileCategory, EntityFile } from "@/shared/constants/enum";
import { uploads } from "@/shared/utils/file.util";
import { File } from "@/shared/interfaces/file";
import {
  ExcelEntityType,
  ImportDuplicateHandling,
  ImportErrorHandling,
  ENTITY_SUPPORTS_IMPORT,
} from "../excel.enum";
import { entityTypeLabel } from "../excel.util";

const { Dragger } = Upload;

type ModalImportExcelProps = {
  open: boolean;
  entityType: ExcelEntityType;
  setClose: () => void;
  onSuccess?: () => void;
};

export const ModalImportExcel: React.FC<ModalImportExcelProps> = ({
  open,
  entityType,
  setClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { templateLoading, importing, getTemplate, importExcel, reset } = useExcelStore();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        errorHandling: ImportErrorHandling.SKIP_ERROR,
        duplicateHandling: ImportDuplicateHandling.UPDATE,
      });
    }
  }, [open, form]);

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".xlsx,.xls",
    fileList,
    beforeUpload: () => false,
    onChange: (info) => {
      setFileList(info.fileList);
      setUploadedFile(null);
    },
  };

  const handleUploadFile = async () => {
    if (fileList.length === 0) {
      notification.error({ message: "Vui lòng chọn file" });
      return;
    }
    setIsUploading(true);
    try {
      const uploadResult = await uploads({
        files: fileList,
        entity: EntityFile.EXCEL_IMPORT,
        category: FileCategory.DOCUMENT,
      });
      if (uploadResult && uploadResult.length > 0) {
        setUploadedFile(uploadResult[0]);
        notification.success({ message: "Tải file lên thành công" });
      }
    } catch {
      notification.error({ message: "Có lỗi xảy ra khi tải file" });
    } finally {
      setIsUploading(false);
    }
  };

  const onFinish: FormProps["onFinish"] = async (values) => {
    if (!uploadedFile) {
      notification.error({ message: "Vui lòng tải file lên trước" });
      return;
    }
    importExcel(
      {
        entityType,
        fileId: uploadedFile.id,
        errorHandling: values.errorHandling,
        duplicateHandling: values.duplicateHandling,
      },
      () => {
        // Job created successfully → close modal, panel handles the rest
        handleClose();
        onSuccess?.();
      },
    );
  };

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setUploadedFile(null);
    reset();
    setClose();
  };

  const label = entityTypeLabel[entityType] || entityType;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={`Nhập ${label} từ Excel`}
      footer={null}
      width={700}
      centered
      destroyOnClose
      maskClosable={false}
    >
      <div className="flex flex-col max-h-[80vh] overflow-y-auto">
        <div className="bg-yellow-100 px-5 py-3 leading-8 rounded mb-4">
          <p>
            1. Tải file mẫu và nhập dữ liệu{" "}
            {templateLoading ? (
              <Spin size="small" />
            ) : (
              <a
                className="text-blue-500 font-bold underline cursor-pointer"
                onClick={() => getTemplate(entityType)}
              >
                Tải file mẫu
              </a>
            )}
          </p>
          <p>2. Nhập dữ liệu chính xác theo các trường.</p>
          <p className="text-red-500">Lưu ý: Không thay đổi tên và thứ tự các cột.</p>
        </div>

        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="files" label="Chọn file Excel">
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click hoặc kéo thả file vào đây</p>
            </Dragger>
          </Form.Item>

          {fileList.length > 0 && !uploadedFile && (
            <div className="mb-4">
              <Button type="primary" onClick={handleUploadFile} loading={isUploading} block>
                {isUploading ? "Đang tải lên..." : "Tải file lên server"}
              </Button>
            </div>
          )}

          {uploadedFile && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-700">
                ✅ File đã sẵn sàng: {uploadedFile.originalName || uploadedFile.fileName}
              </p>
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <Form.Item name="errorHandling" label="Xử lý lỗi" className="flex-1">
              <Radio.Group>
                <Radio value={ImportErrorHandling.SKIP_ERROR}>Bỏ qua dòng lỗi</Radio>
                <Radio value={ImportErrorHandling.STOP_ON_ERROR}>Dừng khi gặp lỗi</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="duplicateHandling" label="Xử lý trùng lặp" className="flex-1">
              <Radio.Group>
                <Radio value={ImportDuplicateHandling.UPDATE}>Cập nhật</Radio>
                <Radio value={ImportDuplicateHandling.SKIP}>Bỏ qua</Radio>
                <Radio value={ImportDuplicateHandling.STOP}>Dừng</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={importing}
              disabled={!uploadedFile}
              block
              size="large"
            >
              {importing ? "Đang import..." : "Bắt đầu import"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
