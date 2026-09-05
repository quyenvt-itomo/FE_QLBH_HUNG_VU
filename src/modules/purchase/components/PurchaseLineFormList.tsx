import React from "react";
import {
  DeleteOutlined,
  HolderOutlined,
  InfoCircleOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, FormInstance, Input, Select, Upload, UploadProps } from "antd";
import { ReactSortable } from "react-sortablejs";
import { AppSelect, InputMoney, InputQuantity } from "@/shared/components";
import { ProductAddSelect } from "@/modules/product/components/Select";
import {
  Product,
  collectUnits,
  getDefaultPricePerUnit,
  getDefaultPurchaseUnit,
} from "@/modules/product";
import { Purchase, PurchaseLine } from "../purchase.model";
import { formatVnd, getLineProduct } from "../purchase.util";
import { randomId } from "@/shared/utils/common.util";
import { useAutoResetItem } from "@/shared/hooks";
import { PurchaseFile } from "../purchase.file";
import { formatMoney } from "@/shared/utils";

interface Props {
  form: FormInstance<Purchase>;
  onImportFile: (file: File) => void;
  onProductInfo?: (product: Product) => void;
}

const { Dragger } = Upload;

export const PurchaseLineFormList: React.FC<Props> = ({ form, onImportFile, onProductInfo }) => {
  const [defaultProduct, setDefaultProduct] = useAutoResetItem<Product>();
  const lines = Form.useWatch("lines", form) || [];

  const uploadProps: UploadProps = {
    name: "file",
    accept: ".xlsx,.xls",
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      onImportFile(file as unknown as File);
      return false;
    },
  };

  const addProduct = (product?: Product | null) => {
    if (!product || lines.some((line: PurchaseLine) => line.productId === product.id)) return;

    setDefaultProduct(product);
    const unit = getDefaultPurchaseUnit(product);
    form.setFieldValue("lines", [
      {
        tempId: randomId(),
        productId: product.id,
        product,
        unitId: unit?.id || product.baseUnitId,
        unit,
        quantity: 1,
        unitPrice: getDefaultPricePerUnit(product, unit?.id || product.baseUnitId || "") || 0,
      },
      ...lines,
    ]);
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="w-[650px]">
          <ProductAddSelect
            value={defaultProduct?.id}
            className="w-[650px]"
            placeholder="Tìm mã hoặc tên hàng để thêm"
            onChangeData={addProduct}
          />
        </div>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Thêm từ Excel</Button>
        </Upload>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto rounded-md border">
        <table className="w-full min-w-[1090px] table-auto border-collapse text-sm">
          <colgroup>
            <col style={{ width: 48 }} />
            <col style={{ width: 55 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 280 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 140 }} />
          </colgroup>
          <thead className="bg-primary/20 text-gray-900">
            <tr>
              <th className="px-3 py-2" />
              <th className="px-3 py-2 text-center font-semibold">STT</th>
              <th className="px-3 py-2 text-left font-semibold">Mã hàng</th>
              <th className="px-3 py-2 text-left font-semibold">Tên hàng</th>
              <th className="px-3 py-2 text-left font-semibold">ĐVT</th>
              <th className="px-3 py-2 text-right font-semibold">Số lượng</th>
              <th className="px-3 py-2 text-right font-semibold">Đơn giá</th>
              <th className="px-3 py-2 text-right font-semibold">Thành tiền</th>
            </tr>
          </thead>
          <Form.List name="lines">
            {(fields, { remove }) => (
              <ReactSortable
                tag="tbody"
                list={fields.map((field, index) => ({
                  ...(lines[index] || {}),
                  __sortableId: String(
                    lines[index]?.tempId || lines[index]?.id || field.key || index,
                  ),
                }))}
                setList={(newList) => {
                  form.setFieldValue(
                    "lines",
                    newList.map(({ __sortableId, ...line }) => line),
                  );
                }}
                animation={180}
                handle=".purchase-line-drag-handle"
              >
                {fields.map((field, index) => {
                  const line = lines[field.name] as PurchaseLine | undefined;
                  const product = getLineProduct(line);
                  const units = line?.product ? collectUnits(line.product, line.unit) : [];
                  const total = Number(line?.quantity || 0) * Number(line?.unitPrice || 0);

                  return (
                    <tr
                      key={field.key}
                      className="border-b border-slate-200 dark:border-slate-700 group hover:bg-primary/5 transition-colors ease-in-out"
                    >
                      <td className="px-0.5 py-2">
                        <div className="flex flex-col">
                          <Button
                            type="text"
                            danger
                            title="Xóa hàng hóa"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          />
                          <span
                            className="purchase-line-drag-handle flex h-8 w-8 cursor-grab items-center justify-center text-slate-400 hover:text-primary active:cursor-grabbing"
                            title="Kéo để sắp xếp"
                          >
                            <HolderOutlined />
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-center text-gray-500">{index + 1}</td>
                      <td className="px-3 py-2 align-top font-mono text-blue-600">
                        {product.code || "—"}
                      </td>
                      <td className="min-w-0 px-3 py-2 align-top">
                        <div className="flex items-center gap-1">
                          <span className="truncate" title={product.name}>
                            {product.name || "—"}
                          </span>
                          {line?.product && (
                            <Button
                              type="text"
                              size="small"
                              className="!h-5 !w-5 !p-0 !text-slate-500 hover:!text-primary"
                              icon={<InfoCircleOutlined />}
                              title="Xem chi tiết hàng hóa"
                              onClick={(event) => {
                                event.stopPropagation();
                                onProductInfo?.(line.product as Product);
                              }}
                            />
                          )}
                        </div>
                        <Form.Item name={[field.name, "note"]} noStyle>
                          <Input
                            variant="borderless"
                            className="!h-5 !w-full !p-0 !text-xs !italic"
                            placeholder="Ghi chú..."
                          />
                        </Form.Item>
                      </td>
                      <td className="px-0.5 py-2 align-top">
                        <Form.Item name={[field.name, "unitId"]} noStyle>
                          <AppSelect
                            allowClear={false}
                            options={units.map((unit) => ({ value: unit.id, label: unit.name }))}
                            onChange={(unitId) => {
                              const unit = units.find((item) => item.id === unitId);
                              form.setFieldValue(["lines", field.name, "unit"], unit);
                            }}
                          />
                        </Form.Item>
                      </td>
                      <td className="px-0.5 py-2 align-top">
                        <Form.Item
                          name={[field.name, "quantity"]}
                          noStyle
                          rules={[{ required: true, type: "number", min: 0.0001 }]}
                        >
                          <InputQuantity placeholder="Nhập số lượng" />
                        </Form.Item>
                      </td>
                      <td className="px-0.5 py-2 align-top">
                        <Form.Item name={[field.name, "unitPrice"]} noStyle>
                          <InputMoney placeholder="Nhập đơn giá" />
                        </Form.Item>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="h-8 flex items-center justify-end font-medium">
                          {formatMoney(total)}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {fields.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="h-[280px] border-b border-slate-200 p-0 dark:border-slate-700"
                    >
                      <Dragger {...uploadProps} className="!border-0 !bg-transparent">
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined className="text-4xl text-primary" />
                        </p>
                        <p className="font-semibold text-gray-800">Thêm sản phẩm từ file Excel</p>
                        <p className="text-sm text-slate-500">
                          Kéo thả file Excel vào đây hoặc chọn file dữ liệu
                        </p>
                        <button
                          type="button"
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(event) => {
                            event.stopPropagation();
                            void PurchaseFile.downloadTemplate();
                          }}
                        >
                          Tải biểu mẫu
                        </button>
                        <p className="mt-3 text-primary">Chọn file dữ liệu</p>
                      </Dragger>
                    </td>
                  </tr>
                )}
              </ReactSortable>
            )}
          </Form.List>
        </table>
      </div>
    </div>
  );
};
