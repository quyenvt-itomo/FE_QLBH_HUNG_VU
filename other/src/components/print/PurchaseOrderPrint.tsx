import React from "react";
import { FE_BASE_URL } from "../../constants/ApiEndpoint";
import { DiscountTypeEnum, OrderLineTypeEnum } from "../../constants/enum";
import { IOrder } from "../../models/store/order";
import { getFullAddress, getFullVariantOptionContent } from "../../utils/common";
import { formatVietNamDate } from "../../utils/dateUtils";
import { formatMoney, numberToVietnameseWords } from "../../utils/formatNumber";

interface Props {
  data: IOrder;
}

const PurchaseOrderPrint: React.FC<Props> = ({ data }) => {
  const normalLines =
    data.lines?.filter((line) => line.lineType === OrderLineTypeEnum.NORMAL) || [];
  const fee = {
    totalMoney: 0,
    totalProductDiscount: 0,
    totalOrderDiscount: 0,
    totalTaxableAmount: 0,
    totalVat: 0,
    totalAmount: 0,
  };
  const tempItems: { baseAmount: number; vatRate: number }[] = [];

  normalLines.forEach((item) => {
    const qty = item.quantity || 0;
    const price = item.unitPrice || 0;
    const vatRate = item.taxRate || 0;
    const discountPerUnit =
      item.discountType === DiscountTypeEnum.PERCENT
        ? (price * (item.discountValue || 0)) / 100
        : item.discountValue || 0;
    const money = qty * price;
    const baseAmount = money - qty * discountPerUnit;
    fee.totalMoney += money;
    fee.totalProductDiscount += qty * discountPerUnit;
    tempItems.push({ baseAmount, vatRate });
  });

  const totalBaseAmount = tempItems.reduce((s, i) => s + i.baseAmount, 0);
  const orderDiscount = data.discountValue || 0;
  fee.totalOrderDiscount = Math.min(
    data.discountType === DiscountTypeEnum.PERCENT
      ? (totalBaseAmount * orderDiscount) / 100
      : orderDiscount,
    totalBaseAmount,
  );

  if (totalBaseAmount > 0) {
    let allocatedSum = 0;
    tempItems.forEach((item, index) => {
      const alloc =
        index === tempItems.length - 1
          ? fee.totalOrderDiscount - allocatedSum
          : Math.round((item.baseAmount / totalBaseAmount) * fee.totalOrderDiscount);
      if (index !== tempItems.length - 1) allocatedSum += alloc;
      const taxable = item.baseAmount - alloc;
      fee.totalTaxableAmount += taxable;
      fee.totalVat += (taxable * item.vatRate) / 100;
    });
  }
  fee.totalAmount =
    fee.totalTaxableAmount + fee.totalVat + (data.isFreeShipping ? 0 : data.shippingFee || 0);
  const tableTotal = normalLines.reduce((s, i) => s + (i.subTotal - (i.discountAmount || 0)), 0);

  const th = "border border-gray-900 bg-gray-100 text-center px-1.5 py-2 font-semibold text-xs";
  const td = "border border-gray-900 px-1.5 py-2 text-xs align-top";

  return (
    <div
      className="text-gray-900 text-xs leading-[1.45]"
      style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}
    >
      <style>{`@page { size: A4; margin: 14mm; }`}</style>
      <div className="w-full max-w-[190mm] mx-auto">
        <div className="flex justify-between items-start mb-3.5">
          <div className="max-w-[62%]">
            <img src={`${FE_BASE_URL}logo.svg`} alt="Logo" style={{ height: 44 }} />
            <div className="text-base font-bold">{data.store?.name || "QUAN LY KHO"}</div>
            <div>Địa chỉ: {getFullAddress(data.store?.address) || "-"}</div>
            <div>SĐT: {data.store?.phone || "-"}</div>
          </div>
          <div className="text-right">
            <div className="text-[22px] font-bold uppercase mb-1.5">PHIẾU NHẬP HÀNG</div>
            <div>
              <strong>Mã phiếu:</strong> {data.code || "-"}
            </div>
            <div>
              <strong>Ngày:</strong> {formatVietNamDate(data.orderAt)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-[18px] gap-y-1.5 my-3.5 p-2.5 border border-gray-300 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[100px]">Nhà cung cấp:</span>
            <span className="flex-1">{data.partner?.name || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[100px]">Số điện thoại:</span>
            <span className="flex-1">{data.partner?.phone || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[100px]">Nhân viên:</span>
            <span className="flex-1">{data.employee?.name || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[100px]">Ghi chú:</span>
            <span className="flex-1">{data.note || "-"}</span>
          </div>
        </div>

        <table className="w-full border-collapse mt-2.5">
          <thead>
            <tr>
              <th className={th} style={{ width: "5%" }}>
                STT
              </th>
              <th className={th} style={{ width: "13%" }}>
                Mã hàng
              </th>
              <th className={th} style={{ width: "34%" }}>
                Tên hàng
              </th>
              <th className={th} style={{ width: "8%" }}>
                ĐVT
              </th>
              <th className={th} style={{ width: "8%" }}>
                Số lượng
              </th>
              <th className={th} style={{ width: "11%" }}>
                Đơn giá
              </th>
              <th className={th} style={{ width: "9%" }}>
                Giảm giá/SP
              </th>
              <th className={th} style={{ width: "12%" }}>
                Thành tiền
              </th>
              <th className={th} style={{ width: "8%" }}>
                %VAT
              </th>
            </tr>
          </thead>
          <tbody>
            {normalLines.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className={`${td} text-center`}>{idx + 1}</td>
                <td className={td}>
                  {item.productVariantSnapshot?.barcode ||
                    item.productVariantSnapshot?.product?.code ||
                    ""}
                </td>
                <td className={td}>
                  {item.productVariantSnapshot?.product?.name || "--"}
                  {item.productVariantSnapshot?.options?.length ? (
                    <>
                      <br />
                      <span className="text-gray-500">
                        {getFullVariantOptionContent(item.productVariantSnapshot)}
                      </span>
                    </>
                  ) : null}
                </td>
                <td className={`${td} text-center`}>
                  {item.productVariantSnapshot?.product?.unit?.name || ""}
                </td>
                <td className={`${td} text-center`}>{item.quantity || 0}</td>
                <td className={`${td} text-right`}>{formatMoney(item.unitPrice || 0)}</td>
                <td className={`${td} text-right`}>{formatMoney(item.discountAmount || 0)}</td>
                <td className={`${td} text-right`}>
                  {formatMoney(item.subTotal - (item.discountAmount || 0))}
                </td>
                <td className={`${td} text-right`}>{item.taxRate || 0}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={7} className={`${td} text-right`}>
                <strong>TỔNG TIỀN HÀNG SAU GIẢM SP</strong>
              </td>
              <td className={`${td} text-right`}>
                <strong>{formatMoney(tableTotal)}</strong>
              </td>
              <td className={td}></td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end mt-3">
          <div className="w-[360px] border border-gray-300 rounded-lg p-2.5">
            {[
              { label: "Tổng tiền hàng:", value: fee.totalMoney },
              { label: "Giảm giá sản phẩm:", value: fee.totalProductDiscount },
              { label: "Giảm giá đơn hàng:", value: fee.totalOrderDiscount },
              { label: "Số tiền VAT:", value: fee.totalVat },
              { label: "Phí giao hàng:", value: data.isFreeShipping ? 0 : data.shippingFee || 0 },
              { label: "Tổng phải thanh toán:", value: fee.totalAmount, bold: true },
            ].map((line, idx) => (
              <div
                key={idx}
                className={`flex justify-between py-1 border-b border-dashed border-gray-200 last:border-b-0 ${line.bold ? "text-red-600" : ""}`}
              >
                <span className="font-semibold">{line.label}</span>
                <span className="font-semibold">{formatMoney(line.value)}</span>
              </div>
            ))}
            <div className="mt-2 italic">
              Bằng chữ:{" "}
              <strong className="capitalize">
                {numberToVietnameseWords(fee.totalAmount)} đồng
              </strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 mt-[26px] text-center">
          {["Bên giao", "Bên nhận", "Người lập phiếu"].map((title) => (
            <div key={title}>
              <div className="font-bold">{title}</div>
              <div className="italic text-gray-500 mt-1">(Ký, ghi rõ họ tên)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPrint;
