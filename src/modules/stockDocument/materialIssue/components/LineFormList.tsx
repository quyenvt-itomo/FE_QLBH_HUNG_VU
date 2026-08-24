import React, { useMemo } from "react";
import { Form, FormInstance, Input } from "antd";
import { FormListTable, FormColumn } from "@/shared";
import { InputQuantity } from "@/shared";
import { ProductSelect } from "@/modules/product";
import { collectProduct, buildProductSnapshot, collectUnits } from "@/modules/product/product.util";
import { randomId, resolveByPath } from "@/shared/utils/common.util";
import { Product as ProductModel } from "@/modules/product/product.model";
import { StockDocumentLine } from "@/modules/stockDocumentLine";
import { StockDocument } from "../../stockDocument.model";

interface Props {
  form: FormInstance<StockDocument>;
}

// ──── Xuất NVL: SL thực xuất (stockQuantity) là editable, còn lại từ LSX/BOM ────
export const MaterialIssueLineFormList: React.FC<Props> = ({ form }) => {
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
        title: "Vật tư",
        dataIndex: "productId",
        width: 260,
        fixed: "left",
        editable: true,
        render: ({ record }) => resolveByPath(record, ["product", "name"], "--"),
      },
      {
        title: "Mã VT",
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
        title: "SL thực xuất",
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
        title="Danh sách vật tư"
        form={form}
        fieldName="lines"
        columns={columns}
        records={lines as any[]}
        showDelete
        renderAdd={(add) => (
          <ProductSelect
            placeholder="Tìm và chọn vật tư để thêm"
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
