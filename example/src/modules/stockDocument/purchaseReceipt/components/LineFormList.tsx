import React, { useMemo } from "react";
import { App, Form, FormInstance, Input } from "antd";
import { FormListTable, FormColumn } from "@/shared/components/form/FormListTable";
import { InputQuantity } from "@/shared/components/input";
import { randomId, resolveByPath } from "@/shared/utils/common.util";
import { StockDocument } from "../../stockDocument.model";
import { StockDocumentLine } from "@/modules/stockDocumentLine";
import {
  collectPurchaseLine,
  PurchaseLine,
  PurchaseLineMultipleSelect,
} from "@/modules/purchaseLine";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { MagnifyingGlassIcon } from "@/shared/icons";
import { SortOrder } from "@/shared/constants/enum";
import { formatMoney, formatPercentage, formatQuantity } from "@/shared/utils/number.util";
import { StockDocumentCalculationUtil } from "../../stockDocument.util";
import { makeFormListEnterHandler } from "@/shared/utils/formListKeyboard";

interface Props {
  form: FormInstance<StockDocument>;
  showImportInfo?: boolean;
}

// ──── Nhập mua: SL chứng từ (billingQuantity) là editable, còn lại từ đơn hàng ────
export const PurchaseReceiptLineFormList: React.FC<Props> = ({ form, showImportInfo }) => {
  const { message } = App.useApp();
  const purchase = Form.useWatch("purchase", form);
  const [defaultPurchaseLine, setDefaultPurchaseLine] = useAutoResetItem<PurchaseLine>();
  const lines = Form.useWatch("lines", form) || [];
  const hidePurchaseLines = collectPurchaseLine(lines);

  const calc = new StockDocumentCalculationUtil();

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
        render: ({ record }) => resolveByPath(record, ["product", "name"]),
      },
      {
        title: "Mã hàng",
        dataIndex: "productCode",
        width: 120,
        render: ({ record }) => resolveByPath(record, ["product", "code"]),
      },
      {
        title: "ĐVT",
        dataIndex: "unitId",
        width: 90,
        align: "center",
        render: ({ record }) => resolveByPath(record, ["unit", "name"]),
      },
      {
        title: "SL chứng từ",
        dataIndex: "billingQuantity",
        width: 100,
        align: "right",
        editable: true,
        render: ({ record }) => {
          const purchaseLine = record.purchaseLine;
          const { quantity = 0, deliveredQuantity = 0 } = purchaseLine || {};
          const remainingQuantity = quantity - deliveredQuantity;
          const placeholder =
            remainingQuantity > 0 ? `Chưa giao: ${remainingQuantity}` : "Đã giao hết";
          return <InputQuantity variant="borderless" placeholder={placeholder} min={0} />;
        },
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        width: 120,
        align: "right",
        render: ({ record }) => formatMoney(record.purchaseLine?.unitPrice),
      },
      {
        title: "Thành tiền",
        dataIndex: "subTotal",
        width: 120,
        align: "right",
        render: ({ record }) => formatMoney(calc.calculateSubTotal(record)),
      },
      {
        title: "%VAT",
        dataIndex: "taxRate",
        width: 90,
        align: "right",
        render: ({ record }) => formatPercentage(record.purchaseLine?.taxRate),
      },
      {
        title: "Tiền VAT",
        dataIndex: "taxAmount",
        width: 90,
        align: "right",
        render: ({ record }) => formatMoney(calc.calculateTaxAmount(record)),
      },
      {
        title: "Tổng tiền",
        dataIndex: "grossAmount",
        width: 90,
        align: "right",
        render: ({ record }) => formatMoney(calc.calculateGrossAmount(record)),
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
        sortable
        renderAdd={(add) => (
          <PurchaseLineMultipleSelect
            value={defaultPurchaseLine ? [defaultPurchaseLine.id] : undefined}
            defaultData={defaultPurchaseLine ? [defaultPurchaseLine] : undefined}
            query={{
              purchaseId: purchase?.id,
              sortBy: "sortOrder",
              sortOrder: SortOrder.ASC,
            }}
            placeholder={
              purchase?.id ? "Chọn hàng hóa từ đơn mua hàng" : "Vui lòng chọn đơn mua hàng trước"
            }
            hideOptions={hidePurchaseLines}
            prefix={<MagnifyingGlassIcon className="w-6 h-6 text-secondary" />}
            suffixIcon={null}
            disabled={!purchase?.id}
            onChangeData={(data) => {
              const item = data?.[0];
              setDefaultPurchaseLine(item);
              if (!item) return;

              add({
                tempId: randomId(),
                productId: item.productId,
                product: item.product,
                unitId: item.unitId,
                unit: item.unit,
                purchaseLineId: item.id,
                purchaseLine: item,
              });
            }}
          />
        )}
        renderSummary={() => {
          const total = calc.calculateTotalForArray(lines);
          return (
            <>
              <td className="border border-l-0 border-b-0 text-center" colSpan={4}>
                <span className="font-semibold">Tổng</span>
              </td>
              <td className="border border-b-0 text-end px-3 font-semibold">
                {formatQuantity(total.totalBillingQuantity)}
              </td>
              <td className="border border-b-0" />
              <td className="border border-b-0 text-end">
                <span className="px-3">{formatMoney(total.totalSubTotal)}</span>
              </td>
              <td className="border border-b-0" />
              <td className="px-3 border border-b-0 text-end">
                {formatMoney(total.totalTaxAmount)}
              </td>
              <td className="border border-b-0 text-end text-primary font-semibold">
                <span className="px-3">{formatMoney(total.totalGrossAmount)}</span>
              </td>
              <td className="border border-b-0" />
            </>
          );
        }}
        onKeyDown={makeFormListEnterHandler(
          { type: "select", message: "Vui lòng chọn hàng hóa ở ô tìm kiếm để thêm vào đơn" },
          { messageApi: message },
        )}
      />
    </div>
  );
};
