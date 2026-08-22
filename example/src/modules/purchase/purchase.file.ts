import ExcelJS from "exceljs";
import dayjs from "dayjs";
import { Purchase } from "./purchase.model";
import { PurchaseLine } from "../purchaseLine";
import { getFullAddress, resolveByPath } from "@/shared/utils/common.util";
import { buildFileUrl } from "@/shared/utils/url.util";
import { Organization } from "../organization";
import { numberToVietnameseWords } from "@/shared/utils/number.util";
import { getMainFile } from "@/shared/utils/file.util";
import {
  BORDER_DOUBLE,
  ALIGN_CENTER,
  ALIGN_LEFT,
  ALIGN_RIGHT,
  unicodeToTCVN3,
  excelFont as font,
  setCell,
  fetchImageAsBase64,
} from "@/shared/utils/excel.util";

// ── Layout constants (purchase-specific) ──

const FONT = "Times New Roman";
const SIZE = 12;
const MAX_LINES = 10;
const TOTAL_COLS = 9; // A -> I
const PAD = 0.71;
const DEFAULT_ROW_HEIGHT = 21;

// ── PurchaseFile ──
export class PurchaseFile {
  static async exportExcel(purchase: Purchase, currentCompany?: Organization | null) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Đơn đặt hàng", {
      pageSetup: {
        paperSize: 9,
        orientation: "portrait",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      },
    });

    worksheet.properties.defaultRowHeight = DEFAULT_ROW_HEIGHT;

    // Column widths
    worksheet.getColumn("A").width = 4 + PAD;
    worksheet.getColumn("B").width = 23 + PAD;
    worksheet.getColumn("C").width = 6 + PAD;
    worksheet.getColumn("D").width = 11.5 + PAD;
    worksheet.getColumn("E").width = 8 + PAD;
    worksheet.getColumn("F").width = 14 + PAD;
    worksheet.getColumn("G").width = 4.5 + PAD;
    worksheet.getColumn("H").width = 12 + PAD;
    worksheet.getColumn("I").width = 14 + PAD;

    await this.buildHeader(worksheet, purchase, workbook, currentCompany);
    this.buildSupplier(worksheet, purchase);
    this.buildIntro(worksheet, purchase, currentCompany);
    const tableStartRow = this.buildTableHeader(worksheet);
    const bodyEndRow = this.buildLines(worksheet, purchase, tableStartRow);
    const totalRow = bodyEndRow + 1;
    this.buildTotal(worksheet, purchase, totalRow);
    this.buildAmountInWords(worksheet, purchase, totalRow + 1);
    this.buildAdditionalInfo(worksheet, purchase, totalRow + 2);
    this.buildFooter(worksheet, totalRow + 2 + (purchase.additionalInfo?.length || 0));

    // Print
    worksheet.pageSetup.margins = {
      left: 0.2,
      right: 0.2,
      top: 0.3,
      bottom: 0.3,
      header: 0,
      footer: 0,
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Don-dat-hang-${purchase.code}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Row 1-4: Header with logo & company info ──
  private static async buildHeader(
    worksheet: ExcelJS.Worksheet,
    purchase: Purchase,
    workbook: ExcelJS.Workbook,
    currentCompany?: Organization | null,
  ) {
    const company = currentCompany ?? purchase.company;

    // Row 1-3: Logo (A1:B3) + Company info
    worksheet.mergeCells("A1:B3");

    worksheet.getRow(1).height = 20;
    worksheet.getRow(2).height = 20;
    worksheet.getRow(3).height = 20;

    const logoFiles = company?.logo;

    if (logoFiles?.length) {
      const mainLogo = getMainFile(logoFiles);
      const logoUrl = mainLogo?.url ? buildFileUrl(mainLogo.url) : null;

      if (logoUrl) {
        try {
          const imgBase64 = await fetchImageAsBase64(logoUrl);

          if (imgBase64) {
            const imgId = workbook.addImage({
              base64: imgBase64,
              extension: "png",
            });

            // addImageBottomCenter(worksheet, imgId, {
            //   startCol: 0, // A
            //   startRow: 0, // 1
            //   endCol: 1, // B
            //   endRow: 2, // 3
            //   width: 70,
            //   height: 70,
            // });
            worksheet.addImage(imgId, {
              tl: {
                col: 1.99, // 1 = Cột B, .18 = dịch sang phải 18% độ rộng cột B (Căn giữa A+B)
                row: 0.25, // Tương tự, tinh chỉnh số này 1 lần duy nhất cho sát đáy Row 3
              },
              ext: { width: 90, height: 75 },
            });
          }
        } catch {
          // ignore
        }
      }
    }

    // C1:I1: Company name (TCVN3 encoding for .VnUniverseH font)
    worksheet.mergeCells("C1:I1");
    setCell(worksheet, "C1", unicodeToTCVN3((company?.name || "").toUpperCase()), {
      font: font(15, true, ".VnUniverseH"),
      align: ALIGN_LEFT,
    });

    // C2:I2: Địa chỉ
    worksheet.mergeCells("C2:I2");
    setCell(worksheet, "C2", `Địa chỉ: ${getFullAddress(company?.address)}`, {
      font: font(),
      align: ALIGN_LEFT,
    });

    // C3:I3: Điện thoại
    worksheet.mergeCells("C3:I3");
    setCell(worksheet, "C3", `Điện thoại: ${company?.phone || ""}`, {
      font: font(),
      align: ALIGN_LEFT,
    });

    // Row 4: ISO + MST + double border (top+bottom)
    worksheet.mergeCells("A4:B4");
    setCell(worksheet, "A4", "ISO 9001:2015", {
      font: font(12, true, ".VnTime"),
      align: ALIGN_CENTER,
    });

    worksheet.mergeCells("C4:I4");
    setCell(worksheet, "C4", `MST: ${company?.taxCode || ""}`, {
      font: font(),
      align: ALIGN_LEFT,
    });
    worksheet.getRow(4).height = DEFAULT_ROW_HEIGHT;

    // Double border for row 4 (A-I)
    for (let c = 1; c <= TOTAL_COLS; c++) {
      worksheet.getCell(4, c).border = BORDER_DOUBLE;
    }

    // Row 5: Order number + Date (not bold, date italic)
    worksheet.mergeCells("A5:B5");
    setCell(worksheet, "A5", `Số: ${purchase.code || ""}`, {
      font: font(12),
      align: ALIGN_CENTER,
    });

    worksheet.mergeCells("H5:I5");
    setCell(
      worksheet,
      "H5",
      `Ngày ${dayjs(purchase.orderedAt).format("DD")} tháng ${dayjs(purchase.orderedAt).format("MM")} năm ${dayjs(purchase.orderedAt).format("YYYY")}`,
      {
        font: { ...font(12), italic: true },
        align: ALIGN_RIGHT,
      },
    );
    worksheet.getRow(5).height = DEFAULT_ROW_HEIGHT;

    // Row 6: Title
    worksheet.mergeCells("A6:I6");
    setCell(worksheet, "A6", "ĐƠN ĐẶT HÀNG", {
      font: font(24, true),
      align: ALIGN_CENTER,
    });
    worksheet.getRow(6).height = 37;
  }

  // ── Row 7-9: Supplier ──
  private static buildSupplier(worksheet: ExcelJS.Worksheet, purchase: Purchase) {
    const supplier = resolveByPath(purchase, ["supplier"]) as any;
    const seller = resolveByPath(purchase, ["seller"]) as any;

    const supplierName = supplier?.name || "";
    const supplierAddress = supplier?.address ? getFullAddress(supplier.address) : "";
    const repName = seller?.name || "";
    const repPhone = seller?.phone || "";
    const repEmail = seller?.email || "";

    // Row 7: Tên nhà cung cấp
    worksheet.mergeCells("B7:B7");
    setCell(worksheet, "B7", "Tên nhà cung cấp", {
      font: font(12, true),
      align: ALIGN_LEFT,
    });
    worksheet.getCell("B7").font = { ...worksheet.getCell("B7").font, underline: true };

    setCell(worksheet, "C7", ":", { font: font(12, true), align: ALIGN_LEFT });

    worksheet.mergeCells("D7:I7");
    setCell(worksheet, "D7", supplierName.toUpperCase(), {
      font: font(12, true),
      align: ALIGN_LEFT,
    });
    worksheet.getRow(7).height = DEFAULT_ROW_HEIGHT;

    // Row 8: Địa chỉ
    setCell(worksheet, "B8", "Địa chỉ", { font: font(), align: ALIGN_LEFT });
    setCell(worksheet, "C8", ":", { font: font(), align: ALIGN_LEFT });
    worksheet.mergeCells("D8:I8");
    setCell(worksheet, "D8", supplierAddress, { font: font(), align: ALIGN_LEFT });
    worksheet.getRow(8).height = DEFAULT_ROW_HEIGHT;

    // Row 9: Đại diện (name | ĐT: phone | Email: email)
    setCell(worksheet, "B9", "Đại diện", { font: font(), align: ALIGN_LEFT });
    setCell(worksheet, "C9", ":", { font: font(), align: ALIGN_LEFT });
    worksheet.mergeCells("D9:E9");
    setCell(worksheet, "D9", repName, { font: font(), align: ALIGN_LEFT });
    worksheet.mergeCells("F9:G9");
    setCell(worksheet, "F9", `ĐT: ${repPhone}`, { font: font(), align: ALIGN_LEFT });
    worksheet.mergeCells("H9:I9");
    setCell(worksheet, "H9", `Email: ${repEmail}`, { font: font(), align: ALIGN_LEFT });
    worksheet.getRow(9).height = DEFAULT_ROW_HEIGHT;
  }

  // ── Row 10: Intro ──
  private static buildIntro(
    worksheet: ExcelJS.Worksheet,
    purchase: Purchase,
    currentCompany?: Organization | null,
  ) {
    worksheet.mergeCells("B10:I10");
    const company = currentCompany ?? purchase.company;
    setCell(
      worksheet,
      "B10",
      `${company?.name || ""} gửi đến quý công ty đơn đặt hàng với nội dung sau:`,
      {
        font: { ...font(12), italic: true },
        align: ALIGN_LEFT,
      },
    );
    worksheet.getRow(10).height = DEFAULT_ROW_HEIGHT;
  }

  // ── Row 11-12: Table header ──
  private static buildTableHeader(worksheet: ExcelJS.Worksheet): number {
    const headerRow = 11;
    const subRow = 12;

    const headerStyle = (
      cell: ExcelJS.Cell,
      value: string,
      isFirstCol: boolean = false,
      isLastCol: boolean = false,
    ) => {
      cell.value = value;
      cell.font = font(12, true);
      cell.alignment = ALIGN_CENTER;
      cell.border = {
        top: { style: "medium" },
        bottom: { style: "thin" },
        left: isFirstCol ? { style: "medium" } : { style: "thin" },
        right: isLastCol ? { style: "medium" } : { style: "thin" },
      };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2F2F2" } };
    };

    // Row 11: Tier 1 headers
    headerStyle(worksheet.getCell("A11"), "Stt", true);
    worksheet.mergeCells("A11:A12");
    headerStyle(worksheet.getCell("B11"), "Tên hàng và quy cách");
    worksheet.mergeCells("B11:B12");
    headerStyle(worksheet.getCell("C11"), "ĐVT");
    worksheet.mergeCells("C11:C12");
    headerStyle(worksheet.getCell("D11"), "Số lượng");
    worksheet.mergeCells("D11:D12");

    headerStyle(worksheet.getCell("E11"), "Đơn giá");
    headerStyle(worksheet.getCell("F11"), "Thành tiền");
    headerStyle(worksheet.getCell("G11"), "VAT");
    worksheet.mergeCells("G11:H11");
    headerStyle(worksheet.getCell("I11"), "Tổng tiền", false, true);

    // Row 12: Tier 2 (unit labels)
    const subStyle = (cell: ExcelJS.Cell, value: string, isLastCol: boolean = false) => {
      cell.value = value;
      cell.font = font(12, false);
      cell.alignment = ALIGN_CENTER;
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: isLastCol ? { style: "medium" } : { style: "thin" },
      };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2F2F2" } };
    };
    subStyle(worksheet.getCell("E12"), "Vnđ");
    subStyle(worksheet.getCell("F12"), "Vnđ");
    subStyle(worksheet.getCell("G12"), "%");
    subStyle(worksheet.getCell("H12"), "Vnđ");
    subStyle(worksheet.getCell("I12"), "Vnđ", true);

    worksheet.getRow(headerRow).height = 22.5;
    worksheet.getRow(subRow).height = 15.75;

    return subRow + 1; // data starts at row 13
  }

  // ── Body: 10 rows ──
  private static buildLines(
    worksheet: ExcelJS.Worksheet,
    purchase: Purchase,
    startRow: number,
  ): number {
    const lines = purchase.lines || [];

    for (let i = 0; i < MAX_LINES; i++) {
      const row = startRow + i;
      const line: PurchaseLine | undefined = lines[i];

      // STT
      setCell(worksheet, `A${row}`, line ? i + 1 : "", { font: font(), align: ALIGN_CENTER });

      if (line) {
        const productName = resolveByPath(line, ["product", "name"]) as string;
        const unitName = resolveByPath(line, ["unit", "name"]) as string;

        setCell(worksheet, `B${row}`, productName, { font: font(), align: ALIGN_LEFT });
        setCell(worksheet, `C${row}`, unitName, { font: font(), align: ALIGN_CENTER });
        setCell(worksheet, `D${row}`, line.quantity, {
          font: font(),
          align: ALIGN_RIGHT,
          numFmt: "#,##0",
        });
        setCell(worksheet, `E${row}`, line.unitPrice, {
          font: font(),
          align: ALIGN_RIGHT,
          numFmt: "#,##0",
        });
        setCell(worksheet, `F${row}`, line.subTotal, {
          font: font(),
          align: ALIGN_RIGHT,
          numFmt: "#,##0",
        });
        setCell(worksheet, `G${row}`, line.taxRate, {
          font: font(),
          align: ALIGN_CENTER,
          numFmt: '0"%"',
        });
        setCell(worksheet, `H${row}`, line.taxAmount, {
          font: font(),
          align: ALIGN_RIGHT,
          numFmt: "#,##0",
        });
        setCell(worksheet, `I${row}`, line.grossAmount, {
          font: font(),
          align: ALIGN_RIGHT,
          numFmt: "#,##0",
        });
      } else {
        // Empty row with dashed horizontal borders
        for (let c = 1; c <= TOTAL_COLS; c++) {
          setCell(worksheet, `${String.fromCharCode(64 + c)}${row}`, "", { font: font() });
        }
      }

      // Border: horizontal dashed (thưa), vertical solid, outer cols medium
      for (let c = 1; c <= TOTAL_COLS; c++) {
        const cell = worksheet.getCell(row, c);
        cell.border = {
          top: { style: "dashed" },
          bottom: { style: "dashed" },
          left: c === 1 ? { style: "medium" } : { style: "thin" },
          right: c === TOTAL_COLS ? { style: "medium" } : { style: "thin" },
        };
      }

      worksheet.getRow(row).height = 20;
    }

    return startRow + MAX_LINES - 1; // last data row
  }

  // ── Total row ──
  private static buildTotal(worksheet: ExcelJS.Worksheet, purchase: Purchase, row: number) {
    const lines = purchase.lines || [];
    const totalQty = lines.reduce((sum, l) => sum + (l.quantity || 0), 0);

    worksheet.mergeCells(`A${row}:C${row}`);
    setCell(worksheet, `A${row}`, "Tổng", { font: font(12, true), align: ALIGN_CENTER });

    setCell(worksheet, `D${row}`, totalQty, {
      font: font(12, true),
      align: ALIGN_RIGHT,
      numFmt: "#,##0",
    });
    setCell(worksheet, `E${row}`, "", { font: font(12, true), align: ALIGN_RIGHT });
    setCell(worksheet, `F${row}`, purchase.subTotal || 0, {
      font: font(12, true),
      align: ALIGN_RIGHT,
      numFmt: "#,##0",
    });
    setCell(worksheet, `G${row}`, "", { font: font(12, true), align: ALIGN_CENTER });
    setCell(worksheet, `H${row}`, purchase.taxAmount || 0, {
      font: font(12, true),
      align: ALIGN_RIGHT,
      numFmt: "#,##0",
    });
    setCell(worksheet, `I${row}`, purchase.totalAmount || 0, {
      font: font(12, true),
      align: ALIGN_RIGHT,
      numFmt: "#,##0",
    });

    // Summary border: thin inner, medium left+right
    // Set on each cell individually (before merge is applied)
    worksheet.getCell(`A${row}`).border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "medium" },
      right: { style: "thin" },
    };
    worksheet.getCell(`B${row}`).border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`C${row}`).border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    for (let c = 4; c < TOTAL_COLS; c++) {
      worksheet.getCell(row, c).border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    }
    worksheet.getCell(`I${row}`).border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "medium" },
    };

    worksheet.getRow(row).height = 20;
  }

  // ── Bằng chữ (last row of table, bottom medium border) ──
  private static buildAmountInWords(worksheet: ExcelJS.Worksheet, purchase: Purchase, row: number) {
    worksheet.mergeCells(`A${row}:I${row}`);
    setCell(
      worksheet,
      `A${row}`,
      `Bằng chữ: ${numberToVietnameseWords(purchase.totalAmount || 0)}`,
      {
        font: { ...font(12), italic: true },
        align: ALIGN_LEFT,
      },
    );

    // Table outer border: medium bottom, medium left/right, thin top
    worksheet.getCell(`A${row}`).border = {
      top: { style: "thin" },
      bottom: { style: "medium" },
      left: { style: "medium" },
      right: { style: "thin" },
    };
    for (let c = 2; c < TOTAL_COLS; c++) {
      worksheet.getCell(row, c).border = {
        top: { style: "thin" },
        bottom: { style: "medium" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    }
    worksheet.getCell(`I${row}`).border = {
      top: { style: "thin" },
      bottom: { style: "medium" },
      left: { style: "thin" },
      right: { style: "medium" },
    };

    worksheet.getRow(row).height = 22;
  }

  // ── Additional info footer ──
  private static buildAdditionalInfo(
    worksheet: ExcelJS.Worksheet,
    purchase: Purchase,
    startRow: number,
  ) {
    const infos = purchase.additionalInfo || [];
    if (!infos.length) return;

    for (let i = 0; i < infos.length; i++) {
      const row = startRow + i;
      const info = infos[i];
      const label = info.label || "";
      const value = info.value != null ? String(info.value) : "";

      if (label === "Lời nhắn") {
        worksheet.mergeCells(`A${row}:I${row}`);
        setCell(worksheet, `A${row}`, value, {
          font: { ...font(12), italic: true, bold: true },
          align: ALIGN_CENTER,
        });
        worksheet.getRow(row).height = 25;
      } else {
        setCell(worksheet, `A${row}`, i + 1, { font: font(12), align: ALIGN_CENTER });
        setCell(worksheet, `B${row}`, label, { font: font(12, true), align: ALIGN_LEFT });
        setCell(worksheet, `C${row}`, ":", { font: font(12, true), align: ALIGN_LEFT });
        worksheet.mergeCells(`D${row}:I${row}`);
        setCell(worksheet, `D${row}`, value, { font: font(), align: ALIGN_LEFT });
        worksheet.getRow(row).height = DEFAULT_ROW_HEIGHT;
      }
    }
  }

  // ── Footer signatures ──
  private static buildFooter(worksheet: ExcelJS.Worksheet, startRow: number) {
    const row = startRow > 0 ? startRow : 30;

    worksheet.mergeCells(`A${row}:D${row}`);
    setCell(worksheet, `A${row}`, "XÁC NHẬN CỦA KHÁCH HÀNG", {
      font: font(12, true),
      align: ALIGN_CENTER,
    });

    worksheet.getRow(row).height = 27.75;
  }
}
