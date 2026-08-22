import React, { useEffect } from "react";
import { Modal, Form, FormProps, App, Input } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { ShippingPlan } from "../shippingPlan.model";
import { setFormErrors } from "@/shared/utils/form.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { handleCloseWithPendingFiles, randomId } from "@/shared/utils/common.util";
import SubmitButton from "@/shared/components/button/SubmitButton";
import Label from "@/shared/components/display/Label";
import { PartnerSelect } from "@/modules/partner/components/Select";
import { PartnerType } from "@/modules/partner/partner.model";
import { InputMoney, InputQuantity, InputPercentage } from "@/shared/components/input";
import { AppDatePicker } from "@/shared/components/input/AppDatePicker";
import { CalculationUtil } from "@/shared/utils/calculation.util";
import dayjs from "dayjs";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";
import { EntityFile, FileCategory } from "@/shared/constants/enum";

export const ShippingPlanAddUpdateModal: React.FC<AddUpdateModalProps<ShippingPlan>> = ({
  open,
  editData,
  loading,
  errors,
  defaultData,
  onAdd,
  onEdit,
  onClose,
}) => {
  const id = editData?.id || randomId();
  const { modal } = App.useApp();
  const [form] = Form.useForm<ShippingPlan>();
  const calc = new CalculationUtil();

  const unitPrice = Form.useWatch("unitPrice", form) || 0;
  const quantity = Form.useWatch("quantity", form) || 0;
  const taxRate = Form.useWatch("taxRate", form) || 0;

  const subTotal = calc.calculateSubTotal({ quantity, unitPrice } as any);
  const totalAmount =
    calc.calculateGrossAmount({ subTotal, taxAmount: (subTotal * taxRate) / 100 } as any) ||
    subTotal * (1 + taxRate / 100);

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<ShippingPlan>["onFinish"] = async (values) => {
    const formattedData = formatFormData({ ...values, id: editData?.id || randomId() });

    editData ? onEdit?.(formattedData) : onAdd?.(formattedData);
  };

  return (
    <Modal
      title={editData ? "Sửa phương án vận chuyển" : "Thêm phương án vận chuyển"}
      open={open}
      onCancel={() => handleCloseWithPendingFiles(id, onClose)}
      footer={null}
      centered
      maskClosable={false}
      width={480}
      afterOpenChange={(isOpen) => {
        if (!isOpen) {
          form.resetFields();
          return;
        }
        if (editData) {
          const formatted = parseFormDataDates(editData);
          form.setFieldsValue(formatted);
          return;
        }
        form.resetFields();
        if (defaultData) form.setFieldsValue(parseFormDataDates(defaultData));
      }}
    >
      <Form form={form} onFinish={onFinish} className="mt-4" initialValues={{ plannedAt: dayjs() }}>
        <Form.Item name="purchaseId" hidden />
        <Form.Item name="orderId" hidden />

        <Form.Item
          name="partnerId"
          label={<Label title="Đơn vị vận chuyển" required />}
          rules={[{ required: true, message: "Vui lòng chọn đơn vị vận chuyển" }]}
        >
          <PartnerSelect
            query={{ type: PartnerType.SHIPPING_PROVIDER }}
            placeholder="Chọn đơn vị vận chuyển"
          />
        </Form.Item>

        <Form.Item
          name="unitPrice"
          label={<Label title="Cước VC (chưa VAT)" required />}
          rules={[{ required: true, message: "Vui lòng nhập cước vận chuyển" }]}
        >
          <InputMoney notRightAlign />
        </Form.Item>

        <Form.Item
          name="quantity"
          label={<Label title="Số chuyến" required />}
          rules={[{ required: true, message: "Vui lòng nhập số chuyến" }]}
        >
          <InputQuantity notRightAlign />
        </Form.Item>

        <Form.Item label={<Label title="Tiền cước" />}>
          <InputMoney value={subTotal} disabled notRightAlign />
        </Form.Item>

        <Form.Item name="taxRate" label={<Label title="%VAT" />}>
          <InputPercentage notRightAlign />
        </Form.Item>

        <Form.Item label={<Label title="Tổng tiền" />}>
          <InputMoney value={totalAmount} disabled notRightAlign />
        </Form.Item>

        <Form.Item name="note" label={<Label title="Ghi chú" />}>
          <Input.TextArea
            autoSize={{
              minRows: 2,
              maxRows: 4,
            }}
            maxLength={500}
            placeholder="Nhập ghi chú..."
          />
        </Form.Item>

        <div className="flex justify-between items-end mt-auto mb-0 gap-3 action-sticky-bottom">
          <div className="flex w-[520px]">
            <FileUploadBox
              defaultFiles={editData?.document}
              oId={id}
              entity={EntityFile.SHIPPING_PLAN}
              category={FileCategory.DOCUMENT}
              maxCount={2}
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
