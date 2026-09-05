import React, { useState } from "react";
import { DeleteOutlined, InfoCircleOutlined, InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input, Select } from "antd";
import { InputMoney, InputQuantity } from "@/shared/components";
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

interface Props {
  form: FormInstance<Purchase>;
  onImportExcel?: () => void;
  onImportFile?: (file: File) => void;
  onProductInfo?: (product: Product) => void;
}

export const PurchaseLineFormList: React.FC<Props> = ({
  form,
  onImportExcel,
  onImportFile,
  onProductInfo,
}) => {
  const [defaultProduct, setDefaultProduct] = useAutoResetItem<Product>();
  const [dragging, setDragging] = useState(false);
  const lines = Form.useWatch("lines", form) || [];

  const addProduct = (product?: Product | null) => {
    if (!product || lines.some((line: PurchaseLine) => line.productId === product.id)) return;

    setDefaultProduct(product);
    const unit = getDefaultPurchaseUnit(product);
    form.setFieldValue("lines", [
      ...lines,
      {
        tempId: randomId(),
        productId: product.id,
        product,
        unitId: unit?.id || product.baseUnitId,
        unit,
        quantity: 1,
        unitPrice: getDefaultPricePerUnit(product, unit?.id || product.baseUnitId || "") || 0,
      },
    ]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onImportFile?.(file);
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col px-4 pb-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <ProductAddSelect
          value={defaultProduct?.id}
          className="w-[650px]"
          placeholder="Tìm mã hoặc tên hàng để thêm"
          onChangeData={addProduct}
        />
        <Button icon={<UploadOutlined />} onClick={onImportExcel}>
          Thêm từ Excel
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto rounded-md">
        <table className="w-full min-w-[1090px] table-auto border-collapse text-sm">
          <colgroup>
            <col style={{ width: 55 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 280 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 48 }} />
          </colgroup>
          <thead className="bg-primary/20 text-gray-900">
            <tr>
              <th className="px-2 py-2 text-center font-semibold">STT</th>
              <th className="px-2 py-2 text-left font-semibold">Mã hàng</th>
              <th className="px-2 py-2 text-left font-semibold">Tên hàng</th>
              <th className="px-2 py-2 text-left font-semibold">ĐVT</th>
              <th className="px-2 py-2 text-right font-semibold">Số lượng</th>
              <th className="px-2 py-2 text-right font-semibold">Đơn giá</th>
              <th className="px-2 py-2 text-right font-semibold">Thành tiền</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <Form.List name="lines">
            {(fields, { remove }) => (
              <tbody>
                {fields.map((field, index) => {
                  const line = lines[field.name] as PurchaseLine | undefined;
                  const product = getLineProduct(line);
                  const units = line?.product ? collectUnits(line.product, line.unit) : [];
                  const total = Number(line?.quantity || 0) * Number(line?.unitPrice || 0);

                  return (
                    <tr key={field.key} className="border-b border-slate-200 dark:border-slate-700">
                      <td className="px-2 py-2 align-top text-center text-gray-500">{index + 1}</td>
                      <td className="px-2 py-2 align-top font-mono text-blue-600">
                        {product.code || "—"}
                      </td>
                      <td className="min-w-0 px-2 py-2 align-top">
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
                      <td className="px-2 py-2 align-top">
                        <Form.Item name={[field.name, "unitId"]} noStyle>
                          <Select
                            className="w-full"
                            options={units.map((unit) => ({ value: unit.id, label: unit.name }))}
                            onChange={(unitId) => {
                              const unit = units.find((item) => item.id === unitId);
                              form.setFieldValue(["lines", field.name, "unit"], unit);
                            }}
                          />
                        </Form.Item>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <Form.Item
                          name={[field.name, "quantity"]}
                          noStyle
                          rules={[{ required: true, type: "number", min: 0.0001 }]}
                        >
                          <InputQuantity />
                        </Form.Item>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <Form.Item name={[field.name, "unitPrice"]} noStyle>
                          <InputMoney />
                        </Form.Item>
                      </td>
                      <td className="px-2 py-2 align-top text-right font-medium">
                        {formatVnd(total)}
                      </td>
                      <td className="px-2 py-2 align-top text-right">
                        <Button
                          type="text"
                          danger
                          title="Xóa hàng hóa"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        />
                      </td>
                    </tr>
                  );
                })}

                {fields.length === 0 && (
                  <tr>
                    <td colSpan={8} className="h-[280px] border-b border-slate-200 p-0 dark:border-slate-700">
                      <div
                        className={`flex h-full min-h-[280px] items-center justify-center transition-colors ${dragging ? "bg-primary/10" : "bg-white"}`}
                        onDragEnter={(event) => {
                          event.preventDefault();
                          setDragging(true);
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDragLeave={(event) => {
                          if (event.currentTarget === event.target) setDragging(false);
                        }}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center gap-3 text-center">
                          <InboxOutlined className="text-4xl text-primary" />
                          <div className="font-semibold text-gray-800">Thêm sản phẩm từ file Excel</div>
                          <div className="text-sm text-slate-500">
                            Kéo thả file Excel vào đây hoặc chọn file dữ liệu
                          </div>
                          <Button type="primary" icon={<UploadOutlined />} onClick={onImportExcel}>
                            Chọn file dữ liệu
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </Form.List>
        </table>
      </div>
    </div>
  );
};
