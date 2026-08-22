import { FE_BASE_URL } from "../../constants/ApiEndpoint";
import { DiscountTypeEnum, OrderLineTypeEnum } from "../../constants/enum";
import { IOrder } from "../../models/store/order";
import { getFullAddress, getFullVariantOptionContent } from "../common";
import { formatVietNamDate } from "../dateUtils";
import { formatMoney, numberToVietnameseWords } from "../formatNumber";

export function getPurchaseOrderHtmlContent(data: IOrder) {
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
    const quantity = item.quantity || 0;
    const price = item.unitPrice || 0;
    const vatRate = item.taxRate || 0;
    const discountPerUnit =
      item.discountType === DiscountTypeEnum.PERCENT
        ? (price * (item.discountValue || 0)) / 100
        : item.discountValue || 0;

    const money = quantity * price;
    const productDiscount = quantity * discountPerUnit;
    const baseAmount = money - productDiscount;

    fee.totalMoney += money;
    fee.totalProductDiscount += productDiscount;

    tempItems.push({
      baseAmount,
      vatRate,
    });
  });

  const totalBaseAmount = tempItems.reduce((sum, item) => sum + item.baseAmount, 0);
  const orderDiscount = data.discountValue || 0;
  const isPercent = data.discountType === DiscountTypeEnum.PERCENT;
  const orderDiscountAmount = isPercent ? (totalBaseAmount * orderDiscount) / 100 : orderDiscount;
  fee.totalOrderDiscount = Math.min(orderDiscountAmount, totalBaseAmount);

  if (totalBaseAmount > 0) {
    let allocatedSum = 0;

    tempItems.forEach((item, index) => {
      let allocatedDiscount = 0;

      if (index === tempItems.length - 1) {
        allocatedDiscount = fee.totalOrderDiscount - allocatedSum;
      } else {
        allocatedDiscount = Math.round(
          (item.baseAmount / totalBaseAmount) * fee.totalOrderDiscount,
        );
        allocatedSum += allocatedDiscount;
      }

      const taxableAmount = item.baseAmount - allocatedDiscount;
      const vatAmount = (taxableAmount * item.vatRate) / 100;

      fee.totalTaxableAmount += taxableAmount;
      fee.totalVat += vatAmount;
    });
  }

  fee.totalAmount =
    fee.totalTaxableAmount + fee.totalVat + (data.isFreeShipping ? 0 : data.shippingFee || 0);

  const tableTotal = normalLines.reduce(
    (sum, item) => sum + (item.subTotal - (item.discountAmount || 0)),
    0,
  );

  const summaryLines = [
    {
      label: "Tổng tiền hàng:",
      value: fee.totalMoney,
    },
    {
      label: "Giảm giá sản phẩm:",
      value: fee.totalProductDiscount,
    },
    {
      label: "Giảm giá đơn hàng:",
      value: fee.totalOrderDiscount,
    },
    {
      label: "Số tiền VAT:",
      value: fee.totalVat,
    },
    {
      label: "Phí giao hàng:",
      value: data.isFreeShipping ? 0 : data.shippingFee || 0,
    },
    {
      label: "Tổng phải thanh toán:",
      value: fee.totalAmount,
      bold: true,
    },
  ];

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script>
      window.onload = function () {
        setTimeout(function () {
          window.focus();
          window.print();
        }, 100);

        window.onafterprint = function () {
          window.close();
        };

        setTimeout(function () {
          window.close();
        }, 1200);
      };
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hóa đơn nhập hàng</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

    <style>
      @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;200;300;400;500;600;700;800;900&display=swap");
      /* ===== PAGE SETUP FOR A4 ===== */
      @page {
        size: A4;
        margin: 14mm;
      }

      html,
      body {
        width: 100%;
        margin: 0;
        padding: 0;
        font-family: "Be Vietnam Pro", sans-serif;
        color: #111827;
      }

      * {
        box-sizing: border-box;
        font-size: 12px;
        line-height: 1.45;
      }

      .page {
        width: 100%;
        max-width: 190mm;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 14px;
      }

      .title-wrap {
        text-align: right;
      }

      .title-wrap .title {
        font-size: 22px;
        font-weight: 700;
        text-transform: uppercase;
        margin: 0 0 6px;
      }

      .company {
        max-width: 62%;
      }

      .company-name {
        font-size: 16px;
        font-weight: 700;
      }

      .meta-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px 18px;
        margin: 14px 0;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
      }

      .meta-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .label {
        font-weight: 600;
        min-width: 100px;
      }

      .value {
        flex: 1;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      th {
        border: 1px solid #111827;
        background: #f3f4f6;
        text-align: center;
        padding: 8px 6px;
        font-weight: 600;
      }

      td {
        border: 1px solid #111827;
        padding: 8px 6px;
        vertical-align: top;
      }

      .text-right {
        text-align: right;
      }

      .text-center {
        text-align: center;
      }

      .summary {
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;
      }

      .summary-box {
        width: 360px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 10px 12px;
      }

      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        border-bottom: 1px dashed #e5e7eb;
      }

      .total-row:last-child {
        border-bottom: none;
      }

      .total-label {
        font-weight: 600;
      }

      .total-val {
        font-weight: 600;
      }

      .grand-total {
        color: #dc2626;
      }

      .in-words {
        margin-top: 8px;
        font-style: italic;
      }

      .signatures {
        margin-top: 26px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        text-align: center;
      }

      .sign-title {
        font-weight: 700;
      }

      .sign-note {
        font-style: italic;
        color: #4b5563;
        margin-top: 4px;
      }
    </style>
  </head>

  <body>
    <div class="page">
      <div class="header">
        <div class="company">
          <img src="${FE_BASE_URL}logo.svg" alt="Logo" style="height: 44px" />
          <div class="company-name">${data.store?.name || "DUC TAI FOOD"}</div>
          <div>Địa chỉ: ${getFullAddress(data.store?.address) || "-"}</div>
          <div>SĐT: ${data.store?.phone || "-"}</div>
        </div>
        <div class="title-wrap">
          <div class="title">PHIẾU NHẬP HÀNG</div>
          <div><strong>Mã phiếu:</strong> ${data.code || "-"}</div>
          <div><strong>Ngày:</strong> ${formatVietNamDate(data.orderAt)}</div>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-row">
          <div class="label">Nhà cung cấp:</div>
          <div class="value">${data.partner?.name || "-"}</div>
        </div>
        <div class="meta-row">
          <div class="label">Số điện thoại:</div>
          <div class="value">${data.partner?.phone || "-"}</div>
        </div>
        <div class="meta-row">
          <div class="label">Nhân viên:</div>
          <div class="value">${data.employee?.name || "-"}</div>
        </div>
        <div class="meta-row">
          <div class="label">Ghi chú:</div>
          <div class="value">${data.note || "-"}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th width="5%">STT</th>
            <th width="13%">Mã hàng</th>
            <th width="34%">Tên hàng</th>
            <th width="8%">ĐVT</th>
            <th width="8%">Số lượng</th>
            <th width="11%">Đơn giá</th>
            <th width="9%">Giảm giá/SP</th>
            <th width="12%">Thành tiền</th>
            <th width="8%">%VAT</th>
          </tr>
        </thead>
        <tbody>
          ${normalLines
            .map(
              (item, idx) => `
          <tr>
            <td class="text-center">${idx + 1}</td>
            <td>${item.productVariantSnapshot?.barcode || item.productVariantSnapshot?.product?.code || ""}</td>
            <td>
              ${item.productVariantSnapshot?.product?.name || "--"}
              ${
                item.productVariantSnapshot?.options?.length
                  ? `<br/><span style="color:#6b7280">${getFullVariantOptionContent(item.productVariantSnapshot)}</span>`
                  : ""
              }
            </td>
            <td class="text-center">${item.productVariantSnapshot?.product?.unit?.name || ""}</td>
            <td class="text-center">${item.quantity || 0}</td>
            <td class="text-right">${formatMoney(item.unitPrice || 0)}</td>
            <td class="text-right">${formatMoney(item.discountAmount || 0)}</td>
            <td class="text-right">${formatMoney(item.subTotal - (item.discountAmount || 0))}</td>
            <td class="text-right">${item.taxRate || 0}</td>
          </tr>
          `,
            )
            .join("")}
          <tr>
            <td colspan="7" class="text-right"><strong>TỔNG TIỀN HÀNG SAU GIẢM SP</strong></td>
            <td class="text-right"><strong>${formatMoney(tableTotal)}</strong></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-box">
          ${summaryLines
            .map(
              (line) => `
            <div class="total-row ${line.bold ? "grand-total" : ""}">
              <span class="total-label">${line.label}</span>
              <span class="total-val">${formatMoney(line.value)}</span>
            </div>
          `,
            )
            .join("")}

          <div class="in-words">
            Bằng chữ: <strong class="capitalize">${numberToVietnameseWords(fee.totalAmount)} đồng</strong>
          </div>
        </div>
      </div>

      <div class="signatures">
        <div>
          <div class="sign-title">Bên giao</div>
          <div class="sign-note">(Ký, ghi rõ họ tên)</div>
        </div>
        <div>
          <div class="sign-title">Bên nhận</div>
          <div class="sign-note">(Ký, ghi rõ họ tên)</div>
        </div>
        <div>
          <div class="sign-title">Người lập phiếu</div>
          <div class="sign-note">(Ký, ghi rõ họ tên)</div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
}
