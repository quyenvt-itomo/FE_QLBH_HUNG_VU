import { FE_BASE_URL } from "../../constants/ApiEndpoint";
import { DiscountTypeEnum, OrderLineTypeEnum } from "../../constants/enum";
import { IOrder } from "../../models/store/order";
import { IOrderLine } from "../../models/store/orderLine";
import { getFullAddress, getFullVariantOptionContent, getPriceContent } from "../common";
import { formatVietNamDate } from "../dateUtils";
import { formatMoney, formatQuantity, numberToVietnameseWords } from "../formatNumber";

export function getSaleReturnOrderHtmlContent(data: IOrder, qrImage?: string) {
  const returnLines =
    data.lines?.filter((line) => line.lineType === OrderLineTypeEnum.RETURN) || [];
  const normalLines =
    data.lines?.filter((line) => line.lineType === OrderLineTypeEnum.NORMAL) || [];

  const summaryLines = [
    {
      label: "Tổng tiền hàng:",
      value: data.grossAmount || 0 - (data.lineDiscountAmount || 0),
    },
    {
      label: "Giảm giá đơn hàng:",
      value: data.orderDiscountAmount || 0,
    },
    {
      label: "VAT:",
      value: data.taxAmount || 0,
    },
    {
      label: "Phí giao hàng:",
      value: data.isFreeShipping ? 0 : data.shippingFee || 0,
    },
    {
      label: "Sử dụng điểm:",
      value: data.loyaltyPointsDiscountAmount || 0,
    },
    {
      label: "Tổng thanh toán:",
      value: (data.totalAmount || 0) - (data.loyaltyPointsDiscountAmount || 0),
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
    <title>Hóa đơn bán hàng</title>
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

      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
      }

      .detail th,
      .detail td {
        /* border: 1px solid #4f81bd; */
        padding: 2px 4px;
        word-break: break-word;
        /* vertical-align: top; */
      }

      /* ===== DETAIL TABLE ===== */
      .detail thead th {
        font-weight: semi-bold;
        border-top: 1px solid #323832;
        border-bottom: 1px solid #323832;
      }

      .detail td {
        border-bottom: 1px dashed #323832;
      }

      /* ===== TEXT HELPERS ===== */
      .text-right {
        text-align: right;
      }

      .text-left {
        text-align: left;
      }

      .text-center {
        text-align: center;
      }

      /* ===== FOOTER ===== */
      footer span {
        font-size: 8px;
      }
    </style>
  </head>

  <body>
    <div class="receipt">
      <!-- ===== HEADER ===== -->
      <header>
        <div class="flex flex-col items-center">
          <!-- Logo -->
          <img
            src="${FE_BASE_URL}logo.svg"
            alt="Logo"
            style="height: 40px"
          />
          <span class="font-semibold">${data.store?.name || ""}</span>
          <span class="text-center">Địa chỉ: ${getFullAddress(data.store.address) || "--"}</span>
          <span>SĐT: ${data.store.phone || "--"}</span>
          <span class="font-semibold">HÓA ĐƠN BÁN HÀNG</span>
          <span class="mt-2">Số HĐ: ${data.code}</span>
          <span>${formatVietNamDate(data.orderAt)}</span>
        </div>
        <div class="flex flex-col">
          <span>Khách hàng: ${data.partner?.name || "--"}</span>
          <span>SĐT: ${data.partner?.phone || "--"}</span>
          <span>Địa chỉ: ${getFullAddress(data.partner?.addresses?.[0]) || "--"}</span>
        </div>
      </header>

      <!-- ===== MAIN ===== -->
      <main class="mt-2">
        <!-- DETAIL -->
        <table class="detail mt-2">
          <colgroup>
            <col />
            <col style="width: 40px" />
            <col style="width: 60px" />
          </colgroup>
          <thead>
            <tr>
              <th class="text-left">Đơn giá</th>
              <th class="text-right">SL</th>
              <th class="text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${normalLines
              .map(
                (item, index) => `
            <tr>
              <td class="text-left">
                <div class="flex flex-col">
                <span>
                ${item.productVariantSnapshot?.product?.name || "--"} (${item.productVariantSnapshot?.product?.unit.name || "--"}) ${item.productVariantSnapshot.options?.length ? getFullVariantOptionContent(item.productVariantSnapshot) : ""}
                </span>
                </div>
                <span>${getPriceContent(item)}</span>
              </td>
              <td class="text-right">${formatQuantity(item.quantity)}</td>
              <td class="text-right">${formatMoney(item.subTotal - (item.discountAmount || 0))}</td>
            </tr>
            `,
              )
              .join("")}
            ${
              returnLines.length > 0
                ? `
            <tr>
              <td colspan="3" class="text-center font-semibold" style="padding-top: 8px; border-top: 2px solid #323832;">
                HÀNG HOÀN TRẢ
              </td>
            </tr>
            ${returnLines
              .map(
                (item, index) => `
            <tr>
              <td class="text-left">
                <div class="flex flex-col">
                <span>
                ${item.productVariantSnapshot?.product?.name || "--"} (${item.productVariantSnapshot?.product?.unit.name || "--"}) ${item.productVariantSnapshot.options?.length ? getFullVariantOptionContent(item.productVariantSnapshot) : ""}
                </span>
                </div>
                <span>${getPriceContent(item)}</span>
              </td>
              <td class="text-right">-${formatQuantity(Math.abs(item.quantity))}</td>
              <td class="text-right">-${formatMoney(Math.abs(item.subTotal - (item.discountAmount || 0)))}</td>
            </tr>
            `,
              )
              .join("")}
            `
                : ""
            }
          </tbody>
        </table>
      </main>

      <!-- ===== SUMMARY ===== -->
      <div class="mt-4">
        <table>
          <tbody>
            <colgroup>
              <col />
              <col style="width: 60px" />
            </colgroup>
            ${summaryLines
              .map(
                (line) => `
            <tr>
              <td class="text-right">${line.label}</td>
              <td class="text-right">${formatMoney(line.value)}</td>
            </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <!-- ===== FOOTER ===== -->
      <footer class="mt-4 flex flex-col items-center">
        <span>(${numberToVietnameseWords((data.totalAmount || 0) - (data.loyaltyPointsDiscountAmount || 0))})</span>

        <!-- ===== QR ===== -->
        ${
          qrImage
            ? `
          <div class="mt-3 flex flex-col items-center">
            <span class="text-center">Quét mã QR để chuyển khoản</span>
            <img
              src="${qrImage}"
              alt="VietQR Payment"
              style="width: 96px; height: 96px; margin-top: 4px;"
            />
          </div>
        `
            : ""
        }

        <span>Xin cảm ơn quý khách và hẹn gặp lại!</span>
      </footer>
      
    </div>
  </body>
</html>

`;
}
