import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";
import { StockDocumentLine } from "../stockDocumentLine.model";

export const StockDocumentLineTable: React.FC<ObjectTableProps> = ({ ...rest }) => {
  const cols = useMemo(
    () => [
      {
        title: "Số phiếu",
        dataIndex: ["stockDocument", "code"],
        key: "stockDocumentCode",
        width: 150,
        fixed: "left" as const,
        className: "font-mono",
      },
      {
        title: "Hàng hóa",
        key: "product",
        width: 220,
        render: (r: StockDocumentLine) => (
          <div className="flex flex-col">
            <span className="font-medium">{resolveByPath(r, ["product", "name"], "--")}</span>
            <span className="text-xs text-gray-400 font-mono">
              {resolveByPath(r, ["product", "code"], "")}
            </span>
          </div>
        ),
      },
      {
        title: "ĐVT",
        key: "unit",
        width: 90,
        align: "center" as const,
        render: (r: StockDocumentLine) => resolveByPath(r, ["unit", "name"], "--"),
      },
      {
        title: "SL yêu cầu",
        dataIndex: "requestQuantity",
        key: "req",
        width: 100,
        align: "right" as const,
        render: (v: any) => formatQuantity(v || 0),
      },
      {
        title: "SL thực tế",
        dataIndex: "stockQuantity",
        key: "stock",
        width: 100,
        align: "right" as const,
        render: (v: any) => formatQuantity(v || 0),
      },
      {
        title: "SL cộng thêm",
        dataIndex: "additionalQuantity",
        key: "add",
        width: 100,
        align: "right" as const,
        render: (v: any) => formatQuantity(v || 0),
      },
      {
        title: "SL hóa đơn",
        dataIndex: "billingQuantity",
        key: "bill",
        width: 100,
        align: "right" as const,
        render: (v: any) => formatQuantity(v || 0),
      },
      {
        title: "Chênh lệch",
        dataIndex: "varianceQuantity",
        key: "varQty",
        width: 100,
        align: "right" as const,
        render: (v: any) => {
          const val = Number(v) || 0;
          return (
            <span className={val === 0 ? "" : val > 0 ? "text-green-600" : "text-red-600"}>
              {formatQuantity(val)}
            </span>
          );
        },
      },
      {
        title: "Giá trị CL",
        dataIndex: "varianceAmount",
        key: "varAmt",
        width: 130,
        align: "right" as const,
        render: (v: any) => formatMoney(v || 0),
      },
      {
        title: "Đối tác",
        dataIndex: ["stockDocument", "partner", "name"],
        key: "partnerName",
        width: 180,
      },
      {
        title: "Kho",
        dataIndex: ["stockDocument", "warehouse", "name"],
        key: "warehouseName",
        width: 150,
      },
    ],
    [],
  );
  return (
    <TableColumnConfig
      columns={cols}
      itemName="dòng phiếu"
      tableKey="stock-document-line-table"
      {...rest}
    />
  );
};
