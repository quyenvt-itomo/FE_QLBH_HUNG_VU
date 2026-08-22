import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { StockDocument, stockDocumentStatusMap } from "../../stockDocument.model";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";
import { EntityInfo } from "@/shared/components/display/EntityInfo";

export const Table: React.FC<ObjectTableProps> = ({ onViewDetail, ...rest }) => {
  const cols = useMemo(
    () => [
      {
        title: "Số phiếu",
        key: "code",
        width: 150,
        fixed: "left" as const,
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
        align: "center" as const,
        render: (r: StockDocument) => stockDocumentStatusMap[r.status] || r.status,
      },
      {
        title: "Khách hàng",
        key: "partner",
        width: 220,
        render: (r: StockDocument) => resolveByPath(r, ["partner", "name"], "--"),
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
        align: "center" as const,
        render: (r: StockDocument) =>
          r.effectiveDate ? formatDateTimeDDMMYYYY(r.effectiveDate) : "--",
      },
      {
        title: "Số dòng",
        key: "lines",
        width: 80,
        align: "center" as const,
        render: (r: StockDocument) => r.lines?.length || 0,
      },
      {
        title: "Chênh lệch",
        key: "variance",
        width: 140,
        align: "right" as const,
        render: (r: StockDocument) => formatMoney(r.totalVarianceAmount || 0),
      },
      {
        title: "Biển số",
        key: "vehiclePlate",
        width: 140,
        render: (r: StockDocument) => r.vehiclePlate || "--",
      },
    ],
    [onViewDetail],
  );
  return (
    <TableColumnConfig
      columns={cols as any}
      itemName="phiếu xuất bán"
      tableKey="order-issue-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
