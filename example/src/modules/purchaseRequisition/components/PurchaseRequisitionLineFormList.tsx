import React, { useMemo } from "react";
import { collectProduct, collectUnits, Product, ProductTypeTag } from "@/modules/product";
import { PurchaseRequisition, PurchaseRequisitionLine } from "../purchaseRequisition.model";
import { DatePickerCustom, InputMoney, InputQuantity } from "@/shared/components/input";
import { CLASSNAME } from "@/shared/constants/ui";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Form, FormInstance, Input, Select } from "antd";
import { makeFormListEnterHandler } from "@/shared/utils/formListKeyboard";
import { ProductMultipleSelect } from "@/modules/product";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import FormListTable, { FormColumn } from "@/shared/components/form/FormListTable";

interface Props {
  form: FormInstance<PurchaseRequisition>;
}

export const PurchaseRequisitionLineFormList: React.FC<Props> = ({ form }) => {
  const [defaultProduct, setDefaultProduct] = useAutoResetItem<Product>();
  const { message } = useAppMessage();
  const isReceived = Form.useWatch("isReceived", form);
  const lines = Form.useWatch("lines", form) || [];

  const totalQuantity = lines.reduce((s, l) => s + (l.quantity || 0), 0) || 0;

  const columns: FormColumn<PurchaseRequisitionLine>[] = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "__idx",
        width: 40,
        align: "center",
        render: (ctx) => ctx.index + 1,
      },
      {
        title: "Mã hàng hóa",
        dataIndex: "productCode",
        width: 150,
        fixed: "left",
        render: (ctx) => (
          <span className="cursor-not-allowed">
            {(ctx.record?.product || ctx.record?.productSnapshot)?.code}
          </span>
        ),
      },
      {
        title: "Tên hàng hóa",
        dataIndex: "productName",
        width: 280,
        render: (ctx) => (
          <span className="cursor-not-allowed">
            {(ctx.record?.product || ctx.record?.productSnapshot)?.name}
          </span>
        ),
      },
      {
        title: "Loại",
        dataIndex: "productType",
        width: 120,
        align: "center",
        render: (ctx) => (
          <ProductTypeTag value={(ctx.record?.product || ctx.record?.productSnapshot)?.type} />
        ),
      },
      {
        title: "ĐVT",
        dataIndex: "unitId",
        width: 100,
        align: "center",
        render: (ctx) => {
          const p = ctx.record?.product;
          if (!p) return null;
          const units = collectUnits(p, ctx.record?.unit);

          return (
            <Select
              className={`text-center w-full`}
              options={units.map((u) => ({ value: u.id, label: u.name }))}
              suffixIcon={null}
              value={ctx.record?.unitId}
              onChange={(value: string) => {
                const unit = units.find((u: any) => u.id === value);
                ctx.form.setFieldValue(["lines", ctx.name, "unitId"], value);
                ctx.form.setFieldValue(["lines", ctx.name, "unit"], unit);
              }}
              variant="borderless"
            />
          );
        },
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        width: 180,
        align: "right",
        editable: true,
        fillable: true,
        rules: [{ required: true, message: "Nhập SL" }],
        render: () => <InputQuantity variant="borderless" />,
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        editable: true,
        render: () => <Input className={`${CLASSNAME.inputHeight} w-full`} variant="borderless" />,
      },
    ],
    [isReceived],
  );

  return (
    <FormListTable
      form={form}
      fieldName="lines"
      columns={columns}
      records={lines}
      title="Hàng hóa"
      fillableColumns={["quantity", "unitPrice", "taxRate", "manufacturedAt", "expiredAt"]}
      emptyText="Chưa có hàng hóa nào. Tìm kiếm, chọn hàng hóa và kho xuất ở trên."
      renderAdd={(add) => (
        <ProductMultipleSelect
          defaultData={defaultProduct ? [defaultProduct] : undefined}
          value={defaultProduct ? [defaultProduct.id] : undefined}
          onChangeData={(values) => {
            const data = values?.[0];
            setDefaultProduct(data);
            if (!data) return;
            add({
              productId: data.id,
              product: data,
              unitId: data.baseUnitId,
              unit: data.baseUnit,
            });
          }}
          hideOptions={collectProduct(lines)}
          prefix={<MagnifyingGlassIcon className="w-6 h-6 text-secondary" />}
          suffixIcon={false}
          placeholder="Tìm kiếm và chọn hàng hóa để thêm"
        />
      )}
      renderSummary={() => (
        <>
          <td className="border-r text-end font-semibold px-3" colSpan={5}>
            Tổng
          </td>
          <td className="border-r text-end px-3">{formatQuantity(totalQuantity)}</td>
          <td />
        </>
      )}
      onKeyDown={makeFormListEnterHandler(
        {
          type: "select",
          message: "Vui lòng chọn hàng hóa ở ô tìm kiếm để thêm vào phiếu nhập",
        },
        { messageApi: message },
      )}
    />
  );
};
