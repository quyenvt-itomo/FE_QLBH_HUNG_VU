import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React from "react";

import { Product } from "@/modules/product/product.model";
import { ProductDetailButton } from "@/modules/product/components/ProductDetailButton";
import { collectUnits } from "@/modules/product/product.util";
import { AppSelect, InputMoney, ProductImage, QuantityStepper } from "@/shared/components";
import { formatMoney } from "@/shared/utils/number.util";

export type PosLine = Record<string, any> & {
  id: string;
  productId: string;
  productSnapshot: { id: string; code: string; name: string };
  unitId?: string | null;
  unitSnapshot?: { id: string; name: string } | null;
  quantity: number;
  unitPrice: number;
  subTotal: number;
};

interface Props {
  lines: PosLine[];
  onQuantityChange: (id: string, quantity: number | null) => void;
  onUnitChange: (id: string, unitId: string) => void;
  onUnitPriceChange: (id: string, unitPrice: number | null) => void;
  onNoteChange: (id: string, note: string) => void;
  onRemove: (id: string) => void;
}

export const OrderLineTable: React.FC<Props> = ({
  lines,
  onQuantityChange,
  onUnitChange,
  onUnitPriceChange,
  onNoteChange,
  onRemove,
}) => (
  <div className="min-h-0 flex-1 overflow-auto">
    <table className="w-full min-w-[930px] table-auto border-collapse text-sm">
      <colgroup>
        <col style={{ width: 58 }} />
        <col style={{ width: 20 }} />
        <col style={{ width: 120 }} />
        <col style={{ width: 40 }} />
        <col style={{ minWidth: 260 }} />
        <col style={{ width: 110 }} />
        <col style={{ width: 180 }} />
        <col style={{ width: 130 }} />
        <col style={{ width: 150 }} />
      </colgroup>
      <thead className="sticky top-0 z-10 border-b bg-white">
        <tr>
          <th className="px-3 py-2 text-center font-semibold text-slate-600">STT</th>
          <th />
          <th className="px-3 py-2 text-left font-semibold uppercase text-slate-600">Mã hàng</th>
          <th />
          <th className="px-3 py-2 text-left font-semibold uppercase text-slate-600">Tên hàng</th>
          <th className="px-3 py-2 text-left font-semibold uppercase text-slate-600">ĐVT</th>
          <th className="px-3 py-2 pr-10 text-right font-semibold uppercase text-slate-600">
            Số lượng
          </th>
          <th className="px-3 py-2 text-right font-semibold uppercase text-slate-600">Đơn giá</th>
          <th className="px-3 py-2 text-right font-semibold uppercase text-slate-600">
            Thành tiền
          </th>
        </tr>
      </thead>
      <tbody>
        {lines.map((line, index) => {
          const product = line.product as Product | undefined;
          const units = product ? collectUnits(product, line.unit || line.unitSnapshot) : [];

          return (
            <tr
              key={line.id}
              className="border-b border-gray-200 align-top bg-white transition-all ease-in-out"
            >
              <td className="px-3 py-2 text-center text-gray-500">{index + 1}</td>
              <td className="px-0.5 py-1">
                <Button
                  type="text"
                  danger
                  title="Xóa hàng hóa"
                  icon={<DeleteOutlined />}
                  onClick={() => onRemove(line.id)}
                />
              </td>
              <td className="px-3 py-2 font-mono text-blue-600">
                {product?.code || line.productSnapshot.code}
              </td>
              <td className="px-0.5 py-1 text-center">
                <ProductImage shape="square" size={48} />
              </td>
              <td className="min-w-0 px-3 py-2">
                <div className="flex items-center gap-1 font-medium text-gray-900">
                  <span>{product?.name || line.productSnapshot.name}</span>
                  <ProductDetailButton productId={line.productId} />
                </div>
                <Input
                  variant="borderless"
                  value={String(line.note || "")}
                  onChange={(event) => onNoteChange(line.id, event.target.value)}
                  placeholder="Ghi chú..."
                  className="!h-5 !w-full !p-0 !text-xs !italic"
                />
              </td>
              <td className="min-w-0 px-0.5 py-1">
                {units.length ? (
                  <AppSelect
                    value={line.unitId || undefined}
                    options={units.map((unit) => ({ value: unit.id, label: unit.name }))}
                    onChange={(unitId) => onUnitChange(line.id, unitId)}
                    className="w-full"
                  />
                ) : (
                  <span className="px-2 text-gray-500">{line.unitSnapshot?.name || "-"}</span>
                )}
              </td>
              <td className="px-0.5 py-1">
                <QuantityStepper
                  min={1}
                  allowInput
                  value={line.quantity}
                  onChange={(value) => onQuantityChange(line.id, value)}
                  className="w-full"
                />
              </td>
              <td className="px-0.5 py-1">
                <InputMoney
                  min={0}
                  value={Number(line.unitPrice || 0)}
                  onChange={(value) => onUnitPriceChange(line.id, value)}
                  className="w-full"
                />
              </td>
              <td className="px-3 py-2 text-right font-semibold">
                {formatMoney(Number(line.quantity || 0) * Number(line.unitPrice || 0))}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
