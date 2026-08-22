import React, { useMemo } from "react";
import { Form, FormInstance, Input } from "antd";
import { FormListTable, FormColumn } from "@/shared/components/form/FormListTable";
import { InputQuantity } from "@/shared/components/input";
import { ProductSelect } from "@/modules/product";
import { collectProduct, buildProductSnapshot, collectUnits } from "@/modules/product/product.util";
import { randomId, resolveByPath } from "@/shared/utils/common.util";
import { Product as ProductModel } from "@/modules/product/product.model";
import { StockDocumentLine } from "@/modules/stockDocumentLine/stockDocumentLine.model";
import { StockDocument } from "../../stockDocument.model";

interface Props {
  form: FormInstance<StockDocument>;
}

// ──── Xuất bán: SL yêu cầu (requestQuantity) + Kg+ (additionalQuantity) là editable ────
export const OrderIssueLineFormList: React.FC<Props> = ({ form }) => {
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
        render: ({ record }) => resolveByPath(record, ["product", "name"], "--"),
      },
      {
        title: "Mã hàng",
        dataIndex: "productCode",
        width: 120,
        render: ({ record }) => resolveByPath(record, ["product", "code"], "--"),
      },
      {
        title: "ĐVT",
        dataIndex: "unitId",
        width: 90,
        align: "center",
        render: ({ record }) => resolveByPath(record, ["unit", "name"], "--"),
      },
      {
        title: "SL yêu cầu",
        dataIndex: "requestQuantity",
        width: 120,
        align: "right",
        editable: true,
        render: () => <InputQuantity variant="borderless" min={0} notRightAlign />,
      },
      {
        title: "Kg+",
        dataIndex: "additionalQuantity",
        width: 100,
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
        title="Danh sách hàng hóa"
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
                requestQuantity: 0,
                stockQuantity: 0,
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
