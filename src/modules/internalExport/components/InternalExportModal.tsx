import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Button, Form, Input, Modal, Select } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { AppDatePicker, FormSection, InputQuantity, Label, SubmitButton } from "@/shared/components";
import { ProductSelect } from "@/modules/product";
import { buildProductSnapshot, collectUnits } from "@/modules/product/product.util";
import { randomId } from "@/shared/utils/common.util";
import { formatFormData } from "@/shared/utils/date.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { InternalExport, internalExportTypeItems, InternalExportTypeEnum } from "../internalExport.model";

export const InternalExportModal: React.FC<AddUpdateModalProps<InternalExport>> = ({ open, editData, errors, loading, onAdd, onEdit, onClose }) => {
  const [form] = Form.useForm<any>();
  const id = editData?.id || randomId();
  const lines = Form.useWatch("lines", form) || [];
  useEffect(() => { if (errors) setFormErrors(form, errors); }, [errors, form]);
  const finish = (values: any) => {
    const payload = {
      ...values,
      id,
      tempId: id,
      occurredAt: values.occurredAt?.toISOString?.() || values.occurredAt,
      lines: (values.lines || []).map(({ product, unit, ...line }: any) => line),
    };
    const formatted = formatFormData(payload as any);
    if (editData) onEdit?.(formatted);
    else onAdd?.(formatted);
  };
  const close = () => { form.resetFields(); onClose(); };
  return <Modal open={open} centered destroyOnClose maskClosable={false} footer={null} width={900} title={`${editData ? "Sửa" : "Thêm"} phiếu xuất nội bộ`} onCancel={close} afterOpenChange={(isOpen) => {
    if (isOpen) form.setFieldsValue(editData ? { ...editData, occurredAt: editData.occurredAt ? dayjs(editData.occurredAt) : dayjs() } : { type: InternalExportTypeEnum.USAGE, occurredAt: dayjs(), lines: [] });
    else form.resetFields();
  }}>
    <Form form={form} layout="vertical" onFinish={finish}>
      <FormSection title="Thông tin phiếu xuất">
        <Form.Item name="type" label={<Label title="Loại xuất" />} rules={[{ required: true, message: "Vui lòng chọn loại xuất" }]}><Select options={internalExportTypeItems} /></Form.Item>
        <Form.Item name="code" label={<Label title="Số phiếu" />}><Input placeholder="Tự động nếu để trống" /></Form.Item>
        <Form.Item name="occurredAt" label={<Label title="Ngày xuất" required />} rules={[{ required: true }]}><AppDatePicker /></Form.Item>
        <Form.Item name="reason" label={<Label title="Mục đích xuất" />}><Input.TextArea rows={2} placeholder="Ví dụ: sử dụng nội bộ, cấp phát, hỏng hủy..." /></Form.Item>
      </FormSection>
      <FormSection title="Hàng hóa xuất">
        <Form.List name="lines">
          {(fields, { add, remove }) => <div className="flex flex-col gap-2">
            {fields.map(({ key, name, ...restField }) => {
              const line = lines[name] || {};
              return <div key={key} className="grid grid-cols-[1fr_120px_48px] items-start gap-2">
                <Form.Item {...restField} name={[name, "productId"]} rules={[{ required: true, message: "Chọn hàng hóa" }]}>
                  <ProductSelect defaultData={line.product} placeholder="Chọn hàng hóa" onChangeData={(product) => {
                    if (!product) return;
                    const unit = collectUnits(product)[0];
                    form.setFieldValue(["lines", name, "product"], product);
                    form.setFieldValue(["lines", name, "productSnapshot"], buildProductSnapshot(product));
                    form.setFieldValue(["lines", name, "unitId"], unit?.id || null);
                    form.setFieldValue(["lines", name, "unitSnapshot"], unit || null);
                    form.setFieldValue(["lines", name, "conversionRateAtTime"], 1);
                  }} />
                </Form.Item>
                <Form.Item {...restField} name={[name, "quantity"]} rules={[{ required: true, type: "number", min: 0.000001, message: "Số lượng phải lớn hơn 0" }]}><InputQuantity min={0} /></Form.Item>
                <Button danger type="text" onClick={() => remove(name)}>Xóa</Button>
              </div>;
            })}
            <Button type="dashed" onClick={() => add({ tempId: randomId(), quantity: 1, conversionRateAtTime: 1 })}>+ Thêm hàng hóa</Button>
          </div>}
        </Form.List>
      </FormSection>
      <div className="flex justify-end"><SubmitButton loading={loading} onCancel={close} /></div>
    </Form>
  </Modal>;
};
