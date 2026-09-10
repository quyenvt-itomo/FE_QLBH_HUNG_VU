import React from "react";
import { DeleteOutlined, HolderOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input, Upload, UploadProps } from "antd";
import { ReactSortable } from "react-sortablejs";
import { AppSelect, InputMoney, QuantityStepper } from "@/shared/components";
import { ProductAddSelect } from "@/modules/product/components/Select";
import {
  Product,
  collectUnits,
  getCostPriceByStore,
  getDefaultPurchaseUnit,
} from "@/modules/product";
import { ProductDetailButton } from "@/modules/product/components/ProductDetailButton";
import { Purchase, PurchaseLine } from "../purchase.model";
import { getLineProduct } from "../purchase.util";
import { randomId } from "@/shared/utils/common.util";
import { useAutoResetItem, useGlobalData } from "@/shared/hooks";
import { PurchaseFile } from "../purchase.file";
import { formatMoney } from "@/shared/utils";
import { Icon } from "@iconify/react";

interface Props {
  form: FormInstance<Purchase>;
  onImportFile: (file: File) => void;
}

const { Dragger } = Upload;

const getCurrentCostPrice = (product: Product, storeId?: string, unitId?: string | null) =>
  getCostPriceByStore({ product, storeId, unitId }) ?? 0;

export const PurchaseReturnLineFormList: React.FC<Props> = ({ form, onImportFile }) => {
  const { currentStore } = useGlobalData();
  const [defaultProduct, setDefaultProduct] = useAutoResetItem<Product>();
  const lines = Form.useWatch("returnLines", form) || [];

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
    if (!product) return;
    setDefaultProduct(product);

    const existingLineIndex = lines.findIndex(
      (line: PurchaseLine) => line.productId === product.id,
    );
    if (existingLineIndex >= 0) {
      const existingQuantity = Number(lines[existingLineIndex]?.quantity || 0);
      form.setFieldValue(["returnLines", existingLineIndex, "quantity"], existingQuantity + 1);
      return;
    }

    const unit = getDefaultPurchaseUnit(product);
    const currentCostPrice = getCurrentCostPrice(
      product,
      currentStore?.id,
      unit?.id || product.baseUnitId,
    );
    form.setFieldValue("returnLines", [
      {
        tempId: randomId(),
        productId: product.id,
        product,
        unitId: unit?.id,
        unit,
        quantity: 1,
        currentCostPrice,
        unitPrice: currentCostPrice,
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
            showCostPrice
            showStock
          />
        </div>
        <Upload {...uploadProps}>
          <Button icon={<Icon icon="bytesize:import" />}>Thêm từ Excel</Button>
        </Upload>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto rounded-md border">
        <table className="w-full min-w-[1240px] table-auto border-collapse text-sm">
          <colgroup>
            <col style={{ width: 48 }} />
            <col style={{ width: 55 }} />
            <col style={{ width: 140 }} />
            <col style={{ minWidth: 280 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 150 }} />
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
              <th className="pl-3 pr-10 py-2 text-right font-semibold">Số lượng</th>
              <th className="px-3 py-2 text-right font-semibold">Giá nhập</th>
              <th className="px-3 py-2 text-right font-semibold">Giá trả lại</th>
              <th className="px-3 py-2 text-right font-semibold">Thành tiền</th>
            </tr>
          </thead>
          <Form.List name="returnLines">
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
                    "returnLines",
                    newList.map(({ __sortableId, ...line }) => line),
                  );
                }}
                animation={180}
                handle=".purchase-line-drag-handle"
              >
                {React.Children.toArray([
                  fields.map((field, index) => {
                    const line = lines[field.name] as PurchaseLine | undefined;
                    const product = getLineProduct(line);
                    const units = line?.product ? collectUnits(line.product, line.unit) : [];
                    const currentCostPrice = product.id
                      ? getCurrentCostPrice(product, currentStore?.id, line?.unitId)
                      : Number((line as any)?.currentCostPrice || 0);
                    const total = Number(line?.quantity || 0) * Number(line?.unitPrice || 0);

                    return (
                      <tr
                        key={field.key}
                        className="group border-b border-slate-200 transition-colors ease-in-out hover:bg-primary/5 dark:border-slate-700"
                      >
                        <td className="px-0.5">
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
                        <td className="px-3 py-2 text-center align-top text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2 align-top font-mono text-blue-600">
                          {product.code || "—"}
                        </td>
                        <td className="min-w-0 px-3 py-2 align-top">
                          <div className="flex items-center gap-1">
                            <span className="truncate" title={product.name}>
                              {product.name || "—"}
                            </span>
                            {line?.productId && <ProductDetailButton productId={line.productId} />}
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
                                const nextCostPrice = product.id
                                  ? getCurrentCostPrice(product, currentStore?.id, unitId)
                                  : 0;
                                form.setFieldValue(
                                  ["returnLines", field.name, "unit"] as any,
                                  unit,
                                );
                                form.setFieldValue(
                                  ["returnLines", field.name, "currentCostPrice"] as any,
                                  nextCostPrice,
                                );
                              }}
                            />
                          </Form.Item>
                        </td>
                        <td className="px-0.5 py-2 align-top">
                          <Form.Item
                            name={[field.name, "quantity"]}
                            noStyle
                            rules={[
                              {
                                required: true,
                                type: "number",
                                min: 0.0001,
                                message: "Số lượng phải lớn hơn 0",
                              },
                            ]}
                          >
                            <QuantityStepper allowInput placeholder="Nhập số lượng" />
                          </Form.Item>
                        </td>
                        <td className="px-3 py-2 text-right align-top text-slate-500">
                          {formatMoney(currentCostPrice)}
                        </td>
                        <td className="px-0.5 py-2 align-top">
                          <Form.Item name={[field.name, "unitPrice"]} noStyle>
                            <InputMoney placeholder="Nhập giá trả lại" />
                          </Form.Item>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <div className="flex h-8 items-center justify-end font-medium">
                            {formatMoney(total)}
                          </div>
                        </td>
                      </tr>
                    );
                  }),
                  fields.length === 0 && (
                    <tr>
                      <td colSpan={9} className="h-[280px] border-slate-200 p-6 dark:border-slate-700">
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
                  ),
                ])}
              </ReactSortable>
            )}
          </Form.List>
        </table>
      </div>
    </div>
  );
};
