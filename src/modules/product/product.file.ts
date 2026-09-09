import ExcelJS from "exceljs";

export const productExcelColumns = [
  "Mã hàng",
  "Tên hàng",
  "Đơn vị tính",
  "Đơn giá",
  "Số lượng",
  "Thành tiền",
];

export interface ProductExcelRow {
  code: string;
  unitName: string;
  quantity: number;
  cells: unknown[];
}

const cellText = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "object" && value && "richText" in value) {
    return ((value as any).richText || []).map((item: any) => item.text || "").join("");
  }
  return String(value).trim();
};

const cellNumber = (value: unknown): number => {
  const number = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(number) ? number : 0;
};

export const readProductExcel = async (file: File): Promise<ProductExcelRow[]> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load((await file.arrayBuffer()) as any);

  const sheet = workbook.worksheets[0];
  if (!sheet) return [];

  const rows: ProductExcelRow[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 1) return;

    const cells = productExcelColumns.map((_column, index) =>
      row.getCell(index + 1).value,
    );
    const code = cellText(cells[0]);
    if (!code) return;

    const quantity = Math.max(
      0,
      cellNumber(cells[4]) || cellNumber(row.getCell(7).value),
    );
    rows.push({
      code,
      unitName: cellText(cells[2]).toLowerCase(),
      quantity: quantity || 1,
      cells,
    });
  });

  return rows;
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
  sheet.columns = productExcelColumns.map((header, index) => ({
    header,
    key: String(index),
    width: [18, 34, 18, 16, 14, 14][index],
  }));
};

export class ProductFile {
  static async downloadTemplate() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Hàng hóa");
    sheet.addRow(productExcelColumns);
    sheet.addRow(["", "", "", "", 1, ""]);
    setColumns(sheet);
    styleHeader(sheet);
    await downloadWorkbook(workbook, "bieu_mau_hang_hoa.xlsx");
  }

  static async exportRows(rows: unknown[][], filename = "hang_hoa_chua_tim_thay.xlsx") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Hàng hóa chưa tìm thấy");
    sheet.addRow(productExcelColumns);
    sheet.addRows(rows);
    setColumns(sheet);
    styleHeader(sheet);
    await downloadWorkbook(workbook, filename);
  }
}
