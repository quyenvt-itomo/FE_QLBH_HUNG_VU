import React, { useEffect } from "react";
import dayjs from "dayjs";
import { App, Button, Form, Input, Modal, Radio, Upload, UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Icon } from "@iconify/react";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import {
  AppDatePicker,
  AppSelect,
  InputQuantity,
  Label,
  SubmitButton,
} from "@/shared/components";
import {
  Product,
  ProductFile,
  ProductAddSelect,
  buildProductSnapshot,
  collectUnits,
  getProductsByCodes,
  readProductExcel,
} from "@/modules/product";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { randomId } from "@/shared/utils/common.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { setFormErrors } from "@/shared/utils/form.util";
import {
  InternalExport,
  InternalExportType,
  internalExportTypeOptions,
} from "../internalExport.model";
import { TrashIcon } from "@heroicons/react/24/outline";

const getConversionRate = (product: Product, unitId?: string) => {
  if (!unitId || unitId === product.baseUnitId) return 1;
  return Number(product.extraUnits?.find((item) => item.unitId === unitId)?.conversionRate) || 1;
};

export const InternalExportModal: React.FC<AddUpdateModalProps<InternalExport>> = ({
  open,
  editData,
  defaultData,
  errors,
  loading,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<any>();
  const { modal, message } = App.useApp();
  const { currentStore } = useGlobalData();
  const [selectedProduct, setSelectedProduct] = useAutoResetItem<Product>();
  const id = editData?.id || randomId();
  const lines = Form.useWatch("lines", form) || [];

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);

  const addProduct = (product?: Product | null) => {
    if (!product) return;
    setSelectedProduct(product);
    const existingLineIndex = lines.findIndex((line: any) => line.productId === product.id);
    if (existingLineIndex >= 0) {
      const existingQuantity = Number(lines[existingLineIndex]?.quantity || 0);
      form.setFieldValue(["lines", existingLineIndex, "quantity"], existingQuantity + 1);
      return;
    }

    const unit = product.baseUnit || collectUnits(product)[0];
    form.setFieldValue("lines", [
      {
      tempId: randomId(),
      productId: product.id,
      product,
      productSnapshot: buildProductSnapshot(product),
      unitId: unit?.id || product.baseUnitId,
      unit,
      unitSnapshot: unit,
      conversionRateAtTime: getConversionRate(product, unit?.id || product.baseUnitId || undefined),
      quantity: 1,
      },
      ...lines,
    ]);
  };

  const importExcel = async (file: File) => {
    try {
      const rows = await readProductExcel(file);
      if (!rows.length) {
        message.warning("File Excel chưa có dòng hàng hóa hợp lệ");
        return;
      }

      const products = await getProductsByCodes([...new Set(rows.map((row) => row.code))]);
      const productMap = new Map(
        products.map((product) => [product.code.trim().toLowerCase(), product]),
      );
      const missingRows = rows.filter((row) => !productMap.has(row.code.trim().toLowerCase()));
      const importedLines = rows
        .map((row) => {
          const product = productMap.get(row.code.trim().toLowerCase());
          if (!product) return null;

          const unit =
            collectUnits(product, product.baseUnit).find(
              (item) => item.name.toLowerCase() === row.unitName,
            ) ||
            product.baseUnit ||
            collectUnits(product)[0];

          return {
            tempId: randomId(),
            productId: product.id,
            product,
            productSnapshot: buildProductSnapshot(product),
            unitId: unit?.id || product.baseUnitId,
            unit,
            unitSnapshot: unit,
            conversionRateAtTime: getConversionRate(
              product,
              unit?.id || product.baseUnitId || undefined,
            ),
            quantity: row.quantity,
          };
        })
        .filter(Boolean);

      form.setFieldValue("lines", [...(form.getFieldValue("lines") || []), ...importedLines]);

      if (missingRows.length) {
        modal.warning({
          title: "Không tìm thấy hàng hóa",
          content: (
            <div>
              Không tìm thấy hàng hóa có mã:
              <ul className="mt-2 list-disc pl-5">
                {missingRows.map((row, index) => (
                  <li key={row.code + "-" + index} className="font-mono">
                    {row.code}
                  </li>
                ))}
              </ul>
              <Button
                type="link"
                className="!px-0"
                onClick={() => void ProductFile.exportRows(missingRows.map((row) => row.cells))}
              >
                Tải file các dòng chưa thêm
              </Button>
            </div>
          ),
        });
      } else {
        message.success("Đã thêm " + importedLines.length + " hàng hóa từ Excel");
      }
    } catch {
      message.error("Không thể đọc file Excel. Vui lòng dùng đúng biểu mẫu hàng hóa.");
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    accept: ".xlsx,.xls",
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      void importExcel(file as unknown as File);
      return Upload.LIST_IGNORE;
    },
  };

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
      width={1350}
      title={(editData ? "Sửa" : "Thêm") + " phiếu xuất nội bộ"}
      onCancel={close}
      afterOpenChange={(isOpen) => {
        if (!isOpen) {
          form.resetFields();
          return;
        }
        if (!editData) return;
        form.setFieldsValue(parseFormDataDates(editData));
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={finish}
        className="flex min-h-0 flex-col"
        initialValues={{
          ...parseFormDataDates(defaultData || {}),
          type: defaultData?.type || InternalExportType.USAGE,
          occurredAt: dayjs(),
          lines: defaultData?.lines || [],
        }}
      >
        <div className="flex min-h-0 flex-1 gap-4">
          <div className="order-2 h-full w-80 shrink-0 overflow-y-auto rounded-md border border-gray-200 bg-white">
            <div className="p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Form.Item
              name="type"
              label={<Label title="Loại xuất" />}
              rules={[{ required: true, message: "Vui lòng chọn loại xuất" }]}
            >
              <Radio.Group className="w-full" buttonStyle="solid">
                {internalExportTypeOptions.map((option) => (
                  <Radio.Button
                    key={option.value}
                    value={option.value}
                    className="w-1/2 text-center"
                  >
                    {option.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item name="code" label={<Label title="Số phiếu" />}>
              <Input placeholder="Tự động nếu để trống" />
            </Form.Item>
            <Form.Item
              name="occurredAt"
              label={<Label title="Ngày xuất" required />}
              rules={[{ required: true, message: "Vui lòng chọn ngày xuất" }]}
            >
              <AppDatePicker />
            </Form.Item>
            <Form.Item name="reason" label={<Label title="Mục đích" />}>
              <Input placeholder="Nhập mục đích xuất" />
            </Form.Item>
          </div>
            </div>
          </div>

          <div className="order-1 flex h-full min-w-0 flex-1 flex-col">
        <Form.List name="lines">
          {(fields, { remove }) => (
            <div className="flex h-full min-h-0 flex-1 flex-col">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="w-[650px]">
                  <ProductAddSelect
                    value={selectedProduct?.id}
                    className="w-[650px]"
                    query={{ storeId: currentStore?.id } as any}
                    placeholder={
                      currentStore
                        ? "Tìm mã hoặc tên hàng để thêm"
                        : "Vui lòng chọn cửa hàng trước"
                    }
                    onChangeData={addProduct}
                    showCostPrice
                    showStock
                    disabled={!currentStore}
                  />
                </div>
                <Upload {...uploadProps} disabled={!currentStore}>
                  <Button icon={<Icon icon="bytesize:import" />}>Thêm từ Excel</Button>
                </Upload>
              </div>
              <div className="min-h-0 flex-1 overflow-auto rounded-md border">
                  <table className="min-w-[1050px] w-full border-collapse text-sm">
                    <colgroup>
                      <col style={{ width: 55 }} />
                      <col style={{ width: 160 }} />
                      <col />
                      <col style={{ width: 150 }} />
                      <col style={{ width: 140 }} />
                      <col style={{ width: 55 }} />
                    </colgroup>
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr className="border-b">
                        {["STT", "Mã hàng", "Tên hàng", "Đơn vị tính", "Số lượng", ""].map(
                          (title, index) => (
                            <th
                              key={title + "-" + index}
                              className={
                                "border-r px-3 py-1 font-semibold last:border-r-0 " +
                                (index === 0
                                  ? "text-center"
                                  : index === 4
                                    ? "text-right"
                                    : "text-left")
                              }
                            >
                              {title}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {!fields.length ? (
                        <tr className="border-t">
                          <td colSpan={6} className="h-[280px] border-b p-0">
                            <Upload.Dragger
                              {...uploadProps}
                              disabled={!currentStore}
                              className="!border-0 !bg-transparent"
                            >
                              <p className="ant-upload-drag-icon">
                                <InboxOutlined className="text-4xl text-primary" />
                              </p>
                              <p className="font-semibold text-gray-800">
                                Thêm sản phẩm từ file Excel
                              </p>
                              <p className="text-sm text-slate-500">
                                Kéo thả file Excel vào đây hoặc chọn file dữ liệu
                              </p>
                              <button
                                type="button"
                                className="text-blue-500 hover:text-blue-700"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  void ProductFile.downloadTemplate();
                                }}
                              >
                                Tải biểu mẫu
                              </button>
                              <p className="mt-3 text-primary">
                                {currentStore
                                  ? "Chọn file dữ liệu"
                                  : "Vui lòng chọn cửa hàng trước"}
                              </p>
                            </Upload.Dragger>
                          </td>
                        </tr>
                      ) : (
                        fields.map(({ key, name, ...restField }) => {
                          const line = lines[name] || {};
                          const product = line.product as Product | undefined;
                          const units = product ? collectUnits(product, line.unit) : [];

                          return (
                            <tr key={key} className="border-b">
                              <td className="border-r px-3 py-1 text-center">{name + 1}</td>
                              <td className="border-r px-3 py-1 font-mono">
                                {line.product?.code || line.productSnapshot?.code || "--"}
                              </td>
                              <td className="border-r px-3 py-1">
                                {line.product?.name || line.productSnapshot?.name || "--"}
                              </td>
                              <td className="border-r p-0">
                                <Form.Item
                                  {...restField}
                                  name={[name, "unitId"]}
                                  rules={[{ required: true, message: "Chọn đơn vị tính" }]}
                                  noStyle
                                >
                                  <AppSelect
                                    className="w-full"
                                    variant="borderless"
                                    options={units.map((unit) => ({
                                      value: unit.id,
                                      label: unit.name,
                                    }))}
                                    allowClear={false}
                                    onChange={(unitId) => {
                                      const unit = units.find((item) => item.id === unitId);
                                      form.setFieldValue(["lines", name, "unit"], unit);
                                      form.setFieldValue(["lines", name, "unitSnapshot"], unit);
                                      form.setFieldValue(
                                        ["lines", name, "conversionRateAtTime"],
                                        product ? getConversionRate(product, unitId) : 1,
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </td>
                              <td className="border-r p-0">
                                <Form.Item
                                  {...restField}
                                  name={[name, "quantity"]}
                                  rules={[
                                    {
                                      required: true,
                                      type: "number",
                                      min: 0.000001,
                                      message: "Nhập số lượng lớn hơn 0",
                                    },
                                  ]}
                                  noStyle
                                >
                                  <InputQuantity min={0} variant="borderless" />
                                </Form.Item>
                              </td>
                              <td className="px-1 text-center">
                                <Button
                                  type="text"
                                  danger
                                  htmlType="button"
                                  onClick={() => remove(name)}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          )}
        </Form.List>
          </div>
        </div>

        <div className="mt-3 flex shrink-0 justify-end border-t pt-3">
          <SubmitButton loading={loading} onCancel={close} />
        </div>
      </Form>
    </Modal>
  );
};
