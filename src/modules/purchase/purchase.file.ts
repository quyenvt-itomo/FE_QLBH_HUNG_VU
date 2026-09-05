import ExcelJS from "exceljs";
import dayjs from "dayjs";
import { Purchase, PurchaseLine } from "./purchase.model";
import { getLineProduct, getLineUnit } from "./purchase.util";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";

export interface PurchaseFileOptions {
  hidePrice?: boolean;
}

export const purchaseExcelColumns = [
  "Mã hàng",
  "Tên hàng",
  "Đơn vị tính",
  "Đơn giá",
  "Số lượng",
  "Thành tiền",
];

export const purchaseLineToExcelRow = (line: PurchaseLine, hidePrice = false) => {
  const product = getLineProduct(line);
  const unit = getLineUnit(line);
  const quantity = Number(line.quantity || 0);
  const price = Number(line.unitPrice || 0);
  return [
    product.code || "",
    product.name || "",
    unit.name || "",
    hidePrice ? "" : price,
    quantity,
    hidePrice ? "" : quantity * price,
  ];
};

const downloadWorkbook = async (workbook: ExcelJS.Workbook, filename: string) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const styleHeader = (sheet: ExcelJS.Worksheet) => {
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1677FF" },
  };
};

const setColumns = (sheet: ExcelJS.Worksheet) => {
  sheet.columns = purchaseExcelColumns.map((header, index) => ({
    header,
    key: String(index),
    width: [18, 34, 18, 16, 14, 10, 14, 18][index],
  }));
};

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const printMoney = (value: unknown) => formatMoney(Number(value) || 0) || "0";
const printQuantity = (value: unknown) => formatQuantity(Number(value) || 0) || "0";

export class PurchaseFile {
  static async exportExcel(purchase: Purchase, options: PurchaseFileOptions = {}) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Danh sách hàng hóa");
    setColumns(sheet);
    styleHeader(sheet);
    sheet.addRows(
      (purchase.lines || []).map((line) => purchaseLineToExcelRow(line, options.hidePrice)),
    );
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1)
        row.eachCell((cell, index) => {
          if ([4, 5, 7, 8].includes(index) && typeof cell.value === "number") cell.numFmt = "#,##0";
        });
    });
    await downloadWorkbook(workbook, `danh_sach_hang_hoa_${purchase.code || "phieu_nhap"}.xlsx`);
  }

  static async exportRows(rows: unknown[][], filename = "hang_hoa_chua_tim_thay.xlsx") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Hàng hóa chưa tìm thấy");
    sheet.addRow(purchaseExcelColumns);
    sheet.addRows(rows);
    setColumns(sheet);
    styleHeader(sheet);
    await downloadWorkbook(workbook, filename);
  }

  static async downloadTemplate() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Phiếu nhập");
    sheet.addRow(purchaseExcelColumns);
    sheet.addRow(["", "", "", "", "", "", 1, ""]);
    setColumns(sheet);
    styleHeader(sheet);
    await downloadWorkbook(workbook, "bieu_mau_phieu_nhap_hang.xlsx");
  }

  static print(purchase: Purchase, options: PurchaseFileOptions = {}) {
    const hidePrice = options.hidePrice === true;
    const headers = hidePrice
      ? [
          purchaseExcelColumns[0],
          purchaseExcelColumns[1],
          purchaseExcelColumns[2],
          purchaseExcelColumns[4],
        ]
      : purchaseExcelColumns;
    const rows = (purchase.lines || [])
      .map((line) => {
        const values = purchaseLineToExcelRow(line, hidePrice);
        const visible = hidePrice
          ? [values[0], values[1], values[2], printQuantity(values[4])]
          : [
              values[0],
              values[1],
              values[2],
              printMoney(values[3]),
              printQuantity(values[4]),
              printMoney(values[5]),
            ];
        return `<tr>${visible.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`;
      })
      .join("");
    const html = `<!doctype html><html><head><title>Phiếu nhập ${escapeHtml(purchase.code)}</title><style>
      *{box-sizing:border-box}body{font:14px Arial;color:#111;margin:24px}h1{text-align:center}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #999;padding:7px}th{background:#eef5ff}td:nth-child(n+4){text-align:right}.meta{display:flex;justify-content:space-between;margin:14px 0}@media print{body{margin:10mm}}
    </style></head><body><h1>PHIẾU NHẬP HÀNG</h1><div class="meta"><span>Mã phiếu: ${escapeHtml(purchase.code)}</span><span>Ngày: ${dayjs(purchase.orderAt).format("DD/MM/YYYY HH:mm")}</span></div><div>Nhà cung cấp: ${escapeHtml(purchase.partner?.name || purchase.partnerSnapshot?.name)}</div><table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table><script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}</script></body></html>`;
    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
