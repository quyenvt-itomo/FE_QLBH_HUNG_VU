import ExcelJS from "exceljs";

// ── Border styles ──

export const BORDER_THIN: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

export const BORDER_DOUBLE: Partial<ExcelJS.Borders> = {
  bottom: { style: "double" },
};

// ── Alignment ──

export const ALIGN_CENTER: Partial<ExcelJS.Alignment> = {
  vertical: "middle",
  horizontal: "center",
  wrapText: true,
};

export const ALIGN_LEFT: Partial<ExcelJS.Alignment> = {
  vertical: "middle",
  horizontal: "left",
  wrapText: true,
};

export const ALIGN_RIGHT: Partial<ExcelJS.Alignment> = {
  vertical: "middle",
  horizontal: "right",
  wrapText: true,
};

// ── Unicode → TCVN3 converter (for .VnUniverseH font) ──

const UNICODE_TO_TCVN3: Record<string, string> = {
  À: "µ",
  Á: "¸",
  Â: "¢",
  Ã: "·",
  È: "×",
  É: "Ð",
  Ê: "£",
  Ì: "×",
  Í: "ý",
  Ò: "ß",
  Ó: "·",
  Ô: "¤",
  Õ: "©",
  Ù: "ï",
  Ú: "ã",
  Ý: "ý",
  à: "µ",
  á: "¸",
  â: "©",
  ã: "·",
  è: "Ì",
  é: "Ð",
  ê: "ª",
  ì: "×",
  í: "Ý",
  ò: "ß",
  ó: "ã",
  ô: "«",
  õ: "â",
  ù: "ï",
  ú: "ó",
  ý: "ý",
  Ă: "¡",
  ă: "¨",
  Đ: "§",
  đ: "®",
  Ĩ: "Ü",
  ĩ: "Ü",
  Ũ: "ò",
  ũ: "ò",
  Ơ: "¥",
  ơ: "¬",
  Ư: "¦",
  ư: "­",
  Ạ: "¹",
  ạ: "¹",
  Ả: "¶",
  ả: "¶",
  Ấ: "Ê",
  ấ: "Ê",
  Ầ: "Ç",
  ầ: "Ç",
  Ẩ: "È",
  ẩ: "È",
  Ẫ: "É",
  ẫ: "É",
  Ậ: "Ë",
  ậ: "Ë",
  Ắ: "¾",
  ắ: "¾",
  Ằ: "»",
  ằ: "»",
  Ẳ: "¼",
  ẳ: "¼",
  Ẵ: "½",
  ẵ: "½",
  Ặ: "Æ",
  ặ: "Æ",
  Ẹ: "Ñ",
  ẹ: "Ñ",
  Ẻ: "Î",
  ẻ: "Î",
  Ẽ: "Ï",
  ẽ: "Ï",
  Ế: "Õ",
  ế: "Õ",
  Ề: "Ò",
  ề: "Ò",
  Ể: "Ó",
  ể: "Ó",
  Ễ: "Ô",
  ễ: "Ô",
  Ệ: "Ö",
  ệ: "Ö",
  Ỉ: "Ø",
  ỉ: "Ø",
  Ị: "Þ",
  ị: "Þ",
  Ọ: "ä",
  ọ: "ä",
  Ỏ: "á",
  ỏ: "á",
  Ố: "è",
  ố: "è",
  Ồ: "å",
  ồ: "å",
  Ổ: "æ",
  ổ: "æ",
  Ỗ: "ç",
  ỗ: "ç",
  Ộ: "é",
  ộ: "é",
  Ớ: "í",
  ớ: "í",
  Ờ: "ê",
  ờ: "ê",
  Ở: "ë",
  ở: "ë",
  Ỡ: "ì",
  ỡ: "ì",
  Ợ: "î",
  ợ: "î",
  Ụ: "ô",
  ụ: "ô",
  Ủ: "ñ",
  ủ: "ñ",
  Ứ: "ø",
  ứ: "ø",
  Ừ: "õ",
  ừ: "õ",
  Ử: "ö",
  ử: "ö",
  Ữ: "÷",
  ữ: "÷",
  Ự: "ù",
  ự: "ù",
  Ỳ: "ú",
  ỳ: "ú",
  Ỵ: "þ",
  ỵ: "þ",
  Ỷ: "û",
  ỷ: "û",
  Ỹ: "ü",
  ỹ: "ü",
};

export function unicodeToTCVN3(value: string): string {
  return Array.from(value)
    .map((char) => UNICODE_TO_TCVN3[char] ?? char)
    .join("");
}

// ── Font helper ──

export function excelFont(
  size: number = 12,
  bold: boolean = false,
  name: string = "Times New Roman",
): Partial<ExcelJS.Font> {
  return { name, size, bold };
}

// ── Cell setter helper ──

export function setCell(
  ws: ExcelJS.Worksheet,
  cellRef: string,
  value: any,
  opts?: {
    font?: Partial<ExcelJS.Font>;
    align?: Partial<ExcelJS.Alignment>;
    border?: Partial<ExcelJS.Borders>;
    numFmt?: string;
    fill?: ExcelJS.Fill;
  },
) {
  const cell = ws.getCell(cellRef);
  cell.value = value;
  if (opts?.font) cell.font = opts.font;
  if (opts?.align) cell.alignment = opts.align;
  if (opts?.border) cell.border = opts.border;
  if (opts?.numFmt) cell.numFmt = opts.numFmt;
  if (opts?.fill) cell.fill = opts.fill;
}

// ── Image utilities ──

export async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const blob = await resp.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string)?.split(",")[1] || null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Thêm ảnh vào worksheet, căn giữa theo chiều ngang và sát đáy theo chiều dọc
 * trong vùng merged cells được chỉ định.
 *
 * Các tham số dùng 0-indexed (0 = Cột A, 0 = Hàng 1).
 */
export function addImageBottomCenter(
  worksheet: ExcelJS.Worksheet,
  imageId: number,
  {
    startCol,
    endCol,
    startRow,
    endRow,
    width,
    height,
  }: {
    startCol: number;
    endCol: number;
    startRow: number;
    endRow: number;
    width: number;
    height: number;
  },
) {
  // Quy đổi width/height tiêu chuẩn của Excel sang Pixel
  const getColWidthPx = (colIndex: number) => {
    const colWidth = worksheet.getColumn(colIndex + 1).width ?? 8.43;
    return Math.floor(colWidth * 7 + 5);
  };

  const getRowHeightPx = (rowIndex: number) => {
    const rowHeight = worksheet.getRow(rowIndex + 1).height ?? 15;
    return Math.floor(rowHeight * (96 / 72));
  };

  // 1. Tính tổng chiều rộng & chiều cao vùng chứa
  let areaWidth = 0;
  for (let col = startCol; col <= endCol; col++) {
    areaWidth += getColWidthPx(col);
  }

  let areaHeight = 0;
  for (let row = startRow; row <= endRow; row++) {
    areaHeight += getRowHeightPx(row);
  }

  // 2. Tính Tọa độ Căn giữa ngang (offsetX) & Sát đáy (offsetY)
  const targetOffsetX = Math.max(0, (areaWidth - width) / 2);
  const targetOffsetY = Math.max(0, areaHeight - height);

  // 3. Quy đổi targetOffsetX thành (Column Index + Tỷ lệ % của cột đó)
  let accumulatedWidth = 0;
  let finalCol = startCol;
  let colOffsetFraction = 0;

  for (let col = startCol; col <= endCol; col++) {
    const colPx = getColWidthPx(col);
    if (accumulatedWidth + colPx > targetOffsetX) {
      finalCol = col;
      colOffsetFraction = (targetOffsetX - accumulatedWidth) / colPx;
      break;
    }
    accumulatedWidth += colPx;
  }

  // 4. Quy đổi targetOffsetY thành (Row Index + Tỷ lệ % của dòng đó)
  let accumulatedHeight = 0;
  let finalRow = startRow;
  let rowOffsetFraction = 0;

  for (let row = startRow; row <= endRow; row++) {
    const rowPx = getRowHeightPx(row);
    if (accumulatedHeight + rowPx > targetOffsetY) {
      finalRow = row;
      rowOffsetFraction = (targetOffsetY - accumulatedHeight) / rowPx;
      break;
    }
    accumulatedHeight += rowPx;
  }

  // 5. Thêm ảnh vào Worksheet
  worksheet.addImage(imageId, {
    tl: {
      col: finalCol + colOffsetFraction,
      row: finalRow + rowOffsetFraction,
    },
    ext: {
      width,
      height,
    },
  });
}
