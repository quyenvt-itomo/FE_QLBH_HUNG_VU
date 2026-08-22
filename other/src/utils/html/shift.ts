import { FE_BASE_URL } from "../../constants/ApiEndpoint";
import { CASH_KEYS, checklistKeyMap } from "../../constants/enum";
import { IShift } from "../../models/store/shift";
import { getFullAddress } from "../common";
import { formatVietNamDate, formatDateTimeDDMMYYYY } from "../dateUtils";
import { formatMoney } from "../formatNumber";

export function getShiftHtmlContent(data: IShift) {
  const hasClosing = !!data.closingCash && data.closingCash > 0;

  // Tính tổng thu vào
  const totalCashIn = data.totalCashInFromOrders || 0 + (data.totalCashIn || 0);

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
    <title>Phiếu ca làm việc</title>
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
        padding: 2px 4px;
        word-break: break-word;
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

      .font-semibold {
        font-weight: 600;
      }

      .font-bold {
        font-weight: 700;
      }

      .mt-1 {
        margin-top: 4px;
      }

      .mt-2 {
        margin-top: 8px;
      }

      .mt-3 {
        margin-top: 12px;
      }

      .mt-4 {
        margin-top: 16px;
      }

      .mb-1 {
        margin-bottom: 4px;
      }

      .mb-2 {
        margin-bottom: 8px;
      }

      /* ===== FOOTER ===== */
      footer span {
        font-size: 8px;
      }

      .section-title {
        font-weight: 600;
        border-bottom: 1px solid #323832;
        padding-bottom: 2px;
        margin-top: 12px;
        margin-bottom: 6px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 3px 0;
      }

      .summary-row.highlight {
        background-color: #f3f4f6;
        padding: 4px;
        margin: 4px -4px;
        border-radius: 2px;
        font-weight: 600;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        color: white;
        font-size: 8px;
        font-weight: bold;
        margin-right: 4px;
      }

      .badge-blue {
        background-color: #3b82f6;
      }

      .badge-green {
        background-color: #10b981;
      }

      .badge-red {
        background-color: #ef4444;
      }

      .badge-yellow {
        background-color: #f59e0b;
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
          <span class="text-center">Địa chỉ: ${getFullAddress(data.store?.address) || "--"}</span>
          <span>SĐT: ${data.store?.phone || "--"}</span>
          <span class="font-semibold mt-2">PHIẾU CA LÀM VIỆC</span>
          <span class="mt-1">Mã ca: ${data.code}</span>
        </div>
        <div class="flex flex-col mt-2">
          <span>Nhân viên: ${data.createdBySnapshot?.name || "--"}</span>
          <span>Bắt đầu: ${formatDateTimeDDMMYYYY(data.startAt)}</span>
          ${data.endAt ? `<span>Kết thúc: ${formatDateTimeDDMMYYYY(data.endAt)}</span>` : ""}
        </div>
      </header>

      <!-- ===== MAIN ===== -->
      <main>
        <!-- TỔNG QUAN -->
        <div class="section-title">TỔNG QUAN CA LÀM VIỆC</div>
        <div class="summary-row">
          <span>Tổng đơn hàng:</span>
          <span class="font-bold">${data.totalSaleOrder || 0}</span>
        </div>
        <div class="summary-row">
          <span>Tổng đơn hoàn:</span>
          <span class="font-bold">${data.totalSaleReturnOrder || 0}</span>
        </div>
        <div class="summary-row">
          <span>Doanh thu:</span>
          <span class="font-bold">${formatMoney(data.totalCashInFromOrders) || 0} đ</span>
        </div>
        <div class="summary-row">
          <span>Khách chưa thanh toán:</span>
          <span class="font-bold">${formatMoney(data.totalDebtAmount) || 0} đ</span>
        </div>

        <!-- THU CHI TIỀN MẶT -->
        <div class="section-title">THU CHI TIỀN MẶT</div>
        <div class="summary-row">
          <span>Thu từ đơn hàng:</span>
          <span class="font-bold">+${formatMoney(data.totalCashInFromOrders) || 0} đ</span>
        </div>
        <div class="summary-row">
          <span>Thu vào khác:</span>
          <span class="font-bold">+${formatMoney(data.totalCashIn) || 0} đ</span>
        </div>
        <div class="summary-row">
          <span>Chi ra:</span>
          <span class="font-bold">-${formatMoney(data.totalCashOut) || 0} đ</span>
        </div>
        <div class="summary-row highlight">
          <span>Tổng thu vào:</span>
          <span>+${formatMoney(totalCashIn) || 0} đ</span>
        </div>

        <!-- KIỂM KÊ TIỀN ĐẦU CA -->
        <div class="section-title">KIỂM KÊ TIỀN ĐẦU CA</div>
        <table class="detail">
          <colgroup>
            <col style="width: 35%" />
            <col style="width: 25%" />
            <col style="width: 40%" />
          </colgroup>
          <thead>
            <tr>
              <th class="text-left">Mệnh giá</th>
              <th class="text-center">SL</th>
              <th class="text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${CASH_KEYS.map((key) => {
              const qty = data.openingCashSnapshot?.[key] || 0;
              if (qty === 0) return "";
              return `
            <tr>
              <td class="text-left">${formatMoney(Number(key))} đ</td>
              <td class="text-center">${qty}</td>
              <td class="text-right">${formatMoney(qty * Number(key))} đ</td>
            </tr>
              `;
            })
              .filter((row) => row)
              .join("")}
          </tbody>
        </table>
        <div class="summary-row highlight mt-1">
          <span>Tổng tiền đầu ca:</span>
          <span>${formatMoney(data.openingCash) || 0} đ</span>
        </div>

        ${
          hasClosing
            ? `
        <!-- KIỂM KÊ TIỀN CUỐI CA -->
        <div class="section-title">KIỂM KÊ TIỀN CUỐI CA</div>
        <table class="detail">
          <colgroup>
            <col style="width: 35%" />
            <col style="width: 25%" />
            <col style="width: 40%" />
          </colgroup>
          <thead>
            <tr>
              <th class="text-left">Mệnh giá</th>
              <th class="text-center">SL</th>
              <th class="text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${CASH_KEYS.map((key) => {
              const qty = data.closingCashSnapshot?.[key] || 0;
              if (qty === 0) return "";
              return `
            <tr>
              <td class="text-left">${formatMoney(Number(key))} đ</td>
              <td class="text-center">${qty}</td>
              <td class="text-right">${formatMoney(qty * Number(key))} đ</td>
            </tr>
              `;
            })
              .filter((row) => row)
              .join("")}
          </tbody>
        </table>
        <div class="summary-row highlight mt-1">
          <span>Tổng tiền cuối ca:</span>
          <span>${formatMoney(data.closingCash) || 0} đ</span>
        </div>
        `
            : ""
        }

        ${
          hasClosing
            ? `
        <!-- CÔNG THỨC TÍNH TIỀN -->
        <div class="section-title">CÔNG THỨC TÍNH TIỀN CUỐI CA</div>
        <div class="summary-row">
          <span><span class="badge badge-blue">1</span>Tiền đầu ca:</span>
          <span class="font-bold">${formatMoney(data.openingCash) || 0} đ</span>
        </div>
        <div class="summary-row">
          <span><span class="badge badge-green">2</span>Thu từ đơn hàng:</span>
          <span class="font-bold">+${formatMoney(data.totalCashInFromOrders) || 0} đ</span>
        </div>
        <div class="summary-row">
          <span><span class="badge badge-green">3</span>Thu vào khác:</span>
          <span class="font-bold">+${formatMoney(data.totalCashIn) || 0} đ</span>
        </div>
        <div class="summary-row">
          <span><span class="badge badge-red">4</span>Chi ra:</span>
          <span class="font-bold">-${formatMoney(data.totalCashOut) || 0} đ</span>
        </div>
        <div class="summary-row highlight" style="background-color: #fef3c7; font-weight: 700;">
          <span>Dự kiến (1+2+3-4):</span>
          <span>${formatMoney(data.expectedCash) || 0} đ</span>
        </div>
        <div class="summary-row highlight" style="background-color: #d1fae5;">
          <span>Thực tế đếm được:</span>
          <span>${formatMoney(data.closingCash) || 0} đ</span>
        </div>
        <div class="summary-row highlight" style="background-color: ${
          data.difference || 0 >= 0 ? "#d1fae5" : "#fee2e2"
        }; font-weight: 700;">
          <span>Chênh lệch ${data.difference || 0 >= 0 ? "(Thừa)" : "(Thiếu)"}:</span>
          <span>
            ${data.difference || 0 > 0 ? "+" : ""}${formatMoney(data.difference) || 0} đ
          </span>
        </div>
        `
            : ""
        }

        <!-- CHECKLIST -->
        ${
          (data.openingChecklist || data.closingChecklist) &&
          Object.keys(data.openingChecklist || data.closingChecklist || {}).length > 0
            ? `
        <div class="section-title">CHECKLIST ${hasClosing ? "CUỐI CA" : "ĐẦU CA"}</div>
        ${Object.entries((hasClosing ? data.closingChecklist : data.openingChecklist) || {})
          .map(
            ([key, value]) => `
        <div class="summary-row">
          <span>${checklistKeyMap[key as keyof typeof checklistKeyMap] || key}:</span>
          <span class="font-bold">${value ? "✓ Đã kiểm tra" : "✗ Chưa"}</span>
        </div>
        `,
          )
          .join("")}
        `
            : ""
        }

        <!-- GHI CHÚ -->
        ${
          data.note
            ? `
        <div class="section-title">GHI CHÚ</div>
        <div style="padding: 4px 0;">
          <span>${data.note}</span>
        </div>
        `
            : ""
        }
      </main>

      <!-- ===== FOOTER ===== -->
      <footer class="mt-4 flex flex-col items-center">
        <span class="mt-1">In lúc: ${formatVietNamDate(new Date().toISOString())}</span>

        <!-- ===== 2 cột ký nhận NV giao ca và NV nhận ca ===== -->
        <div class="mt-4 flex w-full">
          <div class="flex flex-col items-center flex-1">
            <span class="font-semibold">NV giao ca</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <span class="font-semibold">NV nhận ca</span>
        </div>
      </footer>
    </div>
  </body>
</html>
`;
}
