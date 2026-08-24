import React, { useEffect, useMemo } from "react";
import { App, Form, FormProps, Modal } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Quotation, QuotationSortOrderFields } from "../quotation.model";
import { handleCloseWithPendingFiles, randomId } from "@/shared/utils/common.util";
import { extractListErrorCells, setFormCode, setFormErrors } from "@/shared/utils/form.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { QuotationFormBody } from "./QuotationFormBody";
import { QuotationLineFormList } from "./QuotationLineFormList";
import SubmitButton from "@/shared/components/button/SubmitButton";
import { FormInstance } from "antd/lib";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import dayjs from "dayjs";
import { defaultAdditionalInfo, EntityType, FileCategory } from "@/shared/constants/enum";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";

export interface PartialProps {
  form: FormInstance<Quotation>;
  errorCells?: Map<number, Set<string>>;
}

export const AddUpdateQuotationModal: React.FC<AddUpdateModalProps<Quotation>> = ({
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
  const { message, errorCells, setErrorCells, showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<Quotation>();
  const id = editData?.id || randomId();

  useEffect(() => {
    if (!errors) {
      setErrorCells(new Map());
      return;
    }
    setFormErrors(form, errors, { scrollToFirst: true });
    // Trích xuất các cell bị lỗi để highlight
    const cells = extractListErrorCells(errors, "lines");
    setErrorCells(cells);
  }, [errors, form]);

  const onFinish: FormProps<Quotation>["onFinish"] = async (values: Quotation) => {
    const formattedData = formatFormData({ ...values, id, tempId: id }, QuotationSortOrderFields);

    modal.confirm({
      title: editData ? "Xác nhận sửa báo giá?" : "Xác nhận thêm báo giá?",
      content: editData
        ? "Bạn có chắc chắn muốn sửa báo giá này không?"
        : "Bạn có chắc chắn muốn thêm báo giá này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        editData ? onEdit?.(formattedData) : onAdd?.(formattedData);
      },
    });
  };

  return (
    <Modal
      title={editData ? "Sửa báo giá" : "Tạo báo giá mới"}
      open={open}
      onCancel={() => handleCloseWithPendingFiles(id, onClose)}
      footer={null}
      maskClosable={false}
      centered
      width={"100vw"}
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }

        if (editData) {
          const formatted = parseFormDataDates(editData, QuotationSortOrderFields);
          form.setFieldsValue(formatted);
          return;
        }

        // setFormCode({ form, type: "quotation" });
        if (defaultData) form.setFieldsValue(parseFormDataDates(defaultData));
      }}
      className="fullscreen-modal"
      destroyOnClose
    >
      <Form
        form={form}
        className="flex flex-col h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
        onFinish={onFinish}
        onFinishFailed={showFormErrorMessages}
        initialValues={{
          timeAt: dayjs(),
          validUntil: dayjs().add(7, "day").set("hour", 5).set("minute", 30).set("second", 0),
          additionalInfo: defaultAdditionalInfo,
        }}
      >
        <QuotationFormBody form={form} />
        <QuotationLineFormList form={form} errorCells={errorCells} />

        <div className="flex justify-between items-end mt-auto mb-0 action-sticky-bottom">
          <div className="flex w-[520px]">
            <FileUploadBox
              defaultFiles={editData?.document}
              oId={id}
              entity={EntityType.QUOTATION}
              category={FileCategory.DOCUMENT}
              maxCount={5}
              onMoveToTrash={(file) => {
                const trashFileIds: string[] = form?.getFieldValue("__trashFileIds") || [];
                if (trashFileIds.includes(file.id)) return;
                form?.setFieldValue("__trashFileIds", [...trashFileIds, file.id]);
              }}
            />
            <Form.Item name="__trashFileIds" hidden />
          </div>
          <SubmitButton
            loading={loading}
            onCancel={() => handleCloseWithPendingFiles(id, onClose)}
          />
        </div>
      </Form>
    </Modal>
  );
};
