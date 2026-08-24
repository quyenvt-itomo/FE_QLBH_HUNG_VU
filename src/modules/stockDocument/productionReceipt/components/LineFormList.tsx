import React, { useMemo } from "react";
import { Form, FormInstance, Input } from "antd";
import { FormListTable, FormColumn } from "@/shared/components";
import { InputQuantity } from "@/shared/components";
import { ProductSelect } from "@/modules/product";
import { collectProduct, buildProductSnapshot, collectUnits } from "@/modules/product/product.util";
import { randomId } from "@/shared/utils/common.util";
import { StockDocumentLine } from "@/modules/stockDocumentLine";

interface Props {
  form: FormInstance<any>;
}

// ──── Nhập TP: SL thực nhập (stockQuantity) là editable, còn lại từ LSX ────
export const ProductionReceiptLineFormList: React.FC<Props> = ({ form }) => {
  const lines = Form.useWatch("lines", form) || [];
  const hideProducts = collectProduct(lines);

  const columns: FormColumn<StockDocumentLine>[] = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "__idx",
        width: 40,
        align: "center",
        render: ({ index }) => index + 1,
      },
      {
        title: "Hàng hóa",
        dataIndex: "productId",
        width: 260,
        fixed: "left",
        editable: true,
        render: ({ record }) => {
          const p = (record as any)?.productSnapshot;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{p?.name || "--"}</span>
              <span className="text-xs text-gray-400 font-mono">{p?.code || "--"}</span>
            </div>
          );
        },
      },
      {
        title: "Mã hàng",
        dataIndex: "productCode",
        width: 120,
        render: ({ record }) => {
          const p = (record as any)?.productSnapshot;
          return <span className="text-gray-500 font-mono">{p?.code || "--"}</span>;
        },
      },
      {
        title: "ĐVT",
        dataIndex: "unitId",
        width: 90,
        align: "center",
        render: ({ record }) => {
          const u = (record as any)?.unitSnapshot;
          return u?.name || "--";
        },
      },
      {
        title: "SL thực nhập",
        dataIndex: "stockQuantity",
        width: 120,
        align: "right",
        editable: true,
        render: () => <InputQuantity variant="borderless" min={0} notRightAlign />,
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        width: 160,
        editable: true,
        render: () => <Input placeholder="Nhập ghi chú" variant="borderless" />,
      },
    ],
    [],
  );

  return (
    <div className="px-6 pb-4">
      <FormListTable
        title="Danh sách thành phẩm"
        form={form}
        fieldName="lines"
        columns={columns}
        records={lines as any[]}
        showDelete
        renderAdd={(add) => (
          <ProductSelect
            placeholder="Tìm và chọn hàng hóa để thêm"
            hideOptions={hideProducts as any}
            onChangeData={(product) => {
              if (!product) return;
              if (hideProducts.find((item) => item.id === product.id)) return;
              const units = collectUnits(product);
              const unit = units[0] || null;
              add({
                tempId: randomId(),
                productId: product.id,
                productSnapshot: buildProductSnapshot(product),
                product,
                unitId: unit?.id || null,
                unitSnapshot: unit,
                conversionRateAtTime: 1,
                stockQuantity: 0,
                requestQuantity: 0,
                additionalQuantity: 0,
                billingQuantity: 0,
              });
            }}
          />
        )}
      />
    </div>
  );
};
