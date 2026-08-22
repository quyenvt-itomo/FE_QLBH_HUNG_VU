import React, { useEffect, useState } from "react";
import { Input, Modal, Form, message, Row, Col, Button } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../models/base/interface";
import { setFormCode, setFormErrors } from "../../../../utils/formUtils";
import { formatFormData } from "../../../../utils/dateUtils";
import SubmitButton from "../../../../components/button/SubmitButton";
import {
  collectProductVariantFromLines,
  getProductVariantByBarcode,
  randomId,
} from "../../../../utils/common";
import Label from "../../../../components/display/Label";
import { DatePickerCustom, InputMoney, InputQuantity } from "../../../../components/input";
import dayjs from "dayjs";
import Title from "../../../../components/display/Title";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import ProductVariantSelect from "../../../../components/tree_select/ProductVariantSelect";
import { ProductVariantTitle } from "../../../../components/display/ProductVariantTitle";
import EmployeeSelect from "../../../../components/select/EmployeeSelect";
import { IProductVariant } from "../../../../models/product";
import { IInventoryAdjustment } from "../../../../models/store/inventoryAdjustment";
import { formatQuantity } from "../../../../utils/formatNumber";
import { checkModule } from "../../../../utils/permissionUtils";
import { useClientData } from "../../../../hooks/core/useClientData";
import { Icon } from "@iconify/react";
import { useBarcodeScanner } from "../../../../hooks/core/useBarcodeScanner";

const AddModal: React.FC<AddUpdateModalProps<IInventoryAdjustment>> = ({
  open,
  loading,
  errors,
  onAdd,
  onClose,
}) => {
  const [form] = Form.useForm<IInventoryAdjustment>();
  const id = randomId();
  const occurredAt = Form.useWatch("occurredAt", form);
  const { permissions } = useClientData();
  const adjustedBy = Form.useWatch("adjustedBy", form);
  const lines = Form.useWatch("lines", form) || [];
  const variantsInLines = collectProductVariantFromLines(lines);
  const summaryRow = lines.reduce(
    (summary, line) => {
      summary.countedQty += line.countedQty || 0;
      summary.expectedQty += line.expectedQty || 0;
      summary.diffQty += (line.expectedQty || 0) - (line.countedQty || 0);
      return summary;
    },
    { countedQty: 0, expectedQty: 0, diffQty: 0 },
  );

  const [defaultProductVariant, setDefaultProductVariant] = useState<IProductVariant | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!defaultProductVariant) return;

    setDefaultProductVariant(undefined);
  }, [defaultProductVariant]);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const handleBarcodeSubmit = async (barcode: string) => {
    if (!barcode) return;
    if (!checkModule(permissions, "product")) {
      message.error(
        "Bạn không có quyền xem sản phẩm, vui lòng liên hệ quản trị viên để được cấp quyền.",
      );
      return;
    }

    const variant = await getProductVariantByBarcode(barcode.trim());
    if (!variant) {
      // TODO: notify không tìm thấy
      message.error("Không tìm thấy hàng hóa");
      return;
    }

    handleAddProductVariant(variant);
  };

  useBarcodeScanner({
    enabled: true,
    onScan: handleBarcodeSubmit,
  });

  const handleAddProductVariant = (data: IProductVariant) => {
    // Kiểm tra nếu đã có variant trong danh sách thì tăng số lượng lên 1
    const existingIndex = lines.findIndex((line) => line.productVariantId === data.id);
    if (existingIndex !== -1) {
      message.info("Hàng hóa đã có trong phiếu, đã tự động tăng số lượng lên 1");
      return;
    }

    const newLine = {
      productVariant: data,
      productVariantId: data?.id,
      countedQty: data?.stockQty,
      costPriceAtTime: data?.costPrice || 0,
    };

    const updatedLines = [...lines, newLine];
    form.setFieldValue("lines", updatedLines);
  };

  const onFinish: FormProps<IInventoryAdjustment>["onFinish"] = async (
    values: IInventoryAdjustment,
  ) => {
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
      title={"Thêm phiếu kiểm kho"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      centered
      width={1280}
      height="calc(100vh - 20px)"
      className="full-screen-modal"
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }
        setFormCode({ form, type: "inventoryAdjustment", field: "code" });
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
        className="flex flex-col h-[calc(100%-8px)] mt-4 overflow-y-auto overflow-x-hidden scrollbar-hide"
        initialValues={{ occurredAt: dayjs() }}
      >
        <div className="flex flex-col gap-2 h-[calc(100%-64px)]">
          <Row gutter={[128, 0]}>
            <Col span={12}>
              <Form.Item
                name="code"
                label={<Label title="Số phiếu" required width={108} />}
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
            </Col>
            <Col span={12}>
              <Form.Item
                name="occurredAt"
                label={<Label title="Thời gian" required width={108} />}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian",
                  },
                ]}
              >
                <DatePickerCustom />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="reason" label={<Label title="Lý do" width={108} />}>
                <Input placeholder="Lý do kiểm kho" className="h-8 w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="adjustedById"
                label={<Label title="NV thực hiện" required width={108} />}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn nhân viên thực hiện",
                  },
                ]}
              >
                <EmployeeSelect
                  placeholder="Chọn nhân viên thực hiện"
                  defaultData={adjustedBy}
                  onChangeData={(data) => {
                    form.setFieldValue("adjustedBy", data);
                  }}
                />
              </Form.Item>
              <Form.Item name="adjustedBy" hidden />
            </Col>
            <Col span={12}>
              <Form.Item name="note" label={<Label title="Ghi chú" width={108} />}>
                <Input placeholder="Ghi chú" className="h-8 w-full" />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>

          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-2 h-[calc(100%-170px)]">
                <div className="flex items-center gap-6">
                  <Title content="Chi tiết phiếu" level={5} />
                  <div className="w-[calc(100%-250px)] relative">
                    <ProductVariantSelect
                      offsetAt={dayjs(occurredAt).toISOString()}
                      value={defaultProductVariant?.id ? [defaultProductVariant.id] : undefined}
                      defaultData={defaultProductVariant ? [defaultProductVariant] : undefined}
                      onChangeData={(values) => {
                        const value = values && values.length > 0 ? values[0] : undefined;
                        setDefaultProductVariant(value);
                        console.log({
                          value,
                        });
                        add({
                          productVariant: value,
                          productVariantId: value?.id,
                          countedQty: value?.stockQty,
                          costPriceAtTime: value?.costPrice || 0,
                        });
                      }}
                      // disabled={!store?.id}
                      hideOptions={variantsInLines}
                      suffixIcon={false}
                      className="search-select"
                      placeholder="Tìm kiếm và chọn hàng hóa để thêm vào phiếu"
                    />
                    <MagnifyingGlassIcon className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 text-[#747E76]" />
                  </div>
                </div>
                <div className="border border-gray-100 rounded-lg overflow-auto w-full h-[calc(100%-40px)]">
                  <table className="min-w-[1100px] w-full table-fixed">
                    <colgroup>
                      <col style={{ width: 60 }} />
                      <col style={{ width: 250 }} />
                      <col style={{ width: 90 }} />
                      <col style={{ width: 150 }} />
                      <col style={{ width: 150 }} />
                      <col style={{ width: 100 }} />
                      <col style={{ minWidth: "150px" }} />
                      <col style={{ width: 32 }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-primary text-white font-medium sticky top-0 z-10">
                        <th className="px-2 font-semibold">STT</th>
                        <th className="px-2 font-semibold">Hàng hóa</th>
                        <th className="px-2 font-semibold">ĐVT</th>
                        <th className="px-2 font-semibold">Tồn hệ thống</th>
                        <th className="px-2 font-semibold">
                          Tồn thực tế <span className="text-red-500">*</span>
                        </th>
                        <th className="px-2 font-semibold">Chênh lệch</th>
                        <th className="px-2 font-semibold">Ghi chú</th>
                        <th className="px-2 font-semibold w-8"></th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="bg-gray-100 font-medium sticky top-[22px] z-10">
                        <td className="px-[11px] border border-gray-100 text-center" colSpan={3}>
                          Tổng
                        </td>
                        <td className="border border-gray-100 px-2 text-end">
                          {formatQuantity(summaryRow.countedQty)}
                        </td>
                        <td className="border border-gray-100 px-2 text-end">
                          {formatQuantity(summaryRow.expectedQty)}
                        </td>
                        <td
                          className={`border border-gray-100 px-2 text-end ${summaryRow.diffQty < 0 ? "text-red-500" : summaryRow.diffQty > 0 ? "text-green-600" : ""}`}
                        >
                          {formatQuantity(summaryRow.diffQty)}
                        </td>

                        <td className="border border-gray-100" colSpan={2}></td>
                      </tr>
                      {fields.map((field, index) => {
                        const diffQty =
                          (lines[index]?.expectedQty ?? 0) - (lines[index]?.countedQty ?? 0);
                        return (
                          <tr key={field.key}>
                            <td
                              className={`
                                px-2 border border-l-0 border-gray-100 text-center cursor-not-allowed
                                ${index === lines.length - 1 ? "border-b-0" : ""}
                                `}
                            >
                              {index + 1}
                            </td>
                            <td
                              className={`
                                px-2 border border-gray-100 cursor-not-allowed
                                ${index === lines.length - 1 ? "border-b-0" : ""}
                                `}
                            >
                              <div className="flex w-64 flex-col overflow-x-hidden">
                                <ProductVariantTitle item={lines[index]?.productVariant} />
                              </div>
                            </td>
                            <td
                              className={`
                                px-2 border border-gray-100 text-center cursor-not-allowed
                                ${index === lines.length - 1 ? "border-b-0" : ""}
                                `}
                            >
                              {lines[index]?.productVariant?.product?.unit?.name || ""}
                            </td>
                            <td
                              className={`
                                border border-gray-100 px-2 text-end cursor-not-allowed
                                ${index === lines.length - 1 ? "border-b-0" : ""}
                                `}
                            >
                              {formatQuantity(lines[index]?.countedQty) || 0}
                            </td>
                            <td
                              className={`
                                border border-gray-100
                                ${index === lines.length - 1 ? "border-b-0" : ""}
                                `}
                            >
                              <Form.Item
                                name={[field.name, "expectedQty"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập số lượng tồn thực tế",
                                  },
                                ]}
                                noStyle
                              >
                                <InputQuantity
                                  placeholder="Nhập số lượng tồn thực tế"
                                  className="!border-none !shadow-none !ring-0"
                                />
                              </Form.Item>
                            </td>
                            <td
                              className={`
                                border border-gray-100 px-2 text-end cursor-not-allowed
                                ${index === lines.length - 1 ? "border-b-0" : ""}
                                ${diffQty < 0 ? "text-red-500" : diffQty > 0 ? "text-green-600" : ""}
                                `}
                            >
                              {formatQuantity(diffQty)}
                            </td>
                            {/* <td
                                className={`
                                border border-gray-100 px-2 text-end cursor-not-allowed
                                ${index === lines.length - 1 ? "border-b-0" : ""}
                                ${diffMoney < 0 ? "text-red-600" : diffMoney > 0 ? "text-green-600" : ""}
                                `}
                              >
                                {formatMoney(diffMoney)}
                              </td> */}
                            <td
                              className={`
                                border border-gray-100
                                ${index === lines.length - 1 ? "border-b-0" : ""}
                                `}
                            >
                              <Form.Item name={[field.name, "note"]} noStyle>
                                <Input className="w-full h-8 !border-none !shadow-none !ring-0" />
                              </Form.Item>
                            </td>
                            <td
                              className={`
                                border border-r-0 border-gray-100 text-center
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
                        );
                      })}
                      {fields.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-2 text-center py-4 text-gray-500">
                            Chưa có hàng hóa nào được thêm vào phiếu
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Form.List>
        </div>

        {/* Submit */}
        <div className="flex w-full justify-center gap-16 items-end sticky bottom-0 bg-gradient-to-t from-white to-transparent pt-4">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};

export default AddModal;
