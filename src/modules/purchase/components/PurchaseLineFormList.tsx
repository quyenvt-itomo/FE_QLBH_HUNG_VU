import React from "react";
import { App, Form, FormInstance, Input, Select } from "antd";
import { FormListTable, FormColumn } from "@/shared/components/form/FormListTable";
import { Purchase } from "../purchase.model";
import { collectProduct, collectUnits, Product, ProductMultipleSelect } from "@/modules/product";
import { InputMoney, InputPercentage, InputQuantity } from "@/shared/components/input";
import { resolveByPath, randomId } from "@/shared/utils/common.util";
import { CalculationUtil } from "@/shared/utils/calculation.util";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { SortOrderEnum } from "@/shared/constants/enum";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { makeFormListEnterHandler } from "@/shared/utils/formListKeyboard";
import { PurchaseLine } from "@/modules/purchaseLine";
import { AppSelect } from "@/shared/components/select/AppSelect";

interface Props {
  form: FormInstance<Purchase>;
  errorCells: Map<number, Set<string>>;
}

export const PurchaseLineFormList: React.FC<Props> = ({ form, errorCells }) => {
  const { message } = App.useApp();
  const [defaultProduct, setDefaultProduct] = useAutoResetItem<Product>();
  const lines: PurchaseLine[] = Form.useWatch("lines", form) || [];
  const calc = new CalculationUtil();
  const hideProducts = collectProduct(lines);

  const columns: FormColumn<PurchaseLine>[] = [
    {
      title: "STT",
      dataIndex: "__idx",
      width: 40,
      align: "center",
      render: ({ index }) => index + 1,
    },
    {
      title: "Tên hàng hóa",
      dataIndex: "productName",
      width: 180,
      fixed: "left",
      render: ({ record }) => (
        <span className="cursor-not-allowed">{resolveByPath(record, ["product", "name"])}</span>
      ),
    },
    {
      title: "Mã hàng hóa",
      dataIndex: "productCode",
      width: 100,
      fixed: "left",
      render: ({ record }) => (
        <span className="cursor-not-allowed">{resolveByPath(record, ["product", "code"])}</span>
      ),
    },
    {
      title: "ĐVT",
      dataIndex: "unitId",
      width: 100,
      align: "center",
      render: ({ record, form, name }) => {
        const p = record?.product;
        if (!p) return null;
        const units = collectUnits(p, record?.unit);

        return (
          <AppSelect
            className={`text-center w-full`}
            options={units.map((u) => ({ value: u.id, label: u.name }))}
            suffixIcon={null}
            value={record?.unitId}
            onChange={(value: string) => {
              const unit = units.find((u: any) => u.id === value);
              form.setFieldValue(["lines", name, "unitId"], value);
              form.setFieldValue(["lines", name, "unit"], unit);
            }}
            variant="borderless"
          />
        );
      },
    },
    {
      title: "SL",
      dataIndex: "quantity",
      width: 100,
      align: "right",
      editable: true,
      render: () => <InputQuantity variant="borderless" />,
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      width: 130,
      align: "right",
      editable: true,
      render: () => <InputMoney variant="borderless" />,
    },
    {
      title: "Thành tiền",
      dataIndex: "subTotal",
      width: 130,
      align: "right",
      render: ({ record }) => formatMoney(calc.calculateSubTotal(record)),
    },
    {
      title: "%VAT",
      dataIndex: "taxRate",
      width: 100,
      align: "right",
      editable: true,
      fillable: true,
      render: () => <InputPercentage variant="borderless" />,
    },
    {
      title: "Tiền VAT",
      dataIndex: "taxAmount",
      width: 130,
      align: "right",
      render: ({ record }) => formatMoney(calc.calculateTaxAmount(record)),
    },
    {
      title: "Tổng tiền",
      dataIndex: "grossAmount",
      width: 130,
      align: "right",
      render: ({ record }) => formatMoney(calc.calculateGrossAmount(record)),
    },
    {
      title: "%Hoa hồng",
      dataIndex: "commissionRate",
      width: 100,
      align: "right",
      className: "yellow-column",
      editable: true,
      fillable: true,
      render: () => <InputPercentage variant="borderless" />,
    },
    {
      title: "Tiền hoa hồng",
      dataIndex: "commissionAmount",
      width: 130,
      align: "right",
      className: "yellow-column",
      render: ({ record }) => formatMoney(calc.calculateCommissionAmount(record)),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 150,
      editable: true,
      render: () => <Input placeholder="Nhập ghi chú" variant="borderless" />,
    },
  ];

  return (
    <div className="mb-4 px-6">
      <FormListTable
        title="Danh sách hàng hóa"
        form={form}
        fieldName="lines"
        sortable
        columns={columns}
        records={lines}
        errorCells={errorCells}
        fillableColumns={["taxRate", "commissionRate"]}
        renderAdd={(add) => (
          <ProductMultipleSelect
            value={defaultProduct ? [defaultProduct.id] : undefined}
            defaultData={defaultProduct ? [defaultProduct] : undefined}
            query={{ sortBy: "type", sortOrder: SortOrderEnum.ASC }}
            placeholder="Tìm kiếm và chọn hàng hóa để thêm"
            hideOptions={hideProducts}
            prefix={<MagnifyingGlassIcon className="w-6 h-6 text-secondary" />}
            suffixIcon={null}
            onChangeData={(data) => {
              const item = data?.[0];
              setDefaultProduct(item);
              if (!item) return;

              add({
                tempId: randomId(),
                productId: item.id,
                product: item,
                unitId: item.baseUnitId,
                unit: item.baseUnit,
                unitPrice: item.price,
                taxRate: item.taxRate,
              });
            }}
          />
        )}
        renderSummary={() => {
          const total = calc.calculatePurchaseTotal(lines);
          return (
            <>
              <td className="border border-l-0 border-b-0 text-center" colSpan={4}>
                <span className="font-semibold">Tổng</span>
              </td>
              <td className="border border-b-0 text-end px-3 font-semibold">
                {formatQuantity(total.quantity)}
              </td>
              <td className="border border-b-0" />
              <td className="border border-b-0 text-end">
                <span className="px-3">{formatMoney(total.subTotal)}</span>
              </td>
              <td className="border border-b-0" />
              <td className="px-3 border border-b-0 text-end">{formatMoney(total.taxAmount)}</td>
              <td className="border border-b-0 text-end text-primary font-semibold">
                <span className="px-3">{formatMoney(total.grossAmount)}</span>
              </td>
              <td className="border border-b-0" />
              <td className="px-3 border border-b-0 text-end text-primary font-semibold">
                {formatMoney(total.totalCommissionAmount)}
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
