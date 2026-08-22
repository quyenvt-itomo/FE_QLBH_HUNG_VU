import React from "react";
import { FE_BASE_URL } from "../../constants/ApiEndpoint";
import { OrderLineTypeEnum } from "../../constants/enum";
import { IOrder } from "../../models/store/order";
import { getFullAddress, getFullVariantOptionContent } from "../../utils/common";
import { formatVietNamDate } from "../../utils/dateUtils";
import { formatMoney, formatQuantity, numberToVietnameseWords } from "../../utils/formatNumber";
import { PriceContent } from "./PriceContent";

interface Props {
  data: IOrder;
}

const PurchaseReturnOrderPrint: React.FC<Props> = ({ data }) => {
  const normalLines =
    data.lines?.filter((line) => line.lineType === OrderLineTypeEnum.NORMAL) || [];
  const summaryLines = [
    { label: "Tổng tiền trả:", value: data.grossAmount || 0 },
    { label: "Giảm giá:", value: (data.lineDiscountAmount || 0) + (data.orderDiscountAmount || 0) },
    { label: "VAT:", value: data.taxAmount || 0 },
    { label: "Tổng tiền nhận lại:", value: data.totalAmount || 0 },
  ].filter((l) => l.value > 0);

  return (
    <div style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
      <style>{`@page { size: 57mm auto; margin: 2mm; }`}</style>
      <div className="text-[9px] leading-[1.4] w-[57mm] max-w-[57mm] overflow-x-hidden p-[2mm] [&_*]:text-[9px] [&_*]:leading-[1.4]">
        {/* Header */}
        <div className="text-center mb-[3mm]">
          <div className="flex flex-col items-center">
            <img src={`${FE_BASE_URL}logo.svg`} alt="Logo" style={{ height: 40 }} />
            <span className="font-semibold">{data.store?.name || "QUAN LY KHO"}</span>
            <span className="text-center">
              Địa chỉ: {getFullAddress(data.store?.address) || "KCN Tây Bắc Ga, TP Thanh Hóa"}
            </span>
            <span>SĐT: {data.store?.phone || "098.888.8888"}</span>
            <span className="font-semibold uppercase mt-2">PHIẾU CHI TRẢ HÀNG NHẬP</span>
            <span className="mt-1">Mã phiếu: {data.code}</span>
            <span>{formatVietNamDate(data.orderAt)}</span>
          </div>
        </div>

        <div className="mt-2 border-t border-dashed border-black pt-1">
          <div className="flex justify-between mb-[0.5mm]">
            <span className="font-semibold whitespace-nowrap mr-[1mm]">Nhà CC:</span>
            <span className="text-right font-semibold break-all">
              {data.partner?.name || "N/A"}
            </span>
          </div>
          <div className="flex justify-between mb-[0.5mm]">
            <span className="font-semibold whitespace-nowrap mr-[1mm]">Liên hệ:</span>
            <span className="text-right break-all">{data.partner?.phone || "N/A"}</span>
          </div>
          <div className="flex justify-between mb-[0.5mm]">
            <span className="font-semibold whitespace-nowrap mr-[1mm]">Ghi chú:</span>
            <span className="text-right break-all">{data.note || ""}</span>
          </div>
        </div>

        <table className="w-full border-collapse my-[2mm]">
          <thead>
            <tr>
              <th
                className="border-b border-dashed border-black py-[1mm] text-left font-bold"
                style={{ width: "45%" }}
              >
                Đơn giá
              </th>
              <th
                className="border-b border-dashed border-black py-[1mm] text-center font-bold"
                style={{ width: "20%" }}
              >
                SL
              </th>
              <th
                className="border-b border-dashed border-black py-[1mm] text-right font-bold"
                style={{ width: "35%" }}
              >
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {normalLines.map((item) => (
              <tr key={item.id}>
                <td className="py-[1.5mm] text-left align-top">
                  <div className="flex flex-col">
                    <span>
                      {item.productVariantSnapshot?.product?.name || "--"} (
                      {item.productVariantSnapshot?.product?.unit?.name || "--"}){" "}
                      {item.productVariantSnapshot?.options?.length
                        ? getFullVariantOptionContent(item.productVariantSnapshot)
                        : ""}
                    </span>
                  </div>
                  <PriceContent item={item} />
                </td>
                <td className="py-[1.5mm] text-center align-top">
                  {formatQuantity(item.quantity * -1)}
                </td>
                <td className="py-[1.5mm] text-right align-top">
                  {formatMoney(item.subTotal - (item.discountAmount || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-dashed border-black pt-[2mm]">
          {summaryLines.map((line, idx) => (
            <div key={idx} className="flex justify-between mb-[1mm]">
              <span
                className={line.label.includes("Tổng tiền nhận lại") ? "font-bold" : "font-bold"}
              >
                {line.label}
              </span>
              <span
                className={
                  line.label.includes("Tổng tiền nhận lại")
                    ? "font-bold text-[10px]"
                    : "font-bold text-[10px]"
                }
              >
                {formatMoney(line.value)}
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-dashed border-gray-300">
            <div className="italic text-[8px]">
              Bằng chữ:{" "}
              <span className="font-semibold capitalize">
                {numberToVietnameseWords(data.totalAmount || 0)} đồng
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseReturnOrderPrint;
