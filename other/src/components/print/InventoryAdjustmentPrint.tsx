import React from "react";
import { FE_BASE_URL } from "../../constants/ApiEndpoint";
import { InventoryTransactionType } from "../../constants/enum";
import { IInventoryAdjustment } from "../../models/store/inventoryAdjustment";
import { getFullAddress, getFullVariantOptionContent } from "../../utils/common";
import { formatDateTimeDDMMYYYY } from "../../utils/dateUtils";
import { formatMoney, formatQuantity, numberToVietnameseWords } from "../../utils/formatNumber";

interface Props {
  data: IInventoryAdjustment;
}

const InventoryAdjustmentPrint: React.FC<Props> = ({ data }) => {
  const lines = data.lines || [];
  const summaryRows = lines.reduce(
    (s, line) => {
      s.expectedQty += line.expectedQty || 0;
      s.countedQty += line.countedQty || 0;
      s.deltaQty +=
        (line.direction === InventoryTransactionType.IN ? 1 : -1) * Math.abs(line.deltaQty || 0);
      s.adjustmentValue +=
        (line.direction === InventoryTransactionType.IN ? 1 : -1) *
        Math.abs(line.adjustmentValue || 0);
      return s;
    },
    { expectedQty: 0, countedQty: 0, deltaQty: 0, adjustmentValue: 0 },
  );
  const totalAbsAdjustmentValue = lines.reduce(
    (sum, line) => sum + Math.abs(line.adjustmentValue || 0),
    0,
  );

  const deltaColor = (val: number) => (val > 0 ? "text-green-600" : val < 0 ? "text-red-600" : "");
  const th = "border border-gray-900 bg-gray-100 text-center px-1 py-1.5 font-semibold text-[11px]";
  const td = "border border-gray-900 px-1 py-1.5 text-[11px] align-top";

  return (
    <div
      className="text-gray-900 text-[11px] leading-[1.45]"
      style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}
    >
      <style>{`@page { size: A4 landscape; margin: 12mm; }`}</style>
      <div className="w-full max-w-[273mm] mx-auto">
        <div className="flex justify-between items-start mb-3">
          <div className="max-w-[58%]">
            <img src={`${FE_BASE_URL}logo.svg`} alt="Logo" style={{ height: 40 }} />
            <div className="text-[15px] font-bold">{data.store?.name || "QUAN LY KHO"}</div>
            <div>Địa chỉ: {getFullAddress(data.store?.address) || "-"}</div>
            <div>SĐT: {data.store?.phone || "-"}</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold uppercase mb-1.5">PHIẾU KIỂM KHO</div>
            <div>
              <strong>Mã phiếu:</strong> {data.code || "-"}
            </div>
            <div>
              <strong>Ngày:</strong> {formatDateTimeDDMMYYYY(data.occurredAt)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-[18px] gap-y-1 my-2.5 p-2 border border-gray-300 rounded-lg">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold min-w-[100px]">Người thực hiện:</span>
            <span className="flex-1">{data.adjustedBy?.name || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold min-w-[100px]">Lý do:</span>
            <span className="flex-1">{data.reason || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold min-w-[100px]">Ghi chú:</span>
            <span className="flex-1">{data.note || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold min-w-[100px]">Ngày tạo:</span>
            <span className="flex-1">{formatDateTimeDDMMYYYY(data.createdAt)}</span>
          </div>
        </div>

        <table className="w-full border-collapse mt-2">
          <thead>
            <tr>
              <th className={th} style={{ width: "4%" }}>
                STT
              </th>
              <th className={th} style={{ width: "10%" }}>
                Mã hàng
              </th>
              <th className={th} style={{ width: "24%" }}>
                Tên hàng
              </th>
              <th className={th} style={{ width: "6%" }}>
                ĐVT
              </th>
              <th className={th} style={{ width: "10%" }}>
                Tồn hệ thống
              </th>
              <th className={th} style={{ width: "10%" }}>
                Tồn thực tế
              </th>
              <th className={th} style={{ width: "10%" }}>
                Chênh lệch
              </th>
              <th className={th} style={{ width: "12%" }}>
                Giá trị chênh lệch
              </th>
              <th className={th} style={{ width: "14%" }}>
                Ghi chú
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, idx) => {
              const isIn = line.direction === InventoryTransactionType.IN;
              const sign = isIn ? "+" : "-";
              const variant = line.productVariantSnapshot || line.productVariant;
              const optionsContent = line.productVariantSnapshot?.options?.length
                ? getFullVariantOptionContent(line.productVariantSnapshot)
                : line.productVariant?.options?.length
                  ? getFullVariantOptionContent(line.productVariant)
                  : "";
              return (
                <tr key={line.id || idx}>
                  <td className={`${td} text-center`}>{idx + 1}</td>
                  <td className={td}>{variant?.barcode || variant?.product?.code || ""}</td>
                  <td className={td}>
                    {variant?.product?.name || "--"}
                    {optionsContent && (
                      <>
                        <br />
                        <span className="text-gray-500">{optionsContent}</span>
                      </>
                    )}
                  </td>
                  <td className={`${td} text-center`}>{variant?.product?.unit?.name || ""}</td>
                  <td className={`${td} text-right`}>{formatQuantity(line.expectedQty)}</td>
                  <td className={`${td} text-right`}>{formatQuantity(line.countedQty)}</td>
                  <td className={`${td} text-right ${deltaColor(line.deltaQty || 0)}`}>
                    {sign}
                    {formatQuantity(Math.abs(line.deltaQty || 0))}
                  </td>
                  <td className={`${td} text-right ${deltaColor(line.adjustmentValue || 0)}`}>
                    {sign}
                    {formatMoney(Math.abs(line.adjustmentValue || 0))}
                  </td>
                  <td className={td}>{line.note || ""}</td>
                </tr>
              );
            })}
            <tr className="font-bold bg-gray-50">
              <td colSpan={4} className={`${td} text-center`}>
                <strong>TỔNG CỘNG</strong>
              </td>
              <td className={`${td} text-right`}>
                <strong>{formatQuantity(summaryRows.expectedQty)}</strong>
              </td>
              <td className={`${td} text-right`}>
                <strong>{formatQuantity(summaryRows.countedQty)}</strong>
              </td>
              <td className={`${td} text-right ${deltaColor(summaryRows.deltaQty)}`}>
                <strong>
                  {summaryRows.deltaQty >= 0 ? "+" : "-"}
                  {formatQuantity(Math.abs(summaryRows.deltaQty))}
                </strong>
              </td>
              <td className={`${td} text-right ${deltaColor(summaryRows.adjustmentValue)}`}>
                <strong>
                  {summaryRows.adjustmentValue >= 0 ? "+" : "-"}
                  {formatMoney(Math.abs(summaryRows.adjustmentValue))}
                </strong>
              </td>
              <td className={td}></td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end mt-2.5">
          <div className="w-[380px] border border-gray-300 rounded-lg p-2">
            <div className="flex justify-between py-[3px] border-b border-dashed border-gray-200 last:border-b-0 font-semibold">
              <span>Tổng SL tồn hệ thống:</span>
              <span>{formatQuantity(summaryRows.expectedQty)}</span>
            </div>
            <div className="flex justify-between py-[3px] border-b border-dashed border-gray-200 last:border-b-0 font-semibold">
              <span>Tổng SL tồn thực tế:</span>
              <span>{formatQuantity(summaryRows.countedQty)}</span>
            </div>
            <div
              className={`flex justify-between py-[3px] border-b border-dashed border-gray-200 last:border-b-0 font-semibold ${deltaColor(summaryRows.deltaQty)}`}
            >
              <span>Tổng SL chênh lệch:</span>
              <span>
                {summaryRows.deltaQty >= 0 ? "+" : "-"}
                {formatQuantity(Math.abs(summaryRows.deltaQty))}
              </span>
            </div>
            <div
              className={`flex justify-between py-[3px] border-b border-dashed border-gray-200 last:border-b-0 font-semibold text-red-600 ${deltaColor(summaryRows.adjustmentValue)}`}
            >
              <span>Tổng giá trị chênh lệch:</span>
              <span>
                {summaryRows.adjustmentValue >= 0 ? "+" : "-"}
                {formatMoney(Math.abs(summaryRows.adjustmentValue))}
              </span>
            </div>
            <div className="mt-1.5 italic">
              Tổng giá trị chênh lệch tuyệt đối:{" "}
              <strong className="capitalize">
                {numberToVietnameseWords(totalAbsAdjustmentValue)} đồng
              </strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-[22px] text-center">
          {["Người kiểm kho", "Kế toán", "Thủ kho"].map((t) => (
            <div key={t}>
              <div className="font-bold">{t}</div>
              <div className="italic text-gray-500 mt-[3px]">(Ký, ghi rõ họ tên)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryAdjustmentPrint;
