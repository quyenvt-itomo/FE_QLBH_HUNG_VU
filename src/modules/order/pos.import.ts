import ExcelJS from "exceljs";

import { getProductsByCodes } from "@/modules/product/product.store";
import type { Product } from "@/modules/product/product.model";
import { collectUnits } from "@/modules/product/product.util";
import { randomId } from "@/shared/utils/common.util";
import type { CachedOrder, PosOrderType } from "@/shared/stores/orderCache.slice";
import type { PosLine } from "./components/OrderLineTable";
import { cellNumber, cellText, getProductPrice } from "./pos.utils";
import { OrderType } from "./order.model";

interface ImportRow {
  code: string;
  unitName: string;
  unitPrice: number;
  quantity: number;
}

export interface ImportPosLinesOptions {
  file: File;
  type: PosOrderType;
  activeOrder: CachedOrder;
  returnLines: PosLine[];
  exchangeLines: PosLine[];
  onReturnLines: (lines: PosLine[]) => void;
  onExchangeLines: (lines: PosLine[]) => void;
  onWarning: (message: string) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const getImportQuantity = (row: ExcelJS.Row) =>
  Math.max(0, cellNumber(row.getCell(5).value) || cellNumber(row.getCell(7).value)) || 1;

const createImportedLine = (product: Product, unit: any, quantity: number, unitPrice: number): PosLine => ({
  id: randomId(),
  productId: product.id,
  productSnapshot: { id: product.id, code: product.code, name: product.name },
  product,
  unitId: unit?.id || product.baseUnitId,
  unit: unit || null,
  unitSnapshot: unit ? { id: unit.id, name: unit.name } : null,
  conversionRateAtTime: 1,
  quantity,
  unitPrice,
  subTotal: quantity * unitPrice,
});

export const importPosLines = async ({
  file,
  type,
  activeOrder,
  returnLines,
  exchangeLines,
  onReturnLines,
  onExchangeLines,
  onWarning,
  onSuccess,
  onError,
}: ImportPosLinesOptions) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load((await file.arrayBuffer()) as any);
    const sheet = workbook.worksheets[0];
    if (!sheet) {
      onWarning("File Excel không có trang dữ liệu");
      return;
    }

    const rows: ImportRow[] = [];
    sheet.eachRow((row, index) => {
      const code = cellText(row.getCell(1).value);
      if (index > 1 && code) {
        rows.push({
          code,
          unitName: cellText(row.getCell(3).value).toLowerCase(),
          unitPrice: cellNumber(row.getCell(4).value),
          quantity: getImportQuantity(row),
        });
      }
    });

    if (!rows.length) {
      onWarning("File Excel chưa có dòng hàng hóa hợp lệ");
      return;
    }

    const products = await getProductsByCodes([...new Set(rows.map((row) => row.code))]);
    const productMap = new Map(
      products.map((product) => [product.code.trim().toLowerCase(), product]),
    );
    const missingCodes: string[] = [];
    const exceededCodes: string[] = [];
    let importedCount = 0;

    if (type === OrderType.SALE_RETURN) {
      const nextLines = [...returnLines];
      rows.forEach((row) => {
        const product = productMap.get(row.code.toLowerCase());
        if (!product) {
          missingCodes.push(row.code);
          return;
        }

        const sourceLine = nextLines.find((line) => line.productId === product.id);
        if (activeOrder.refOrderId && !sourceLine) {
          missingCodes.push(row.code);
          return;
        }

        const unit =
          sourceLine?.unit ||
          collectUnits(product, product.baseUnit).find(
            (item) => item.name.toLowerCase() === row.unitName,
          ) ||
          product.baseUnit;
        const lineIndex = sourceLine ? nextLines.indexOf(sourceLine) : -1;
        const currentQuantity = Number(sourceLine?.quantity || 0);
        const maxQuantity = Number(sourceLine?.maxReturnQuantity ?? Number.POSITIVE_INFINITY);
        const quantity = Math.min(row.quantity, Math.max(0, maxQuantity - currentQuantity));
        if (quantity <= 0) {
          exceededCodes.push(row.code);
          return;
        }

        if (lineIndex >= 0) {
          const line = nextLines[lineIndex];
          const unitPrice = row.unitPrice || Number(line.unitPrice || getProductPrice(product));
          nextLines[lineIndex] = {
            ...line,
            quantity: currentQuantity + quantity,
            unitPrice,
            unit: unit || line.unit,
            unitId: unit?.id || line.unitId,
            subTotal: (currentQuantity + quantity) * unitPrice,
          };
        } else {
          const unitPrice = row.unitPrice || getProductPrice(product);
          nextLines.unshift(createImportedLine(product, unit, quantity, unitPrice));
        }
        importedCount += 1;
      });
      onReturnLines(nextLines);
    } else {
      const nextLines = [...exchangeLines];
      rows.forEach((row) => {
        const product = productMap.get(row.code.toLowerCase());
        if (!product) {
          missingCodes.push(row.code);
          return;
        }
        const unit =
          collectUnits(product, product.baseUnit).find(
            (item) => item.name.toLowerCase() === row.unitName,
          ) || product.baseUnit;
        const lineIndex = nextLines.findIndex(
          (line) => line.productId === product.id && line.unitId === unit?.id,
        );
        if (lineIndex >= 0) {
          const line = nextLines[lineIndex];
          const unitPrice = row.unitPrice || Number(line.unitPrice || getProductPrice(product));
          const quantity = Number(line.quantity || 0) + row.quantity;
          nextLines[lineIndex] = {
            ...line,
            quantity,
            unitPrice,
            subTotal: quantity * unitPrice,
          };
        } else {
          const unitPrice = row.unitPrice || getProductPrice(product);
          nextLines.unshift(createImportedLine(product, unit, row.quantity, unitPrice));
        }
        importedCount += 1;
      });
      onExchangeLines(nextLines);
    }

    if (missingCodes.length || exceededCodes.length) {
      const details = [
        missingCodes.length ? `Không tìm thấy/không thuộc đơn: ${missingCodes.join(", ")}` : "",
        exceededCodes.length ? `Đã vượt số lượng có thể hoàn: ${exceededCodes.join(", ")}` : "",
      ].filter(Boolean);
      onWarning(`${details.join(". ")}. Đã thêm ${importedCount} dòng.`);
    } else {
      onSuccess(`Đã thêm ${importedCount} dòng hàng hóa từ Excel`);
    }
  } catch {
    onError("Không thể đọc file Excel. Vui lòng dùng đúng biểu mẫu hàng hóa.");
  }
};
