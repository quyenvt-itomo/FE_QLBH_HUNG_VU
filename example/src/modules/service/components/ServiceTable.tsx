import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { Service } from "../service.model";
import { ServiceTypeTag } from "./Tag";
import { formatMoney } from "@/shared/utils/number.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: Service) => void;
}

export const ServiceTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const columns: any = useMemo(
    () => [
      {
        title: "Mã DV",
        dataIndex: "code",
        key: "code",
        width: 130,
        className: "code-column font-mono",
        fixed: "left",
        render: (v: string, r: Service) => (
          <span
            className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail?.(r);
            }}
          >
            {v}
          </span>
        ),
      },
      { title: "Tên dịch vụ", dataIndex: "name", key: "name", width: 220 },
      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
        width: 80,
        align: "center",
        render: (val: Service["type"]) => <ServiceTypeTag value={val} />,
      },
      {
        title: "Thuế",
        dataIndex: "taxRate",
        key: "taxRate",
        width: 80,
        align: "right",
        render: (v: number) => (v != null ? `${v}%` : "--"),
      },
      {
        title: "Giá đầu vào",
        dataIndex: "units",
        key: "costPrice",
        width: 220,
        render: (units: Service["units"]) => {
          if (!units || units.length === 0) return "--";
          return units
            .map((u) => `${formatMoney(u.costPrice)} VNĐ/${u.unit?.name || "ĐVT"}`)
            .join(", ");
        },
      },
      {
        title: "Giá đầu ra",
        dataIndex: "units",
        key: "unitPrice",
        width: 220,
        render: (units: Service["units"]) => {
          if (!units || units.length === 0) return "--";
          return units
            .map((u) => `${formatMoney(u.unitPrice)} VNĐ/${u.unit?.name || "ĐVT"}`)
            .join(", ");
        },
      },
      { title: "Ghi chú", dataIndex: "note", key: "note", width: 200, ellipsis: true },
    ],
    [onViewDetail],
  );
  return (
    <TableColumnConfig columns={columns} itemName="Dịch vụ" tableKey="service-table" {...rest} />
  );
};
