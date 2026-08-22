import ExcelJS from "exceljs";
import {
  DiscountTypeEnum,
  InventoryTransactionTypeEnum,
  OrderLineTypeEnum,
} from "../constants/enum";
import { IOrder } from "../models/store/order";
import { IStoreTransfer } from "../models/storeTransfer";
import { getFullVariantOptionContent } from "./common";
import { formatDateTimeDDMMYYYY } from "./dateUtils";
import dayjs from "dayjs";
import { formatMoney, formatPercentage } from "./formatNumber";
import { IInventoryAdjustment } from "../models/store/inventoryAdjustment";

export const exportStoreTransferToExcel = async (data: IStoreTransfer) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Phiếu chuyển kho");

  // thiết lập font mặc định
  worksheet.properties.defaultRowHeight = 20;

  // 2. Title
  worksheet.mergeCells("A1:G2");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "PHIẾU CHUYỂN KHO";
  titleCell.font = { name: "Arial", size: 18, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  // 3. Thông tin phiếu
  // Dòng 4: Số phiếu và Ngày lập
  worksheet.mergeCells("A4:B4");
  worksheet.getCell("A4").value = "Số phiếu:";
  worksheet.mergeCells("C4:D4");
  worksheet.getCell("C4").value = data.code;

  worksheet.getCell("E4").value = "Ngày:";
  worksheet.mergeCells("F4:G4");
  worksheet.getCell("F4").value = formatDateTimeDDMMYYYY(data.occurredAt);

  // Dòng 5: Kho xuất và Kho nhập
  worksheet.mergeCells("A5:B5");
  worksheet.getCell("A5").value = "Kho xuất:";
  worksheet.mergeCells("C5:D5");
  worksheet.getCell("C5").value = data.fromStore?.name || "";

  worksheet.getCell("E5").value = "Kho nhập:";
  worksheet.mergeCells("F5:G5");
  worksheet.getCell("F5").value = data.toStore?.name || "";

  // Dòng 6: Lý do (C-G)
  worksheet.mergeCells("A6:B6");
  worksheet.getCell("A6").value = "Lý do:";
  worksheet.mergeCells("C6:G6");
  worksheet.getCell("C6").value = data.reason || "";

  // Dòng 7: Ghi chú (C-G)
  worksheet.mergeCells("A7:B7");
  worksheet.getCell("A7").value = "Ghi chú:";
  worksheet.mergeCells("C7:G7");
  worksheet.getCell("C7").value = data.note || "";

  // format font cho label
  ["A4", "E4", "A5", "E5", "A6", "A7"].forEach((cell) => {
    worksheet.getCell(cell).font = { bold: true };
    worksheet.getCell(cell).alignment = { horizontal: "left" };
  });

  // 4. Table Header (bắt đầu từ dòng 9)
  const headerRow = worksheet.getRow(9);
  headerRow.values = [
    "STT",
    "Mã hàng hóa",
    "Tên hàng hóa",
    "ĐVT",
    "Số lượng",
    "Giá bán",
    "Ghi chú",
  ];
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // 5. Table Body
  data.lines?.forEach((line, index) => {
    const row = worksheet.addRow([
      index + 1,
      line.productVariant?.barcode || line.productVariant?.product?.code || "",
      line.productVariantSnapshot?.product?.name || line.productVariant?.product?.name || "",
      line.productVariant?.product?.unit?.name || "",
      line.quantity,
      line.productVariant?.price || 0,
      line.note || "",
    ]);

    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      if (colNumber === 1 || colNumber === 4) {
        cell.alignment = { horizontal: "center" };
      }
      if (colNumber === 5 || colNumber === 6) {
        cell.alignment = { horizontal: "right" };
        cell.numFmt = "#,##0";
      }
    });
  });

  // 6. Dòng tổng cộng
  const totalRowNumber = worksheet.rowCount + 1;
  worksheet.mergeCells(`A${totalRowNumber}:D${totalRowNumber}`);
  const totalLabelCell = worksheet.getCell(`A${totalRowNumber}`);
  totalLabelCell.value = "TỔNG CỘNG";
  totalLabelCell.font = { bold: true };
  totalLabelCell.alignment = { horizontal: "center", vertical: "middle" };

  const totalQtyCell = worksheet.getCell(`E${totalRowNumber}`);
  const totalQuantity = data.lines?.reduce((sum, line) => sum + (line.quantity || 0), 0) || 0;
  totalQtyCell.value = totalQuantity;
  totalQtyCell.font = { bold: true };
  totalQtyCell.alignment = { horizontal: "right", vertical: "middle" };
  totalQtyCell.numFmt = "#,##0";

  // Thêm border cho dòng tổng cộng
  [
    `A${totalRowNumber}`,
    `B${totalRowNumber}`,
    `C${totalRowNumber}`,
    `D${totalRowNumber}`,
    `E${totalRowNumber}`,
    `F${totalRowNumber}`,
    `G${totalRowNumber}`,
  ].forEach((cellAddr) => {
    worksheet.getCell(cellAddr).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // 7. Footer - Chữ ký (3 phần)
  const lastRow = worksheet.rowCount + 2;

  // Kho xuất
  worksheet.mergeCells(`A${lastRow}:B${lastRow}`);
  worksheet.getCell(`A${lastRow}`).value = "Kho xuất";
  worksheet.getCell(`A${lastRow}`).alignment = { horizontal: "center" };
  worksheet.getCell(`A${lastRow}`).font = { bold: true };
  worksheet.getCell(`A${lastRow + 1}`).value = "(Ký, ghi rõ họ tên)";
  worksheet.mergeCells(`A${lastRow + 1}:B${lastRow + 1}`);
  worksheet.getCell(`A${lastRow + 1}`).alignment = { horizontal: "center" };
  worksheet.getCell(`A${lastRow + 1}`).font = { italic: true, size: 9 };

  // Kho nhận
  worksheet.mergeCells(`C${lastRow}:D${lastRow}`);
  worksheet.getCell(`C${lastRow}`).value = "Kho nhận";
  worksheet.getCell(`C${lastRow}`).alignment = { horizontal: "center" };
  worksheet.getCell(`C${lastRow}`).font = { bold: true };
  worksheet.getCell(`C${lastRow + 1}`).value = "(Ký, ghi rõ họ tên)";
  worksheet.mergeCells(`C${lastRow + 1}:D${lastRow + 1}`);
  worksheet.getCell(`C${lastRow + 1}`).alignment = { horizontal: "center" };
  worksheet.getCell(`C${lastRow + 1}`).font = { italic: true, size: 9 };

  // Người lập phiếu
  worksheet.mergeCells(`E${lastRow}:F${lastRow}`);
  worksheet.getCell(`E${lastRow}`).value = "Người lập phiếu";
  worksheet.getCell(`E${lastRow}`).alignment = { horizontal: "center" };
  worksheet.getCell(`E${lastRow}`).font = { bold: true };
  worksheet.getCell(`E${lastRow + 1}`).value = "(Ký, ghi rõ họ tên)";
  worksheet.mergeCells(`E${lastRow + 1}:F${lastRow + 1}`);
  worksheet.getCell(`E${lastRow + 1}`).alignment = { horizontal: "center" };
  worksheet.getCell(`E${lastRow + 1}`).font = { italic: true, size: 9 };

  // thiết lập độ rộng cột
  worksheet.getColumn(1).width = 8; // STT
  worksheet.getColumn(2).width = 15; // Mã
  worksheet.getColumn(3).width = 30; // Tên
  worksheet.getColumn(4).width = 15; // ĐVT
  worksheet.getColumn(5).width = 15; // SL
  worksheet.getColumn(6).width = 15; // Giá bán
  worksheet.getColumn(7).width = 25; // Ghi chú

  // 7. Xuất file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Phieu_chuyen_kho_${data.code}_${dayjs().format("DDMMYYYY")}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const exportPurchaseOrderToExcel = async (data: IOrder) => {
  const {
    code,
    orderAt,
    partner,
    employee,
    discountType,
    discountValue,
    note,
    shippingFee,
    isFreeShipping,
    grossAmount = 0,
    lineDiscountAmount = 0,
    lines = [],
  } = data;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Đơn mua hàng");

  worksheet.properties.defaultRowHeight = 20;

  worksheet.mergeCells("A1:I2");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "PHIẾU NHẬP HÀNG";
  titleCell.font = { name: "Arial", size: 18, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("A4:B4");
  worksheet.getCell("A4").value = "Số phiếu:";
  worksheet.mergeCells("C4:D4");
  worksheet.getCell("C4").value = code || "";

  worksheet.mergeCells("E4:F4");
  worksheet.getCell("E4").value = "Ngày:";
  worksheet.mergeCells("G4:I4");
  worksheet.getCell("G4").value = formatDateTimeDDMMYYYY(orderAt);

  worksheet.mergeCells("A5:B5");
  worksheet.getCell("A5").value = "Nhà cung cấp:";
  worksheet.mergeCells("C5:D5");
  worksheet.getCell("C5").value = partner?.name || "";

  worksheet.mergeCells("E5:F5");
  worksheet.getCell("E5").value = "Giảm giá đơn hàng:";
  worksheet.mergeCells("G5:I5");
  worksheet.getCell("G5").value = discountValue
    ? discountType === DiscountTypeEnum.AMOUNT
      ? formatMoney(discountValue)
      : formatPercentage(discountValue)
    : "";

  worksheet.mergeCells("A6:B6");
  worksheet.getCell("A6").value = "Số điện thoại:";
  worksheet.mergeCells("C6:D6");
  worksheet.getCell("C6").value = partner?.phone || "";

  worksheet.mergeCells("E6:F6");
  worksheet.getCell("E6").value = "Nhân viên thực hiện:";
  worksheet.mergeCells("G6:I6");
  worksheet.getCell("G6").value = employee?.name || "";

  worksheet.mergeCells("A7:B7");
  worksheet.getCell("A7").value = "Ghi chú:";
  worksheet.mergeCells("C7:I7");
  worksheet.getCell("C7").value = note || "";

  ["A4", "E4", "A5", "E5", "A6", "E6", "A7", "E7"].forEach((cell) => {
    worksheet.getCell(cell).font = { bold: true };
    worksheet.getCell(cell).alignment = { horizontal: "left" };
  });

  const headerRow = worksheet.getRow(9);
  headerRow.values = [
    "STT",
    "Mã hàng",
    "Tên hàng",
    "ĐVT",
    "Số lượng",
    "Đơn giá",
    "Giảm giá/SP",
    "Thành tiền",
    "%VAT",
  ];
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  const normalLines = lines?.filter((line) => line.lineType === OrderLineTypeEnum.NORMAL) || [];

  const fee = {
    totalMoney: 0,
    totalProductDiscount: 0,
    totalOrderDiscount: 0,
    totalTaxableAmount: 0,
    totalVat: 0,
    totalAmount: 0,
  };

  const tempItems: { baseAmount: number; vatRate: number }[] = [];

  normalLines.forEach((line) => {
    const quantity = line.quantity || 0;
    const price = line.unitPrice || 0;
    const vatRate = line.taxRate || 0;
    const discountPerUnit =
      line.discountType === DiscountTypeEnum.PERCENT
        ? (price * (line.discountValue || 0)) / 100
        : line.discountValue || 0;

    const money = quantity * price;
    const productDiscount = quantity * discountPerUnit;
    const baseAmount = money - productDiscount;

    fee.totalMoney += money;
    fee.totalProductDiscount += productDiscount;

    tempItems.push({
      baseAmount,
      vatRate,
    });
  });

  const totalBaseAmount = tempItems.reduce((sum, item) => sum + item.baseAmount, 0);
  const orderDiscountAmount = discountValue
    ? discountType === DiscountTypeEnum.PERCENT
      ? (totalBaseAmount * discountValue) / 100
      : discountValue
    : 0;

  fee.totalOrderDiscount = Math.min(orderDiscountAmount, totalBaseAmount);

  if (totalBaseAmount > 0) {
    let allocatedSum = 0;

    tempItems.forEach((item, index) => {
      let allocatedDiscount = 0;

      if (index === tempItems.length - 1) {
        allocatedDiscount = fee.totalOrderDiscount - allocatedSum;
      } else {
        allocatedDiscount = Math.round(
          (item.baseAmount / totalBaseAmount) * fee.totalOrderDiscount,
        );
        allocatedSum += allocatedDiscount;
      }

      const taxableAmount = item.baseAmount - allocatedDiscount;
      const vatAmount = (taxableAmount * item.vatRate) / 100;

      fee.totalTaxableAmount += taxableAmount;
      fee.totalVat += vatAmount;
    });
  }

  fee.totalAmount = fee.totalTaxableAmount + fee.totalVat + (isFreeShipping ? 0 : shippingFee || 0);

  normalLines.forEach((line, index) => {
    const productName = line.productVariantSnapshot?.product?.name || "";
    const variantOption = getFullVariantOptionContent(line.productVariantSnapshot);
    const fullName = variantOption ? `${productName} (${variantOption})` : productName;

    const row = worksheet.addRow([
      index + 1,
      line.productVariantSnapshot?.barcode || line.productVariantSnapshot?.product?.code || "",
      fullName,
      line.productVariantSnapshot?.product?.unit?.name || "",
      line.quantity || 0,
      line.unitPrice || 0,
      line.discountAmount || 0,
      line.subTotal - (line.discountAmount || 0),
      line.taxRate || 0,
    ]);

    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      if (colNumber === 1 || colNumber === 4 || colNumber === 5) {
        cell.alignment = { horizontal: "center" };
      }

      if ([6, 7, 8].includes(colNumber)) {
        cell.alignment = { horizontal: "right" };
        cell.numFmt = "#,##0";
      }

      if (colNumber === 9) {
        cell.alignment = { horizontal: "right" };
        cell.numFmt = "0";
      }
    });
  });

  const totalGoodsAfterLineDiscount = normalLines.reduce(
    (sum, line) => sum + (line.subTotal - (line.discountAmount || 0)),
    0,
  );

  const totalRowNumber = worksheet.rowCount + 1;
  worksheet.mergeCells(`A${totalRowNumber}:G${totalRowNumber}`);
  const totalLabelCell = worksheet.getCell(`A${totalRowNumber}`);
  totalLabelCell.value = "TỔNG TIỀN HÀNG SAU GIẢM";
  totalLabelCell.font = { bold: true };
  totalLabelCell.alignment = { horizontal: "center", vertical: "middle" };

  const totalAmountCell = worksheet.getCell(`H${totalRowNumber}`);
  totalAmountCell.value = totalGoodsAfterLineDiscount;
  totalAmountCell.font = { bold: true };
  totalAmountCell.alignment = { horizontal: "right", vertical: "middle" };
  totalAmountCell.numFmt = "#,##0";

  [
    `A${totalRowNumber}`,
    `B${totalRowNumber}`,
    `C${totalRowNumber}`,
    `D${totalRowNumber}`,
    `E${totalRowNumber}`,
    `F${totalRowNumber}`,
    `G${totalRowNumber}`,
    `H${totalRowNumber}`,
    `I${totalRowNumber}`,
  ].forEach((cellAddr) => {
    worksheet.getCell(cellAddr).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  const summaryStartRow = worksheet.rowCount + 2;
  const summaryItems: Array<{ label: string; value: number; bold?: boolean }> = [
    { label: "Tổng tiền hàng", value: fee.totalMoney },
    { label: "Giảm giá sản phẩm", value: fee.totalProductDiscount },
    { label: "Giảm giá đơn hàng", value: fee.totalOrderDiscount },
    { label: "Số tiền VAT", value: fee.totalVat },
    { label: "Phí giao hàng", value: isFreeShipping ? 0 : shippingFee || 0 },
    { label: "Tổng phải thanh toán", value: fee.totalAmount, bold: true },
  ];

  summaryItems.forEach((item, index) => {
    const rowNumber = summaryStartRow + index;

    worksheet.mergeCells(`F${rowNumber}:G${rowNumber}`);
    worksheet.getCell(`F${rowNumber}`).value = item.label;
    worksheet.getCell(`F${rowNumber}`).alignment = { horizontal: "left", vertical: "middle" };

    worksheet.mergeCells(`H${rowNumber}:I${rowNumber}`);
    worksheet.getCell(`H${rowNumber}`).value = item.value;
    worksheet.getCell(`H${rowNumber}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`H${rowNumber}`).numFmt = "#,##0";

    if (item.bold) {
      worksheet.getCell(`F${rowNumber}`).font = { bold: true };
      worksheet.getCell(`H${rowNumber}`).font = { bold: true, color: { argb: "FFDC2626" } };
    }
  });

  const signatureRow = summaryStartRow + summaryItems.length + 2;

  worksheet.mergeCells(`A${signatureRow}:C${signatureRow}`);
  worksheet.getCell(`A${signatureRow}`).value = "Bên giao";
  worksheet.getCell(`A${signatureRow}`).alignment = { horizontal: "center" };
  worksheet.getCell(`A${signatureRow}`).font = { bold: true };
  worksheet.mergeCells(`A${signatureRow + 1}:C${signatureRow + 1}`);
  worksheet.getCell(`A${signatureRow + 1}`).value = "(Ký, ghi rõ họ tên)";
  worksheet.getCell(`A${signatureRow + 1}`).alignment = { horizontal: "center" };
  worksheet.getCell(`A${signatureRow + 1}`).font = { italic: true, size: 9 };

  worksheet.mergeCells(`D${signatureRow}:F${signatureRow}`);
  worksheet.getCell(`D${signatureRow}`).value = "Bên nhận";
  worksheet.getCell(`D${signatureRow}`).alignment = { horizontal: "center" };
  worksheet.getCell(`D${signatureRow}`).font = { bold: true };
  worksheet.mergeCells(`D${signatureRow + 1}:F${signatureRow + 1}`);
  worksheet.getCell(`D${signatureRow + 1}`).value = "(Ký, ghi rõ họ tên)";
  worksheet.getCell(`D${signatureRow + 1}`).alignment = { horizontal: "center" };
  worksheet.getCell(`D${signatureRow + 1}`).font = { italic: true, size: 9 };

  worksheet.mergeCells(`G${signatureRow}:I${signatureRow}`);
  worksheet.getCell(`G${signatureRow}`).value = "Người lập phiếu";
  worksheet.getCell(`G${signatureRow}`).alignment = { horizontal: "center" };
  worksheet.getCell(`G${signatureRow}`).font = { bold: true };
  worksheet.mergeCells(`G${signatureRow + 1}:I${signatureRow + 1}`);
  worksheet.getCell(`G${signatureRow + 1}`).value = "(Ký, ghi rõ họ tên)";
  worksheet.getCell(`G${signatureRow + 1}`).alignment = { horizontal: "center" };
  worksheet.getCell(`G${signatureRow + 1}`).font = { italic: true, size: 9 };

  worksheet.getColumn(1).width = 6;
  worksheet.getColumn(2).width = 14;
  worksheet.getColumn(3).width = 32;
  worksheet.getColumn(4).width = 12;
  worksheet.getColumn(5).width = 14;
  worksheet.getColumn(6).width = 12;
  worksheet.getColumn(7).width = 10;
  worksheet.getColumn(8).width = 12;
  worksheet.getColumn(9).width = 8;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Don_mua_hang_${data.code}_${dayjs().format("DDMMYYYY")}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const exportInventoryAdjustmentToExcel = async (data: IInventoryAdjustment) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Phiếu kiểm kho");

  // thiết lập font mặc định
  worksheet.properties.defaultRowHeight = 20;

  // 1. Title
  worksheet.mergeCells("A1:I2");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "PHIẾU KIỂM KHO";
  titleCell.font = { name: "Arial", size: 18, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  // 2. Thông tin phiếu
  // Dòng 4: Số phiếu và Ngày
  worksheet.mergeCells("A4:B4");
  worksheet.getCell("A4").value = "Số phiếu:";
  worksheet.mergeCells("C4:D4");
  worksheet.getCell("C4").value = data.code || "";

  worksheet.mergeCells("E4:F4");
  worksheet.getCell("E4").value = "Ngày:";
  worksheet.mergeCells("G4:I4");
  worksheet.getCell("G4").value = formatDateTimeDDMMYYYY(data.occurredAt);

  // Dòng 5: Cửa hàng và NV thực hiện
  worksheet.mergeCells("A5:B5");
  worksheet.getCell("A5").value = "Cửa hàng:";
  worksheet.mergeCells("C5:D5");
  worksheet.getCell("C5").value = data.store?.name || "";

  worksheet.mergeCells("E5:F5");
  worksheet.getCell("E5").value = "NV thực hiện:";
  worksheet.mergeCells("G5:I5");
  worksheet.getCell("G5").value = data.adjustedBy?.name || "";

  // Dòng 6: Lý do
  worksheet.mergeCells("A6:B6");
  worksheet.getCell("A6").value = "Lý do:";
  worksheet.mergeCells("C6:I6");
  worksheet.getCell("C6").value = data.reason || "";

  // Dòng 7: Ghi chú
  worksheet.mergeCells("A7:B7");
  worksheet.getCell("A7").value = "Ghi chú:";
  worksheet.mergeCells("C7:I7");
  worksheet.getCell("C7").value = data.note || "";

  // format font cho label
  ["A4", "E4", "A5", "E5", "A6", "A7"].forEach((cell) => {
    worksheet.getCell(cell).font = { bold: true };
    worksheet.getCell(cell).alignment = { horizontal: "left" };
  });

  // 3. Table Header (bắt đầu từ dòng 9)
  const headerRow = worksheet.getRow(9);
  headerRow.values = [
    "STT",
    "Mã hàng hóa",
    "Tên hàng hóa",
    "ĐVT",
    "Tồn hệ thống",
    "Tồn thực tế",
    "Chênh lệch",
    "Giá trị chênh lệch",
    "Ghi chú",
  ];
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // 4. Table Body
  let totalCountedQty = 0;
  let totalExpectedQty = 0;
  let totalDeltaQty = 0;
  let totalAdjustmentValue = 0;

  data.lines?.forEach((line, index) => {
    const isDecrease = line.direction === InventoryTransactionTypeEnum.OUT;
    const deltaQtyValue = (line.deltaQty || 0) * (isDecrease ? -1 : 1);
    const adjustmentValueValue = (line.adjustmentValue || 0) * (isDecrease ? -1 : 1);

    totalCountedQty += line.countedQty || 0;
    totalExpectedQty += line.expectedQty || 0;
    totalDeltaQty += deltaQtyValue;
    totalAdjustmentValue += adjustmentValueValue;

    const row = worksheet.addRow([
      index + 1,
      line.productVariant?.barcode || line.productVariant?.product?.code || "",
      line.productVariantSnapshot?.product?.name || line.productVariant?.product?.name || "",
      line.productVariant?.product?.unit?.name || "",
      line.countedQty || 0,
      line.expectedQty || 0,
      deltaQtyValue,
      adjustmentValueValue,
      line.note || "",
    ]);

    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      if (colNumber === 1 || colNumber === 4) {
        cell.alignment = { horizontal: "center" };
      }
      if (colNumber === 5 || colNumber === 6 || colNumber === 7) {
        cell.alignment = { horizontal: "right" };
        cell.numFmt = "#,##0";
      }
      if (colNumber === 8) {
        cell.alignment = { horizontal: "right" };
        cell.numFmt = "#,##0";
        // Màu sắc cho giá trị chênh lệch
        if (adjustmentValueValue < 0) {
          cell.font = { color: { argb: "FFDC2626" } }; // đỏ
        } else if (adjustmentValueValue > 0) {
          cell.font = { color: { argb: "FF16A34A" } }; // xanh lá
        }
      }
      // Màu sắc cho chênh lệch số lượng
      if (colNumber === 7) {
        if (deltaQtyValue < 0) {
          cell.font = { color: { argb: "FFEF4444" } }; // đỏ nhạt
        } else if (deltaQtyValue > 0) {
          cell.font = { color: { argb: "FF22C55E" } }; // xanh lá nhạt
        }
      }
    });
  });

  // 5. Dòng tổng cộng
  const totalRowNumber = worksheet.rowCount + 1;
  worksheet.mergeCells(`A${totalRowNumber}:D${totalRowNumber}`);
  const totalLabelCell = worksheet.getCell(`A${totalRowNumber}`);
  totalLabelCell.value = "TỔNG CỘNG";
  totalLabelCell.font = { bold: true };
  totalLabelCell.alignment = { horizontal: "center", vertical: "middle" };

  const totalCountedCell = worksheet.getCell(`E${totalRowNumber}`);
  totalCountedCell.value = totalCountedQty;
  totalCountedCell.font = { bold: true };
  totalCountedCell.alignment = { horizontal: "right", vertical: "middle" };
  totalCountedCell.numFmt = "#,##0";

  const totalExpectedCell = worksheet.getCell(`F${totalRowNumber}`);
  totalExpectedCell.value = totalExpectedQty;
  totalExpectedCell.font = { bold: true };
  totalExpectedCell.alignment = { horizontal: "right", vertical: "middle" };
  totalExpectedCell.numFmt = "#,##0";

  const totalDeltaCell = worksheet.getCell(`G${totalRowNumber}`);
  totalDeltaCell.value = totalDeltaQty;
  totalDeltaCell.font = { bold: true };
  totalDeltaCell.alignment = { horizontal: "right", vertical: "middle" };
  totalDeltaCell.numFmt = "#,##0";
  if (totalDeltaQty < 0) {
    totalDeltaCell.font = { bold: true, color: { argb: "FFEF4444" } };
  } else if (totalDeltaQty > 0) {
    totalDeltaCell.font = { bold: true, color: { argb: "FF22C55E" } };
  }

  const totalAdjustmentCell = worksheet.getCell(`H${totalRowNumber}`);
  totalAdjustmentCell.value = totalAdjustmentValue;
  totalAdjustmentCell.font = { bold: true };
  totalAdjustmentCell.alignment = { horizontal: "right", vertical: "middle" };
  totalAdjustmentCell.numFmt = "#,##0";
  if (totalAdjustmentValue < 0) {
    totalAdjustmentCell.font = { bold: true, color: { argb: "FFDC2626" } };
  } else if (totalAdjustmentValue > 0) {
    totalAdjustmentCell.font = { bold: true, color: { argb: "FF16A34A" } };
  }

  // Thêm border cho dòng tổng cộng
  [
    `A${totalRowNumber}`,
    `B${totalRowNumber}`,
    `C${totalRowNumber}`,
    `D${totalRowNumber}`,
    `E${totalRowNumber}`,
    `F${totalRowNumber}`,
    `G${totalRowNumber}`,
    `H${totalRowNumber}`,
    `I${totalRowNumber}`,
  ].forEach((cellAddr) => {
    worksheet.getCell(cellAddr).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // 6. Footer - Chữ ký (3 phần)
  const lastRow = worksheet.rowCount + 2;

  // Người kiểm kho
  worksheet.mergeCells(`A${lastRow}:C${lastRow}`);
  worksheet.getCell(`A${lastRow}`).value = "Người kiểm kho";
  worksheet.getCell(`A${lastRow}`).alignment = { horizontal: "center" };
  worksheet.getCell(`A${lastRow}`).font = { bold: true };
  worksheet.getCell(`A${lastRow + 1}`).value = "(Ký, ghi rõ họ tên)";
  worksheet.mergeCells(`A${lastRow + 1}:C${lastRow + 1}`);
  worksheet.getCell(`A${lastRow + 1}`).alignment = { horizontal: "center" };
  worksheet.getCell(`A${lastRow + 1}`).font = { italic: true, size: 9 };

  // Thủ kho
  worksheet.mergeCells(`D${lastRow}:F${lastRow}`);
  worksheet.getCell(`D${lastRow}`).value = "Thủ kho";
  worksheet.getCell(`D${lastRow}`).alignment = { horizontal: "center" };
  worksheet.getCell(`D${lastRow}`).font = { bold: true };
  worksheet.getCell(`D${lastRow + 1}`).value = "(Ký, ghi rõ họ tên)";
  worksheet.mergeCells(`D${lastRow + 1}:F${lastRow + 1}`);
  worksheet.getCell(`D${lastRow + 1}`).alignment = { horizontal: "center" };
  worksheet.getCell(`D${lastRow + 1}`).font = { italic: true, size: 9 };

  // Người lập phiếu
  worksheet.mergeCells(`G${lastRow}:I${lastRow}`);
  worksheet.getCell(`G${lastRow}`).value = "Người lập phiếu";
  worksheet.getCell(`G${lastRow}`).alignment = { horizontal: "center" };
  worksheet.getCell(`G${lastRow}`).font = { bold: true };
  worksheet.getCell(`G${lastRow + 1}`).value = "(Ký, ghi rõ họ tên)";
  worksheet.mergeCells(`G${lastRow + 1}:I${lastRow + 1}`);
  worksheet.getCell(`G${lastRow + 1}`).alignment = { horizontal: "center" };
  worksheet.getCell(`G${lastRow + 1}`).font = { italic: true, size: 9 };

  // thiết lập độ rộng cột
  worksheet.getColumn(1).width = 6; // STT
  worksheet.getColumn(2).width = 15; // Mã
  worksheet.getColumn(3).width = 30; // Tên
  worksheet.getColumn(4).width = 10; // ĐVT
  worksheet.getColumn(5).width = 15; // Tồn hệ thống
  worksheet.getColumn(6).width = 15; // Tồn thực tế
  worksheet.getColumn(7).width = 15; // Chênh lệch
  worksheet.getColumn(8).width = 18; // Giá trị chênh lệch
  worksheet.getColumn(9).width = 25; // Ghi chú

  // 7. Xuất file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Phieu_kiem_kho_${data.code}_${dayjs().format("DDMMYYYY")}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};
