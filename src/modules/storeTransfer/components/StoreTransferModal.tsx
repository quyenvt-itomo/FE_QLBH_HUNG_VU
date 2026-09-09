import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { AppDatePicker, FormSection, InputQuantity, Label, SubmitButton } from "@/shared/components";
import { ProductSelect } from "@/modules/product";
import { StoreSelect } from "@/modules/store/components/Select";
import { buildProductSnapshot, collectUnits } from "@/modules/product/product.util";
import { randomId } from "@/shared/utils/common.util";
import { formatFormData } from "@/shared/utils/date.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { StoreTransfer } from "../storeTransfer.model";

const toFormValues = (data?: StoreTransfer) => {
  if (!data) return { occurredAt: dayjs(), lines: [] } as any;
  return { ...data, occurredAt: data.occurredAt ? dayjs(data.occurredAt) : dayjs() } as any;
};

export const StoreTransferModal: React.FC<AddUpdateModalProps<StoreTransfer>> = ({
  open,
  editData,
  errors,
  loading,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<any>();
  const id = editData?.id || randomId();
  const lines = Form.useWatch("lines", form) || [];
  const fromStore = Form.useWatch("fromStore", form);
  const toStore = Form.useWatch("toStore", form);

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);

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

  const close = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      centered
      destroyOnClose
      maskClosable={false}
      footer={null}
      width={1000}
      title={`${editData ? "Sửa" : "Thêm"} phiếu chuyển kho`}
      onCancel={close}
      afterOpenChange={(isOpen) => {
        if (isOpen) form.setFieldsValue(toFormValues(editData));
        else form.resetFields();
      }}
    >
      <Form form={form} layout="vertical" onFinish={finish}>
        <FormSection title="Thông tin chuyển kho">
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item name="code" label={<Label title="Số phiếu" />}>
                <Input placeholder="Tự động nếu để trống" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="occurredAt" label={<Label title="Ngày chuyển" required />} rules={[{ required: true }]}>
                <AppDatePicker />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="reason" label={<Label title="Lý do" />}>
                <Input placeholder="Nhập lý do chuyển kho" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="fromStoreId" label={<Label title="Kho chuyển đi" required />} rules={[{ required: true, message: "Vui lòng chọn kho chuyển đi" }]}>
                <StoreSelect defaultData={fromStore} onChangeData={(value) => form.setFieldValue("fromStore", value || null)} />
              </Form.Item>
              <Form.Item name="fromStore" hidden />
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="toStoreId" label={<Label title="Kho nhận" required />} rules={[{ required: true, message: "Vui lòng chọn kho nhận" }, { validator: (_, value) => value && value === form.getFieldValue("fromStoreId") ? Promise.reject(new Error("Kho nhận phải khác kho chuyển đi")) : Promise.resolve() }]}>
                <StoreSelect defaultData={toStore} onChangeData={(value) => form.setFieldValue("toStore", value || null)} />
              </Form.Item>
              <Form.Item name="toStore" hidden />
            </Col>
          </Row>
        </FormSection>

        <FormSection title="Hàng hóa chuyển kho">
          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_120px_48px] gap-2 text-xs font-semibold text-secondary">
                  <span>Hàng hóa</span><span className="text-right">Số lượng</span><span />
                </div>
                {fields.map(({ key, name, ...restField }) => {
                  const line = lines[name] || {};
                  return (
                    <div key={key} className="grid grid-cols-[1fr_120px_48px] items-start gap-2">
                      <Form.Item {...restField} name={[name, "productId"]} rules={[{ required: true, message: "Chọn hàng hóa" }]}>
                        <ProductSelect
                          defaultData={line.product}
                          placeholder="Chọn hàng hóa"
                          onChangeData={(product) => {
                            if (!product) return;
                            const unit = collectUnits(product)[0];
                            form.setFieldValue(["lines", name, "product"], product);
                            form.setFieldValue(["lines", name, "productSnapshot"], buildProductSnapshot(product));
                            form.setFieldValue(["lines", name, "unitId"], unit?.id || null);
                            form.setFieldValue(["lines", name, "unitSnapshot"], unit || null);
                            form.setFieldValue(["lines", name, "conversionRateAtTime"], 1);
                          }}
                        />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "quantity"]} rules={[{ required: true, type: "number", min: 0.000001, message: "Số lượng phải lớn hơn 0" }]}>
                        <InputQuantity min={0} />
                      </Form.Item>
                      <Button danger type="text" onClick={() => remove(name)}>Xóa</Button>
                    </div>
                  );
                })}
                <Button type="dashed" onClick={() => add({ tempId: randomId(), quantity: 1, conversionRateAtTime: 1 })}>
                  + Thêm hàng hóa
                </Button>
              </div>
            )}
          </Form.List>
        </FormSection>
        <div className="flex justify-end"><SubmitButton loading={loading} onCancel={close} /></div>
      </Form>
    </Modal>
  );
};
