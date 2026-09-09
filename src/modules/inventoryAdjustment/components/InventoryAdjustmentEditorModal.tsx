import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Button, Form, Input, Modal } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { AppDatePicker, FormSection, InputQuantity, Label, SubmitButton } from "@/shared/components";
import { ProductSelect } from "@/modules/product";
import { buildProductSnapshot, collectUnits } from "@/modules/product/product.util";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { InventoryAdjustment } from "../inventoryAdjustment.model";

export const InventoryAdjustmentEditorModal: React.FC<AddUpdateModalProps<InventoryAdjustment>> = ({ open, editData, loading, errors, onAdd, onEdit, onClose }) => {
  const [form] = Form.useForm<any>();
  const { currentStore } = useGlobalData();
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
    if (editData) onEdit?.(payload);
    else onAdd?.(payload);
  };
  const close = () => { form.resetFields(); onClose(); };
  return <Modal open={open} centered destroyOnClose maskClosable={false} footer={null} width={950} title={`${editData ? "Sửa" : "Thêm"} phiếu kiểm kho`} onCancel={close} afterOpenChange={(isOpen) => {
    if (isOpen) form.setFieldsValue(editData ? { ...editData, occurredAt: editData.occurredAt ? dayjs(editData.occurredAt) : dayjs() } : { occurredAt: dayjs(), lines: [] });
    else form.resetFields();
  }}>
    <Form form={form} layout="vertical" onFinish={finish}>
      <FormSection title="Thông tin kiểm kho">
        <Form.Item name="code" label={<Label title="Số phiếu" />}><Input placeholder="Tự động nếu để trống" /></Form.Item>
        <Form.Item name="occurredAt" label={<Label title="Ngày kiểm" required />} rules={[{ required: true }]}><AppDatePicker /></Form.Item>
        <Form.Item name="reason" label={<Label title="Lý do" />}><Input.TextArea rows={2} placeholder="Nhập lý do kiểm kho" /></Form.Item>
      </FormSection>
      <FormSection title="Số lượng kiểm đếm">
        <Form.List name="lines">
          {(fields, { add, remove }) => <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_130px_130px_48px] gap-2 text-xs font-semibold text-secondary"><span>Hàng hóa</span><span className="text-right">Tồn hệ thống</span><span className="text-right">Thực tế</span><span /></div>
            {fields.map(({ key, name, ...restField }) => {
              const line = lines[name] || {};
              const expected = Number(line.expectedQuantity || line.product?.stockMetadata?.byStore?.[currentStore?.id || ""]?.quantity || 0);
              return <div key={key} className="grid grid-cols-[1fr_130px_130px_48px] items-start gap-2">
                <Form.Item {...restField} name={[name, "productId"]} rules={[{ required: true, message: "Chọn hàng hóa" }]}>
                  <ProductSelect defaultData={line.product} showStock placeholder="Chọn hàng hóa" onChangeData={(product) => {
                    if (!product) return;
                    const unit = collectUnits(product)[0];
                    const stock = Number(product.stockMetadata?.byStore?.[currentStore?.id || ""]?.quantity || 0);
                    form.setFieldValue(["lines", name, "product"], product);
                    form.setFieldValue(["lines", name, "productSnapshot"], buildProductSnapshot(product));
                    form.setFieldValue(["lines", name, "unitId"], unit?.id || null);
                    form.setFieldValue(["lines", name, "unitSnapshot"], unit || null);
                    form.setFieldValue(["lines", name, "conversionRateAtTime"], 1);
                    form.setFieldValue(["lines", name, "expectedQuantity"], stock);
                    form.setFieldValue(["lines", name, "countedQuantity"], stock);
                  }} />
                </Form.Item>
                <div className="pt-2 text-right text-sm">{expected}</div>
                <Form.Item {...restField} name={[name, "countedQuantity"]} rules={[{ required: true, type: "number", min: 0, message: "Nhập số lượng thực tế" }]}><InputQuantity min={0} /></Form.Item>
                <Button danger type="text" onClick={() => remove(name)}>Xóa</Button>
              </div>;
            })}
            <Button type="dashed" onClick={() => add({ tempId: randomId(), expectedQuantity: 0, countedQuantity: 0, conversionRateAtTime: 1 })}>+ Thêm hàng hóa</Button>
          </div>}
        </Form.List>
      </FormSection>
      <div className="flex justify-end"><SubmitButton loading={loading} onCancel={close} /></div>
    </Form>
  </Modal>;
};
