import { App, Form, Input } from "antd";
import { Purchase } from "./purchase.model";
import { HandlersInput } from "@/shared/interfaces/common";
import { Label } from "@/shared/components";
import { FileUploadBox } from "@/shared/components";
import { EntityType, FileCategory } from "@/shared/constants/enum";
import { deletePendingFiles } from "@/shared/utils/file.util";
import { PurchaseFile } from "./purchase.file";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

export function usePurchaseHandlers({
  create,
  update,
  remove,
  getById,
  setOpen,
  setOpenDetail,
  setRowData,
  approve,
  reject,
  complete,
}: HandlersInput<Purchase> & {
  complete?: (id: string) => Promise<any>;
}) {
  const { modal } = App.useApp();
  const { currentStore } = useGlobalData();
  const [form] = Form.useForm<any>();

  const handleOpenDetail = (record: Purchase) => {
    if (!!getById) {
      getById(record.id, {
        onSuccess: (data) => {
          if (!data) return;
          setRowData(data);
          if (setOpenDetail) {
            setOpenDetail(true);
          } else {
            setOpen?.(true);
          }
        },
      });
    } else {
      setRowData(record);
      if (setOpenDetail) {
        setOpenDetail(true);
      } else {
        setOpen?.(true);
      }
    }
  };

  const handleOpenAdd = create
    ? () => {
        setRowData(undefined);
        setOpen?.(true);
      }
    : undefined;

  const handleOpenEdit = update
    ? (record: Purchase) => {
        getById?.(record.id, {
          onSuccess: (data) => {
            if (!data) return;
            setRowData(data);
            setOpen?.(true);
          },
        });
      }
    : undefined;

  const handleDelete = remove
    ? (record: Purchase) => {
        modal.confirm({
          centered: true,
          title: "Xóa đơn mua hàng",
          content: "Bạn có chắc muốn xóa đơn mua hàng này?",
          okText: "Xóa",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: () => remove(record.id),
        });
      }
    : undefined;

  const handleApprove = approve
    ? (record: Purchase) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Duyệt đơn mua hàng",
          content: (
            <div className="flex flex-col">
              <span>Bạn có chắc muốn duyệt đơn mua hàng này?</span>
              <div className="flex flex-col mt-2">
                <Label title="Tài liệu bổ sung" />
                <FileUploadBox
                  oId={id}
                  entity={EntityType.PURCHASE}
                  category={FileCategory.DOCUMENT}
                />
              </div>
            </div>
          ),
          okText: "Duyệt",
          okButtonProps: { type: "primary" },
          cancelText: "Hủy",
          onOk: () => approve(id),
          onCancel: () => {
            deletePendingFiles(id);
          },
        });
      }
    : undefined;

  const handleReject = reject
    ? (record: Purchase) => {
        const id = record.id;
        modal.confirm({
          centered: true,
          title: "Từ chối đơn mua hàng",
          content: (
            <Form form={form} layout="vertical">
              <div className="mb-3">Bạn có chắc muốn từ chối đơn mua hàng này?</div>
              <Form.Item
                name="reason"
                label="Lý do từ chối"
                rules={[{ required: true, message: "Vui lòng nhập lý do từ chối" }]}
              >
                <Input.TextArea rows={3} maxLength={500} placeholder="Nhập lý do từ chối..." />
              </Form.Item>
            </Form>
          ),
          okText: "Từ chối",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: async () => {
            const values = await form.validateFields();
            await reject(id, values.reason);
          },
          onCancel: () => {
            form.resetFields();
          },
        });
      }
    : undefined;

  const handleConfirmComplete = complete
    ? (record: Purchase) => {
        modal.confirm({
          centered: true,
          title: "Hoàn thành đơn mua hàng",
          content: `Xác nhận hoàn thành đơn ${record.code}? Sau khi hoàn thành sẽ không thể sửa đổi.`,
          okText: "Hoàn thành",
          okButtonProps: { type: "primary" },
          cancelText: "Hủy",
          onOk: () => complete(record.id),
        });
      }
    : undefined;

  const handleEditFromDetail = update
    ? () => {
        setOpenDetail?.(false);
        setOpen?.(true);
      }
    : undefined;

  const handleExportExcel = async (record: Purchase) => {
    if (getById) {
      getById(record.id, {
        onSuccess: async (data) => {
          if (!data) return;
          await PurchaseFile.exportExcel(data, currentStore);
        },
      });
    } else {
      await PurchaseFile.exportExcel(record, currentStore);
    }
  };

  return {
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleConfirmComplete,
    handleEditFromDetail,
    handleApprove,
    handleReject,
    handleExportExcel,
  } as const;
}
