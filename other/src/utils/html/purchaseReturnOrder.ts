import { FE_BASE_URL } from "../../constants/ApiEndpoint";
import { OrderLineTypeEnum } from "../../constants/enum";
import { IOrder } from "../../models/store/order";
import { getFullAddress, getFullVariantOptionContent, getPriceContent } from "../common";
import { formatVietNamDate } from "../dateUtils";
import { formatMoney, formatQuantity, numberToVietnameseWords } from "../formatNumber";

export function getPurchaseReturnOrderHtmlContent(data: IOrder) {
  const normalLines =
    data.lines?.filter((line) => line.lineType === OrderLineTypeEnum.NORMAL) || [];

  const summaryLines = [
    {
      label: "Tổng tiền trả:",
      value: data.grossAmount || 0,
    },
    {
      label: "Giảm giá:",
      value: (data.lineDiscountAmount || 0) + (data.orderDiscountAmount || 0),
    },
    {
      label: "VAT:",
      value: data.taxAmount || 0,
    },
    {
      label: "Tổng tiền nhận lại:",
      value: data.totalAmount || 0,
    },
  ].filter((line) => line.value && line.value > 0);

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
    <title>Hóa đơn trả hàng nhập</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

    <style>
      @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;200;300;400;500;600;700;800;900&display=swap");
      /* ===== PAGE SETUP FOR K57 ===== */
      @page {
        size: 57mm auto;
        margin: 2mm;
      }

      html,
      body {
        width: 57mm;
        margin: 0;
        padding: 0;
        font-family: "Be Vietnam Pro", sans-serif;
      }

      /* ===== GLOBAL ===== */
      * {
        box-sizing: border-box;
        font-size: 9px;
        line-height: 1.4;
      }

      .receipt {
        width: 100%;
        max-width: 57mm;
        overflow-x: hidden;
        padding: 2mm;
      }

      /* ===== HEADER ===== */
      .header {
        text-align: center;
        margin-bottom: 3mm;
      }

      .shop-name {
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        margin-bottom: 0.5mm;
      }
      .shop-info {
        font-size: 8px;
        margin-bottom: 0.2mm;
      }

      /* ===== TITLE ===== */
      .title {
        font-size: 11px;
        font-weight: 800;
        text-align: center;
        text-transform: uppercase;
        margin: 2mm 0;
      }

      /* ===== INFO BOX ===== */
      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5mm;
      }
      .label {
        font-weight: 600;
        white-space: nowrap;
        margin-right: 1mm;
      }
      .val {
        text-align: right;
        word-break: break-all;
      }

      /* ===== TABLE ===== */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 2mm 0;
      }
      th {
        border-bottom: 1px dashed #000;
        padding: 1mm 0;
        text-align: left;
        font-weight: 700;
      }
      td {
        padding: 1.5mm 0;
        vertical-align: top;
      }
      .item-name {
        font-weight: 500;
        margin-bottom: 0.5mm;
      }
      .item-details {
        font-size: 8px;
        color: #444;
      }

      /* ===== SUMMARY ===== */
      .summary {
        border-top: 1px dashed #000;
        padding-top: 2mm;
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1mm;
      }
      .total-label {
        font-weight: 700;
      }
      .total-val {
        font-weight: 700;
        font-size: 10px;
      }

      /* ===== FOOTER ===== */
      .footer {
        text-align: center;
        margin-top: 4mm;
        border-top: 1px dashed #000;
        padding-top: 2mm;
      }
      .footer p {
        font-size: 8px;
        font-style: italic;
        margin-bottom: 1mm;
      }
    </style>
  </head>

  <body>
    <div class="receipt">
      <!-- HEADER -->
      <div class="header">
        <div class="flex flex-col items-center">
          <img
            src="${FE_BASE_URL}logo.svg"
            alt="Logo"
            style="height: 40px"
          />
          <span class="font-semibold">${data.store?.name || "DUC TAI FOOD"}</span>
          <span class="text-center">Địa chỉ: ${getFullAddress(data.store?.address) || "KCN Tây Bắc Ga, TP Thanh Hóa"}</span>
          <span>SĐT: ${data.store?.phone || "098.888.8888"}</span>
          <span class="font-semibold uppercase mt-2">PHIẾU CHI TRẢ HÀNG NHẬP</span>
          <span class="mt-1">Mã phiếu: ${data.code}</span>
          <span>${formatVietNamDate(data.orderAt)}</span>
        </div>
      </div>

      <!-- INFO -->
      <div class="info-box mt-2 border-t border-dashed border-black pt-1">
        <div class="info-row">
          <span class="label">Nhà CC:</span>
          <span class="val font-semibold">${data.partner?.name || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="label">Liên hệ:</span>
          <span class="val">${data.partner?.phone || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="label">Ghi chú:</span>
          <span class="val">${data.note || ""}</span>
        </div>
      </div>

      <!-- ITEMS TABLE -->
      <table>
        <thead>
          <tr>
            <th width="45%">Đơn giá</th>
            <th width="20%" style="text-align: center">SL</th>
            <th width="35%" style="text-align: right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${normalLines
            .map(
              (item) => `
          <tr>
            <td class="text-left">
                            <div class="flex flex-col">
                            <span>
                            ${item.productVariantSnapshot?.product?.name || "--"} (${item.productVariantSnapshot?.product?.unit.name || "--"}) ${item.productVariantSnapshot.options?.length ? getFullVariantOptionContent(item.productVariantSnapshot) : ""}
                            </span>
                            </div>
                            <span>${getPriceContent(item)}</span>
                          </td>
            <td style="text-align: center">${formatQuantity(item.quantity * -1)}</td>
            <td style="text-align: right">
              <td class="text-right">${formatMoney(item.subTotal - (item.discountAmount || 0))}</td>
            </td>
          </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <!-- SUMMARY -->
      <div class="summary">
        ${summaryLines
          .map(
            (line) => `
        <div class="total-row">
          <span class="${line.label.includes("Tổng tiền nhận lại") ? "total-label font-bold" : ""}">${line.label}</span>
          <span class="${line.label.includes("Tổng tiền nhận lại") ? "total-val font-bold" : ""}">${formatMoney(line.value)}</span>
        </div>
        `,
          )
          .join("")}

        <div class="mt-2 pt-2 border-t border-dashed border-gray-300">
          <div class="italic text-[8px]">
            Bằng chữ: <span class="font-semibold capitalize">${numberToVietnameseWords(data.totalAmount || 0)} đồng</span>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}
