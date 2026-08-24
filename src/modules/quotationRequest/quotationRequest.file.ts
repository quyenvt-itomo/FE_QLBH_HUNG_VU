import ExcelJS from "exceljs";
import dayjs from "dayjs";
import { QuotationRequest } from "./quotationRequest.model";
import { getFullAddress, resolveByPath } from "@/shared/utils/common.util";
import { buildFileUrl } from "@/shared/utils/url.util";
import { Organization } from "../organization";
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

const FONT = "Times New Roman";
const SIZE = 12;
const TOTAL_COLS = 7; // A -> G
const PAD = 0.71;

export class QuotationRequestFile {
  static async exportExcel(quotationRequest: QuotationRequest, currentStore?: Organization | null) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Đề nghị báo giá", {
      pageSetup: {
        paperSize: 9,
        orientation: "portrait",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      },
    });

    worksheet.properties.defaultRowHeight = 21;

    worksheet.getColumn("A").width = 4 + PAD;
    worksheet.getColumn("B").width = 25 + PAD;
    worksheet.getColumn("C").width = 8 + PAD;
    worksheet.getColumn("D").width = 12 + PAD;
    worksheet.getColumn("E").width = 12 + PAD;
    worksheet.getColumn("F").width = 12 + PAD;
    worksheet.getColumn("G").width = 14 + PAD;

    await this.buildHeader(worksheet, quotationRequest, workbook, currentStore);
    this.buildCustomerInfo(worksheet, quotationRequest);
    this.buildTableHeader(worksheet);
    const bodyEndRow = this.buildLines(worksheet, quotationRequest, 8);
    this.buildFooter(worksheet, bodyEndRow + 2);

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
    a.download = `Yeu-cau-bao-gia-${quotationRequest.code}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private static async buildHeader(
    worksheet: ExcelJS.Worksheet,
    quotationRequest: QuotationRequest,
    workbook: ExcelJS.Workbook,
    currentStore?: Organization | null,
  ) {
    const company = currentStore;

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
            const imgId = workbook.addImage({ base64: imgBase64, extension: "png" });
            worksheet.addImage(imgId, {
              tl: { col: 1.99, row: 0.25 },
              ext: { width: 90, height: 75 },
            });
          }
        } catch {}
      }
    }

    worksheet.mergeCells("C1:G1");
    setCell(worksheet, "C1", unicodeToTCVN3((company?.name || "").toUpperCase()), {
      font: font(15, true, ".VnUniverseH"),
      align: ALIGN_LEFT,
    });

    worksheet.mergeCells("C2:G2");
    setCell(worksheet, "C2", `Địa chỉ: ${getFullAddress(company?.address)}`, {
      font: font(),
      align: ALIGN_LEFT,
    });

    worksheet.mergeCells("C3:G3");
    setCell(worksheet, "C3", `Điện thoại: ${company?.phone || ""}`, {
      font: font(),
      align: ALIGN_LEFT,
    });

    worksheet.mergeCells("A4:B4");
    setCell(worksheet, "A4", "ISO 9001:2015", {
      font: font(12, true, ".VnTime"),
      align: ALIGN_CENTER,
    });

    worksheet.mergeCells("C4:G4");
    setCell(worksheet, "C4", `MST: ${company?.taxCode || ""}`, {
      font: font(),
      align: ALIGN_LEFT,
    });
    worksheet.getRow(4).height = 21;

    for (let c = 1; c <= TOTAL_COLS; c++) {
      worksheet.getCell(4, c).border = BORDER_DOUBLE;
    }

    worksheet.mergeCells("A5:B5");
    setCell(worksheet, "A5", `Số: ${quotationRequest.code || ""}`, {
      font: font(12),
      align: ALIGN_CENTER,
    });

    worksheet.mergeCells("F5:G5");
    setCell(
      worksheet,
      "F5",
      `Ngày ${dayjs(quotationRequest.timeAt).format("DD")} tháng ${dayjs(quotationRequest.timeAt).format("MM")} năm ${dayjs(quotationRequest.timeAt).format("YYYY")}`,
      { font: { ...font(12), italic: true }, align: ALIGN_RIGHT },
    );
    worksheet.getRow(5).height = 21;

    worksheet.mergeCells("A6:G6");
    setCell(worksheet, "A6", "YÊU CẦU BÁO GIÁ", {
      font: font(20, true),
      align: ALIGN_CENTER,
    });
    worksheet.getRow(6).height = 32;
  }

  private static buildCustomerInfo(
    worksheet: ExcelJS.Worksheet,
    quotationRequest: QuotationRequest,
  ) {
    const customer = quotationRequest.customer;
    const customerName = customer?.name || "";
    const customerAddress = customer?.address ? getFullAddress(customer.address as any) : "";
    const customerPhone = customer?.phone || "";
    const customerEmail = (customer as any)?.email || "";

    worksheet.mergeCells("B7:B7");
    setCell(worksheet, "B7", "Khách hàng", { font: font(12, true), align: ALIGN_LEFT });
    worksheet.getCell("B7").font = { ...worksheet.getCell("B7").font, underline: true };

    setCell(worksheet, "C7", ":", { font: font(12, true), align: ALIGN_LEFT });
    worksheet.mergeCells("D7:G7");
    setCell(worksheet, "D7", customerName.toUpperCase(), {
      font: font(12, true),
      align: ALIGN_LEFT,
    });
    worksheet.getRow(7).height = 21;
  }

  private static buildTableHeader(worksheet: ExcelJS.Worksheet) {
    const headers = ["Stt", "Tên hàng", "ĐVT", "Số lượng", "Ghi chú"];
    for (let i = 0; i < headers.length; i++) {
      const col = String.fromCharCode(65 + i);
      const cell = worksheet.getCell(`${col}8`);
      cell.value = headers[i];
      cell.font = font(12, true);
      cell.alignment = ALIGN_CENTER;
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2F2F2" } };
      cell.border = {
        top: { style: "medium" },
        bottom: { style: "thin" },
        left: i === 0 ? { style: "medium" } : { style: "thin" },
        right: i === headers.length - 1 ? { style: "medium" } : { style: "thin" },
      };
    }
    // Merge remaining cols (E8:G8) for "Ghi chú"
    worksheet.mergeCells("E8:G8");
    worksheet.getRow(8).height = 22;
  }

  private static buildLines(
    worksheet: ExcelJS.Worksheet,
    quotationRequest: QuotationRequest,
    startRow: number,
  ): number {
    const lines = quotationRequest.lines || [];
    const MAX_LINES = 15;

    for (let i = 0; i < MAX_LINES; i++) {
      const row = startRow + i;
      const line = lines[i];

      setCell(worksheet, `A${row}`, line ? i + 1 : "", { font: font(), align: ALIGN_CENTER });

      if (line) {
        const productName = resolveByPath(line, ["product", "name"]) || "";
        const unitName = resolveByPath(line, ["unit", "name"]) || "";

        setCell(worksheet, `B${row}`, productName, { font: font(), align: ALIGN_LEFT });
        setCell(worksheet, `C${row}`, unitName, { font: font(), align: ALIGN_CENTER });
        setCell(worksheet, `D${row}`, line.quantity, {
          font: font(),
          align: ALIGN_RIGHT,
          numFmt: "#,##0",
        });
        setCell(worksheet, `E${row}`, line.note || "", { font: font(), align: ALIGN_LEFT });
        worksheet.mergeCells(`E${row}:G${row}`);
      }

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

    return startRow + MAX_LINES - 1;
  }

  private static buildFooter(worksheet: ExcelJS.Worksheet, startRow: number) {
    worksheet.mergeCells(`A${startRow}:D${startRow}`);
    setCell(worksheet, `A${startRow}`, "XÁC NHẬN CỦA KHÁCH HÀNG", {
      font: font(12, true),
      align: ALIGN_CENTER,
    });
    worksheet.getRow(startRow).height = 27.75;
  }
}
