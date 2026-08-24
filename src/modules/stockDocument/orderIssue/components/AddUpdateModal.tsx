import React, { useEffect } from "react";
import { App, Form, FormProps, Modal } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { StockDocument, StockDocumentType } from "../../stockDocument.model";
import { handleCloseWithPendingFiles, randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { SubmitButton } from "@/shared/components";
import { BodyOrderIssue } from "./Body";
import { OrderIssueLineFormList } from "./LineFormList";

const type = StockDocumentType.ORDER_ISSUE;

export const AddUpdateModal: React.FC<AddUpdateModalProps<StockDocument>> = ({
  open,
  editData,
  loading,
  errors,
  defaultData,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { modal } = App.useApp();
  const [form] = Form.useForm<StockDocument>();
  const id = editData?.id || randomId();

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<StockDocument>["onFinish"] = async (values: StockDocument) => {
    const formattedData = formatFormData({ ...values, type, id, tempId: id });
    modal.confirm({
      centered: true,
      title: editData ? "Xác nhận sửa phiếu xuất bán?" : "Xác nhận thêm phiếu xuất bán?",
      content: editData
        ? "Bạn có chắc chắn muốn sửa phiếu xuất bán này không?"
        : "Bạn có chắc chắn muốn thêm phiếu xuất bán này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        editData ? onEdit?.(formattedData) : onAdd?.(formattedData);
      },
    });
  };

  return (
    <Modal
      title={editData ? "Sửa phiếu xuất bán" : "Thêm phiếu xuất bán"}
      open={open}
      onCancel={() => handleCloseWithPendingFiles(id, onClose)}
      footer={null}
      maskClosable={false}
      centered
      width="100vw"
      className="fullscreen-modal"
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }
        if (!editData) {
          if (defaultData) form.setFieldsValue(parseFormDataDates(defaultData));
          return;
        }
        form.setFieldsValue(parseFormDataDates(editData));
      }}
      destroyOnClose
    >
      <Form form={form} onFinish={onFinish} className="flex flex-col h-full overflow-hidden">
        <BodyOrderIssue form={form} editData={editData} />
        <OrderIssueLineFormList form={form} />
        <div className="flex justify-end px-6 pb-4 mt-auto">
          <SubmitButton
            loading={loading}
            onCancel={() => handleCloseWithPendingFiles(id, onClose)}
          />
        </div>
      </Form>
    </Modal>
  );
};
