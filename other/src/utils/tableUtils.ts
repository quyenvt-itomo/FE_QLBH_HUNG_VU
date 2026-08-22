/**
 * Highlight một hàng trong bảng và cuộn đến hàng đó.
 * @param rowKey - Key của hàng cần highlight.
 * @param highlightClass - Tên class để thêm hiệu ứng highlight (mặc định: "highlight-row").
 * @param duration - Thời gian duy trì hiệu ứng highlight (mặc định: 2000ms).
 * @param offset - Khoảng cách so với đỉnh khi cuộn đến hàng (mặc định: 100px).
 */

import { notification } from "antd";

export const highlightRow = (
  rowKey: React.Key | string,
  highlightClass: string = "highlight-row",
  duration: number = 2000,
  offset: number = 0,
) => {
  // Tìm tableBody và phần tử hàng theo key
  const tableBody = document.querySelector(`.highlight-table .ant-table-body`);
  const rowElement = document.querySelector(
    `.highlight-table .editable-row[data-row-key="${rowKey}"]`,
  );

  if (rowElement) {
    // Lấy vị trí của hàng so với tableBody
    const rowOffsetTop = (rowElement as HTMLElement).offsetTop;

    // Cuộn tableBody đến vị trí hàng với khoảng cách offset
    tableBody?.scrollTo({
      top: rowOffsetTop - offset,
      behavior: "smooth", // Cuộn mượt mà
    });

    // Thêm hiệu ứng highlight
    rowElement.classList.add(highlightClass);
    setTimeout(() => {
      rowElement.classList.remove(highlightClass);
    }, duration);
  }
};

export const scrollToRow = (
  rowKey: React.Key | string,
  offset: number = 50,
) => {
  const tableBody = document.querySelector(`.highlight-table .ant-table-body`);
  const rowElement = document.querySelector(
    `.highlight-table .editable-row[data-row-key="${rowKey}"]`,
  );

  if (rowElement && tableBody) {
    const rowOffsetTop = (rowElement as HTMLElement).offsetTop;
    tableBody.scrollTo({
      top: rowOffsetTop - offset,
      behavior: "smooth",
    });
  }
};

export const scrollToSelectedRow = (rowKey: string | number) => {
  setTimeout(() => {
    const tableBody = document.querySelector(
      `.dropdown__table .ant-table-body`,
    ) as HTMLElement;
    const selectedRow = document.querySelector(
      `.dropdown__table .ant-table-row[data-row-key="${rowKey}"]`,
    ) as HTMLElement | null;

    if (tableBody && selectedRow) {
      const rowOffset = selectedRow.offsetTop; // Vị trí của dòng trong bảng
      const rowHeight = selectedRow.offsetHeight;
      const tableHeight = tableBody.clientHeight;
      const scrollTop = tableBody.scrollTop;

      if (rowOffset < scrollTop) {
        // Nếu dòng nằm trên vùng nhìn thấy, cuộn để nó xuất hiện ở đầu bảng
        tableBody.scrollTo({
          top: rowOffset,
          behavior: "smooth",
        });
      } else if (rowOffset + rowHeight > scrollTop + tableHeight) {
        // Nếu dòng nằm dưới vùng nhìn thấy, cuộn để nó xuất hiện ở cuối bảng
        tableBody.scrollTo({
          top: rowOffset - (tableHeight - rowHeight) + 10,
          behavior: "smooth",
        });
      }
    }
  }, 50);
};

export const scrollToBottom = () => {
  setTimeout(() => {
    const tableBody = document.querySelector(".product__table .ant-table-body");
    if (tableBody) {
      tableBody.scrollTo({
        top: tableBody.scrollHeight,
        behavior: "smooth", // Cuộn mượt mà
      });
    }
  }, 100);
};

export const validateTableData = (
  tableData: any[],
  requiredFields: Record<string, string>,
  notCheckLength?: boolean,
) => {
  if (!tableData.length && !notCheckLength) {
    notification.error({
      message: "Lỗi",
      description:
        "Bảng dữ liệu đang trống. Vui lòng thêm dữ liệu trước khi lưu.",
      placement: "bottomRight",
      duration: 10,
    });

    throw new Error("Bảng dữ liệu trống.");
  }
  for (const [index, row] of tableData.entries()) {
    const missingFields = Object.keys(requiredFields).filter(
      (field) => row[field] == null || row[field] === "" || row[field] === 0,
    );

    if (missingFields.length) {
      highlightRow(row.key);
      const rowIndex = index + 1; // Dòng bắt đầu từ 1 thay vì 0
      const missingFieldNames = missingFields.map(
        (field) => requiredFields[field] || field,
      );

      notification.error({
        message: "Lỗi",
        description: `Dòng ${rowIndex} thiếu các thông tin: ${missingFieldNames.join(
          ", ",
        )}`,
        placement: "bottomRight",
        duration: 10,
      });

      throw new Error(
        `Dòng ${rowIndex} thiếu thông tin quan trọng: ${missingFieldNames.join(
          ", ",
        )}.`,
      );
    }
  }
};

export const checkDuplicateRows = (
  tableData: any[],
  duplicateFields: Record<string, string>,
) => {
  const seen = new Map<string, number>();
  for (const [index, row] of tableData.entries()) {
    const key = Object.keys(duplicateFields)
      .map((field) => row[field])
      .join("|");

    if (seen.has(key)) {
      const firstIndex = seen.get(key)! + 1;
      const currentIndex = index + 1;
      const fieldNames = Object.values(duplicateFields).join(", ");

      highlightRow(row.key);
      notification.error({
        message: "Lỗi",
        description: `Dòng ${currentIndex} có thông tin ${fieldNames} bị lặp lại với dòng ${firstIndex}.`,
        placement: "bottomRight",
        duration: 10,
      });

      throw new Error(
        `Dòng ${currentIndex} bị trùng thông tin (${fieldNames}) với dòng ${firstIndex}.`,
      );
    }

    seen.set(key, index);
  }
};

export const checkDuplicateFields = (
  tableData: any[],
  duplicateFields: Record<string, string>,
) => {
  const fieldSeen = new Map<string, Map<any, number>>(); // field -> value -> index

  for (const field of Object.keys(duplicateFields)) {
    fieldSeen.set(field, new Map());
  }

  for (const [index, row] of tableData.entries()) {
    for (const field of Object.keys(duplicateFields)) {
      const value = row[field];
      const seenMap = fieldSeen.get(field)!;

      if (seenMap.has(value)) {
        const firstIndex = seenMap.get(value)! + 1;
        const currentIndex = index + 1;
        const fieldName = duplicateFields[field];

        highlightRow(row.key);
        notification.error({
          message: "Lỗi",
          description: `Trường "${fieldName}" tại dòng ${currentIndex} bị trùng với dòng ${firstIndex}.`,
          placement: "bottomRight",
          duration: 10,
        });

        throw new Error(
          `Trường "${fieldName}" tại dòng ${currentIndex} bị trùng với dòng ${firstIndex}.`,
        );
      }

      seenMap.set(value, index);
    }
  }
};

type DataRow = {
  quantity?: number; // Số lượng lý thuyết
  real_quantity?: number; // Số lượng thực tế
  price?: number; // Đơn giá
  vat?: number; // Thuế VAT (%)
  commission?: number; // Hoa hồng (%)
  [key: string]: any; // Cho phép các trường khác tùy biến
};

export function calculateSummaryRow(data: DataRow[], groupKey: string) {
  const summary = {
    isSummary: true, // Đánh dấu đây là dòng tổng kết
    index: "", // Không cần đánh số dòng cho tổng
    quantity: 0, // Tổng số lượng lý thuyết
    real_quantity: 0, // Tổng số lượng thực tế
    difference: 0, // Tổng chênh lệch (thực - lý thuyết)
    money: 0, // Tổng tiền hàng (chưa VAT, chưa hoa hồng)
    tax_vat: 0, // Tổng VAT
    amount: 0, // Tổng tiền phải thanh toán (gồm VAT)
    tax_commission: 0, // Tổng hoa hồng
    profit_loss: 0, // Chi phí thiệt hại = chênh lệch * giá
    [groupKey]: { name: "Tổng cộng" }, // Hiển thị tên nhóm
  };

  for (const item of data) {
    const quantity = item.quantity || 0; // Số lượng lý thuyết
    const real_quantity = item.real_quantity || 0; // Số lượng thực tế
    const price = item.price || 0; // Đơn giá
    const vat = item.vat || 0; // Thuế VAT (%)
    const commission = item.commission || 0; // Hoa hồng (%)

    const difference = real_quantity - quantity; // Chênh lệch (thực - lý thuyết)
    const lineMoney = quantity * price; // Tiền hàng (lý thuyết)
    const vatAmount = (lineMoney * vat) / 100; // Tiền thuế VAT
    const commissionAmount = (lineMoney * commission) / 100; // Tiền hoa hồng
    const profitLoss = difference * price; // Thiệt hại hoặc lãi = chênh lệch * giá

    // Cộng dồn vào dòng tổng kết
    summary.quantity += quantity;
    summary.real_quantity += real_quantity;
    summary.difference += difference;
    summary.money += lineMoney;
    summary.tax_vat += vatAmount;
    summary.tax_commission += commissionAmount;
    summary.profit_loss += profitLoss;
  }

  summary.amount = summary.money + summary.tax_vat; // Tổng tiền gồm VAT

  return summary;
}

export function cleanData<T>(data: T[], requiredFields: (keyof T)[]): T[] {
  return data
    .map((row) => {
      const hasAnyValue = requiredFields.some((field) => row[field]);

      return hasAnyValue ? row : null;
    })
    .filter((row): row is T => row !== null);
}
