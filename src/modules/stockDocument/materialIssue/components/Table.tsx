import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components";
import { StockDocument, stockDocumentStatusMap } from "../../stockDocument.model";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { resolveByPath } from "@/shared/utils/common.util";
import { ColumnsConfigType } from "@/shared/components";
import { EntityInfo } from "@/shared/components";

export const Table: React.FC<ObjectTableProps> = ({ onViewDetail, ...rest }) => {
  const cols: ColumnsConfigType<StockDocument> = useMemo(
    () => [
      {
        title: "Số phiếu",
        key: "code",
        width: 150,
        fixed: "left",
        className: "font-mono",
        render: (r: StockDocument) => (
          <EntityInfo
            title={r.code}
            subTitle={formatDateTimeDDMMYYYY(r.createdAt)}
            onClick={() => onViewDetail?.(r)}
          />
        ),
      },
      {
        title: "Trạng thái",
        key: "status",
        width: 120,
        align: "center",
        render: (r: StockDocument) => stockDocumentStatusMap[r.status] || r.status,
      },
      {
        title: "Kho",
        key: "warehouse",
        width: 180,
        render: (r: StockDocument) => resolveByPath(r, ["warehouse", "name"], "--"),
      },
      {
        title: "Ngày XK",
        key: "effectiveDate",
        width: 120,
        align: "center",
        render: (r: StockDocument) =>
          r.effectiveDate ? formatDateTimeDDMMYYYY(r.effectiveDate) : "--",
      },
      {
        title: "Số dòng",
        key: "lines",
        width: 80,
        align: "center",
        render: (r: StockDocument) => r.lines?.length || 0,
      },
      { title: "Ghi chú", key: "note", width: 200, render: (r: StockDocument) => r.note || "--" },
    ],
    [onViewDetail],
  );
  return (
    <TableColumnConfig
      columns={cols}
      itemName="phiếu xuất NVL"
      tableKey="material-issue-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
