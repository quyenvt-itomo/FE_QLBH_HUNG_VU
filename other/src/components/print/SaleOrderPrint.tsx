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
  qrImage?: string;
}

const SaleOrderPrint: React.FC<Props> = ({ data, qrImage }) => {
  const normalLines =
    data.lines?.filter((line) => line.lineType === OrderLineTypeEnum.NORMAL) || [];
  const summaryLines = [
    { label: "Tổng tiền hàng:", value: (data.grossAmount || 0) - (data.lineDiscountAmount || 0) },
    { label: "Giảm giá đơn hàng:", value: data.orderDiscountAmount || 0 },
    { label: "VAT:", value: data.taxAmount || 0 },
    { label: "Phí giao hàng:", value: data.isFreeShipping ? 0 : data.shippingFee || 0 },
    { label: "Sử dụng điểm:", value: data.loyaltyPointsDiscountAmount || 0 },
    {
      label: "Tổng thanh toán:",
      value: (data.totalAmount || 0) - (data.loyaltyPointsDiscountAmount || 0),
    },
  ].filter((l) => l.value > 0);

  return (
    <div style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
      <style>{`@page { size: 57mm auto; margin: 2mm; }`}</style>
      <div className="text-[9px] leading-[1.4] w-[57mm] max-w-[57mm] overflow-x-hidden p-[2mm] [&_*]:text-[9px] [&_*]:leading-[1.4]">
        <header>
          <div className="flex flex-col items-center">
            <img src={`${FE_BASE_URL}logo.svg`} alt="Logo" style={{ height: 40 }} />
            <span className="font-semibold">{data.store?.name || ""}</span>
            <span className="text-center">
              Địa chỉ: {getFullAddress(data.store?.address) || "--"}
            </span>
            <span>SĐT: {data.store?.phone || "--"}</span>
            <span className="font-semibold">HÓA ĐƠN BÁN HÀNG</span>
            <span className="mt-2">Số HĐ: {data.code}</span>
            <span>{formatVietNamDate(data.orderAt)}</span>
          </div>
          <div className="flex flex-col">
            <span>Khách hàng: {data.partner?.name || "--"}</span>
            <span>SĐT: {data.partner?.phone || "--"}</span>
            <span>Địa chỉ: {getFullAddress(data.partner?.addresses?.[0]) || "--"}</span>
          </div>
        </header>

        <main className="mt-2">
          <table className="w-full border-collapse table-fixed mt-2">
            <colgroup>
              <col />
              <col style={{ width: 40 }} />
              <col style={{ width: 60 }} />
            </colgroup>
            <thead>
              <tr>
                <th className="text-left font-semibold border-t border-b border-[#323832] px-1 py-0.5">
                  Đơn giá
                </th>
                <th className="text-right font-semibold border-t border-b border-[#323832] px-1 py-0.5">
                  SL
                </th>
                <th className="text-right font-semibold border-t border-b border-[#323832] px-1 py-0.5">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {normalLines.map((item) => (
                <tr key={item.id}>
                  <td className="text-left border-b border-dashed border-[#323832] px-1 py-0.5">
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
                  <td className="text-right border-b border-dashed border-[#323832] px-1 py-0.5">
                    {formatQuantity(item.quantity)}
                  </td>
                  <td className="text-right border-b border-dashed border-[#323832] px-1 py-0.5">
                    {formatMoney(item.subTotal - (item.discountAmount || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>

        <div className="mt-4">
          <table className="w-full border-collapse table-fixed">
            <tbody>
              <colgroup>
                <col />
                <col style={{ width: 60 }} />
              </colgroup>
              {summaryLines.map((line, idx) => (
                <tr key={idx}>
                  <td className="text-right">{line.label}</td>
                  <td className="text-right">{formatMoney(line.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="mt-4 flex flex-col items-center">
          <span className="!text-[8px]">
            (
            {numberToVietnameseWords(
              (data.totalAmount || 0) - (data.loyaltyPointsDiscountAmount || 0),
            )}
            )
          </span>
          {qrImage && (
            <div className="mt-3 flex flex-col items-center">
              <span className="text-center !text-[8px]">Quét mã QR để chuyển khoản</span>
              <img src={qrImage} alt="VietQR Payment" className="w-24 h-24 mt-1" />
            </div>
          )}
          <span className="!text-[8px]">Xin cảm ơn quý khách và hẹn gặp lại!</span>
        </footer>
      </div>
    </div>
  );
};

export default SaleOrderPrint;
