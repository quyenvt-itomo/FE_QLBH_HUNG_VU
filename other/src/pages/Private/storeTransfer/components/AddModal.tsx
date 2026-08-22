import React, { useEffect, useState } from "react";
import { Input, Modal, Form, message } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../models/base/interface";
import { setFormCode, setFormErrors } from "../../../../utils/formUtils";
import { formatFormData } from "../../../../utils/dateUtils";
import SubmitButton from "../../../../components/button/SubmitButton";
import { collectProductVariantFromLines, randomId } from "../../../../utils/common";
import Label from "../../../../components/display/Label";
import { DatePickerCustom, InputQuantity } from "../../../../components/input";
import StoreSelect from "../../../../components/select/StoreSelect";
import dayjs from "dayjs";
import Title from "../../../../components/display/Title";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import ProductVariantSelect from "../../../../components/tree_select/ProductVariantSelect";
import { IProductVariant } from "../../../../models/product";
import { ProductVariantTitle } from "../../../../components/display/ProductVariantTitle";
import { formatQuantity } from "../../../../utils/formatNumber";
import { IStoreTransfer } from "../../../../models/storeTransfer";

const AddModal: React.FC<AddUpdateModalProps<IStoreTransfer>> = ({
  open,
  loading,
  errors,
  onAdd,
  onClose,
}) => {
  const [form] = Form.useForm<IStoreTransfer>();
  const id = randomId();
  const fromStore = Form.useWatch("fromStore", form);
  const toStore = Form.useWatch("toStore", form);
  const lines = Form.useWatch("lines", form) || [];
  const variantsInLines = collectProductVariantFromLines(lines);

  const [defaultProduct, setDefaultProduct] = useState<IProductVariant | undefined>(undefined);

  useEffect(() => {
    if (!defaultProduct) return;

    setDefaultProduct(undefined);
  }, [defaultProduct]);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<IStoreTransfer>["onFinish"] = async (values: IStoreTransfer) => {
    const formattedData = formatFormData({
      ...values,
      id,
      tempId: id,
    });

    onAdd?.(formattedData);
  };

  const handleCancel = () => {
    onClose?.();
    form.resetFields();
  };

  return (
    <Modal
      title={"Thêm phiếu chuyển kho"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={1080}
      height="calc(100vh - 20px)"
      className="full-screen-modal"
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }
        setFormCode({
          form,
          type: "storeTransfer",
          field: "code",
        });
      }}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={(errors) => {
          const errorMessages = Array.from(
            new Set(errors.errorFields.flatMap((err) => err.errors)),
          );

          message.error({
            content: <div className="text-sm">{errorMessages.join(", ")}</div>,
            duration: 5,
          });
        }}
        className="flex flex-col h-[calc(100%-8px)] mt-2 overflow-y-auto overflow-x-hidden scrollbar-hide"
        initialValues={{
          occurredAt: dayjs(),
        }}
      >
        <div className="flex flex-shrink-0 w-full sticky top-0 bg-gradient-to-b from-white to-transparent h-4 z-10" />
        <div className="flex flex-col gap-2 mt-0 mb-auto">
          <div className="grid grid-cols-2 gap-x-24">
            {/* ===== CỘT TRÁI ===== */}
            <div className="flex flex-col">
              {/* Mã định mức */}

              <Form.Item
                name="code"
                label={<Label title="Số phiếu" required width={88} />}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã phiếu",
                  },
                ]}
                help=""
                className="w-full"
              >
                <Input placeholder="Nhập mã phiếu" className="h-8 w-full" readOnly />
              </Form.Item>

              <Form.Item
                name="fromStoreId"
                label={<Label title="Kho xuất" required width={88} />}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn kho xuất",
                  },
                ]}
              >
                <StoreSelect
                  placeholder="Chọn kho xuất"
                  defaultData={fromStore}
                  hideOptions={toStore ? [toStore] : undefined}
                  onChangeData={(data) => {
                    form.setFieldsValue({
                      fromStore: data as any,
                      lines: [], // reset lines khi thay đổi kho xuất
                    });
                  }}
                />
              </Form.Item>
              <Form.Item name="fromStore" hidden />

              <Form.Item name="reason" label={<Label title="Lý do" width={88} />}>
                <Input placeholder="Lý do chuyển kho" className="h-8 w-full" />
              </Form.Item>
            </div>

            {/* ===== CỘT PHẢI ===== */}
            <div className="flex flex-col">
              <Form.Item
                name="occurredAt"
                label={<Label title="Thời gian" required width={88} />}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian",
                  },
                ]}
              >
                <DatePickerCustom onlyDate={false} />
              </Form.Item>

              <Form.Item
                name="toStoreId"
                label={<Label title="Kho nhập" required width={88} />}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn kho nhập",
                  },
                ]}
              >
                <StoreSelect
                  placeholder="Chọn kho nhập"
                  defaultData={toStore}
                  hideOptions={fromStore ? [fromStore] : undefined}
                  onChangeData={(data) => {
                    form.setFieldValue("toStore", data);
                  }}
                />
              </Form.Item>
              <Form.Item name="toStore" hidden />

              <Form.Item name="note" label={<Label title="Ghi chú" width={88} />}>
                <Input placeholder="Ghi chú" className="h-8 w-full" />
              </Form.Item>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Form.List name="lines">
              {(fields, { add, remove }) => (
                <>
                  <div className="flex items-center gap-6">
                    <Title content="Chi tiết phiếu" level={5} />
                    <div className="w-[calc(100%-250px)] relative">
                      <ProductVariantSelect
                        value={defaultProduct?.id ? [defaultProduct.id] : undefined}
                        defaultData={defaultProduct ? [defaultProduct] : undefined}
                        onChangeData={(values) => {
                          const data = values && values.length > 0 ? values[0] : undefined;
                          setDefaultProduct(data);
                          add({
                            productVariant: data,
                            productVariantId: data?.id,
                          });
                        }}
                        storeId={fromStore?.id}
                        disabled={!fromStore?.id}
                        hideOptions={variantsInLines}
                        suffixIcon={false}
                        className="search-select"
                        placeholder={
                          fromStore
                            ? "Tìm kiếm và chọn hàng hóa để thêm vào phiếu"
                            : "Vui lòng chọn kho xuất"
                        }
                      />
                      <MagnifyingGlassIcon className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 text-[#747E76]" />
                    </div>
                  </div>
                  <div className="border border-gray-88 rounded-lg overflow-y-hidden overflow-x-auto w-full">
                    <table className="w-full table-auto">
                      <colgroup>
                        <col style={{ width: 60 }} />
                        <col style={{ width: 250 }} />
                        <col style={{ width: 80 }} />
                        <col style={{ width: 180 }} />
                        <col style={{ minWidth: "150px" }} />
                        <col style={{ width: 120 }} />
                        <col style={{ width: 32 }} />
                      </colgroup>
                      <thead>
                        <tr className="bg-primary text-white font-medium">
                          <th className="px-2 font-semibold">STT</th>
                          <th className="px-2 font-semibold">Hàng hóa</th>
                          <th className="px-2 font-semibold">ĐVT</th>
                          <th className="px-2 font-semibold">
                            Số lượng <span className="text-red-500">*</span>
                          </th>
                          <th className="px-2 font-semibold">Ghi chú</th>
                          <th className="px-2 font-semibold">Tồn kho</th>
                          <th className="px-2 font-semibold w-8"></th>
                        </tr>
                      </thead>

                      <tbody>
                        {fields.map((field, index) => (
                          <tr key={field.key}>
                            <td
                              className={`
                            px-2 border border-l-0 border-gray-88 text-center cursor-not-allowed
                            ${index === lines.length - 1 ? "border-b-0" : ""}
                            `}
                            >
                              {index + 1}
                            </td>
                            <td
                              className={`
                            px-2 border border-gray-88 cursor-not-allowed
                            ${index === lines.length - 1 ? "border-b-0" : ""}
                            `}
                            >
                              <div className="flex w-64 flex-col overflow-x-hidden">
                                <ProductVariantTitle
                                  item={lines[index]?.productVariant}
                                  fontSize={10}
                                />
                              </div>
                            </td>
                            <td
                              className={`
                              px-2 border border-gray-88 text-center cursor-not-allowed
                              ${index === lines.length - 1 ? "border-b-0" : ""}
                              `}
                            >
                              {lines[index]?.productVariant?.product?.unit?.name || ""}
                            </td>
                            <td
                              className={`
                              border border-gray-88
                              ${index === lines.length - 1 ? "border-b-0" : ""}
                              `}
                            >
                              <Form.Item
                                {...field}
                                name={[field.name, "quantity"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập số lượng",
                                  },
                                ]}
                                noStyle
                              >
                                <InputQuantity
                                  placeholder="Nhập số lượng"
                                  className="!border-none !shadow-none !ring-0"
                                />
                              </Form.Item>
                            </td>
                            <td
                              className={`
                              border border-gray-88
                              ${index === lines.length - 1 ? "border-b-0" : ""}
                              `}
                            >
                              <Form.Item {...field} name={[field.name, "note"]} noStyle>
                                <Input className="w-full h-8 !border-none !shadow-none !ring-0" />
                              </Form.Item>
                            </td>
                            <td
                              className={`
                              px-2 border border-r-0 border-gray-88 text-right cursor-not-allowed bg-yellow-50
                              ${index === lines.length - 1 ? "border-b-0" : ""}
                              `}
                            >
                              {formatQuantity(lines[index]?.productVariant?.stockQty) || "0"}
                            </td>
                            <td
                              className={`
                              px-2 border border-r-0 border-gray-88 text-center
                              ${index === lines.length - 1 ? "border-b-0" : ""}
                              `}
                            >
                              <div className="h-full w-full flex items-center justify-center">
                                <button
                                  type="button"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => remove(field.name)}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {fields.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-2 text-center py-4 text-gray-500">
                              Chưa có hàng hóa nào được thêm vào phiếu
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </Form.List>
          </div>
        </div>

        {/* Submit */}
        <div className="flex w-full justify-center sticky bottom-0 bg-gradient-to-t from-white to-transparent pt-4">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};

export default AddModal;
