import { FE_BASE_URL } from "../../constants/ApiEndpoint";
import { IStoreTransfer } from "../../models/storeTransfer";
import { formatDateTimeDDMMYYYY } from "../dateUtils";
import { formatQuantity } from "../formatNumber";

export function getStoreTransferHtmlContent(data: IStoreTransfer) {
  const totalQuantity = data.lines?.reduce((sum, line) => sum + (line.quantity || 0), 0) || 0;

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
    <title>Phiếu chuyển kho - ${data.code}</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

    <style>
      @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;200;300;400;500;600;700;800;900&display=swap");
      
      @page {
        size: A4;
        margin: 15mm;
      }

      body {
        font-family: "Be Vietnam Pro", sans-serif;
        background-color: white;
        color: black;
        margin: 0;
        padding: 0;
        font-size: 12px;
      }

      .container {
        width: 100%;
        max-width: 190mm;
        margin: 0 auto;
      }

      .title {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
        text-transform: uppercase;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }

      th, td {
        border: 1px solid #000;
        padding: 8px;
        line-height: 1.4;
      }

      th {
        background-color: #f3f4f6;
        font-weight: bold;
        text-align: center;
      }

      .no-border-table td {
        border: none;
        padding: 4px 0;
      }
    </style>
  </head>

  <body>
    <div class="container py-8">
      <!-- TIÊU ĐỀ -->
      <div class="title">PHIẾU CHUYỂN KHO</div>

      <!-- THÔNG TIN CHUNG -->
      <table class="no-border-table w-full mb-6">
        <tr>
          <td width="15%" class="font-bold">Số phiếu:</td>
          <td width="35%">${data.code}</td>
          <td width="15%" class="font-bold pr-4">Ngày:</td>
          <td width="35%">${formatDateTimeDDMMYYYY(data.occurredAt)}</td>
        </tr>
        <tr>
          <td class="font-bold">Kho xuất:</td>
          <td>${data.fromStore?.name || "N/A"}</td>
          <td class="font-bold pr-4">Kho nhập:</td>
          <td>${data.toStore?.name || "N/A"}</td>
        </tr>
        <tr>
          <td class="font-bold">Lý do:</td>
          <td colspan="3">${data.reason || ""}</td>
        </tr>
        <tr>
          <td class="font-bold">Ghi chú:</td>
          <td colspan="3">${data.note || ""}</td>
        </tr>
      </table>

      <!-- BẢNG VẬT TƯ -->
      <table>
        <thead>
          <tr>
            <th width="5%">STT</th>
            <th width="15%">Mã vật tư</th>
            <th width="30%">Tên vật tư</th>
            <th width="10%">ĐVT</th>
            <th width="12%">Số lượng</th>
            <th width="13%">Giá bán</th>
            <th width="15%">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          ${(data.lines || [])
            .map(
              (line, index) => `
          <tr>
            <td class="text-center">${index + 1}</td>
            <td>${line.productVariant?.barcode || line.productVariant?.product?.code || ""}</td>
            <td>${line.productVariantSnapshot?.product?.name || line.productVariant?.product?.name || ""}</td>
            <td class="text-center">${line.productVariant?.product?.unit?.name || ""}</td>
            <td class="text-right">${formatQuantity(line.quantity)}</td>
            <td class="text-right">${formatQuantity(line.productVariant?.price || 0)}</td>
            <td>${line.note || ""}</td>
          </tr>
          `,
            )
            .join("")}
          <!-- DÒNG TỔNG CỘNG -->
          <tr class="font-bold bg-gray-50">
            <td colspan="4" class="text-center">TỔNG CỘNG</td>
            <td class="text-right">${formatQuantity(totalQuantity)}</td>
            <td colspan="2"></td>
          </tr>
        </tbody>
      </table>

      <!-- CHỮ KÝ -->
      <div class="grid grid-cols-3 gap-4 mt-12 text-center">
        <div>
          <div class="font-bold">Kho xuất</div>
          <div class="italic text-xs">(Ký, ghi rõ họ tên)</div>
        </div>
        <div>
          <div class="font-bold">Kho nhận</div>
          <div class="italic text-xs">(Ký, ghi rõ họ tên)</div>
        </div>
        <div>
          <div class="font-bold">Người lập phiếu</div>
          <div class="italic text-xs">(Ký, ghi rõ họ tên)</div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}
