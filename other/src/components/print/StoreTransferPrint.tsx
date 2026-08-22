import React from "react";
import { IStoreTransfer } from "../../models/storeTransfer";
import { getFullVariantOptionContent } from "../../utils/common";
import { formatDateTimeDDMMYYYY } from "../../utils/dateUtils";
import { formatQuantity } from "../../utils/formatNumber";

interface Props {
  data: IStoreTransfer;
}

const StoreTransferPrint: React.FC<Props> = ({ data }) => {
  const totalQuantity = data.lines?.reduce((sum, line) => sum + (line.quantity || 0), 0) || 0;

  const th = "border border-black bg-gray-100 text-center p-2 font-bold text-xs";
  const td = "border border-black p-2 text-xs leading-[1.4]";

  return (
    <div
      className="text-black text-xs bg-white"
      style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}
    >
      <style>{`@page { size: A4; margin: 15mm; }`}</style>
      <div className="max-w-[190mm] mx-auto">
        <div className="text-2xl font-bold text-center uppercase mb-5">PHIẾU CHUYỂN KHO</div>

        <table className="w-full mb-6 [&_td]:border-none [&_td]:py-1">
          <tbody>
            <tr>
              <td className="font-bold" style={{ width: "15%" }}>
                Số phiếu:
              </td>
              <td style={{ width: "35%" }}>{data.code}</td>
              <td className="font-bold" style={{ width: "15%" }}>
                Ngày:
              </td>
              <td style={{ width: "35%" }}>{formatDateTimeDDMMYYYY(data.occurredAt)}</td>
            </tr>
            <tr>
              <td className="font-bold">Kho xuất:</td>
              <td>{data.fromStore?.name || "N/A"}</td>
              <td className="font-bold">Kho nhập:</td>
              <td>{data.toStore?.name || "N/A"}</td>
            </tr>
            <tr>
              <td className="font-bold">Lý do:</td>
              <td colSpan={3}>{data.reason || ""}</td>
            </tr>
            <tr>
              <td className="font-bold">Ghi chú:</td>
              <td colSpan={3}>{data.note || ""}</td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border-collapse mt-[15px]">
          <thead>
            <tr>
              <th className={th} style={{ width: "5%" }}>
                STT
              </th>
              <th className={th} style={{ width: "15%" }}>
                Mã hàng
              </th>
              <th className={th} style={{ width: "30%" }}>
                Tên hàng
              </th>
              <th className={th} style={{ width: "10%" }}>
                ĐVT
              </th>
              <th className={th} style={{ width: "12%" }}>
                Số lượng
              </th>
              <th className={th} style={{ width: "15%" }}>
                Ghi chú
              </th>
            </tr>
          </thead>
          <tbody>
            {(data.lines || []).map((line, index) => {
              const variant = line.productVariantSnapshot || line.productVariant;
              const optionsContent = line.productVariantSnapshot?.options?.length
                ? getFullVariantOptionContent(line.productVariantSnapshot)
                : line.productVariant?.options?.length
                  ? getFullVariantOptionContent(line.productVariant)
                  : "";
              return (
                <tr key={line.id || index}>
                  <td className={`${td} text-center`}>{index + 1}</td>
                  <td className={td}>{variant?.barcode || variant?.product?.code || ""}</td>
                  <td className={td}>
                    {variant?.product?.name || ""}
                    {optionsContent && (
                      <>
                        <br />
                        <span className="text-gray-500 text-[11px]">{optionsContent}</span>
                      </>
                    )}
                  </td>
                  <td className={`${td} text-center`}>{variant?.product?.unit?.name || ""}</td>
                  <td className={`${td} text-right`}>{formatQuantity(line.quantity)}</td>
                  <td className={td}>{line.note || ""}</td>
                </tr>
              );
            })}
            <tr className="font-bold bg-gray-50">
              <td colSpan={4} className={`${td} text-center`}>
                TỔNG CỘNG
              </td>
              <td className={`${td} text-right`}>{formatQuantity(totalQuantity)}</td>
              <td className={td}></td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-3 gap-4 mt-12 text-center">
          {["Kho xuất", "Kho nhận", "Người lập phiếu"].map((t) => (
            <div key={t}>
              <div className="font-bold">{t}</div>
              <div className="italic text-xs">(Ký, ghi rõ họ tên)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreTransferPrint;
