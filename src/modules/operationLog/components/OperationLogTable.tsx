import React, { useMemo, useState } from "react";
import { moduleMap, Module } from "@/shared/constants";
import { logActionMapping, OperationLog, targetEntityMapping } from "../operationLog.model";
import { Button, Tooltip } from "antd";
import { ColumnsConfigType, ObjectTableProps, TableColumnConfig } from "@/shared/components";
import { formatDateTimeDDMMYYYY } from "@/shared/utils";

const formatText = (v?: string | null) => v || "--";

export const OperationLogTable: React.FC<ObjectTableProps> = ({ onViewDetail, ...rest }) => {
  const columns: ColumnsConfigType<OperationLog> = useMemo(
    () => [
      {
        title: "Thời gian",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 160,
        align: "center",
        render: (v: string) => (v ? formatDateTimeDDMMYYYY(v) : "--"),
      },
      {
        title: "Người dùng",
        dataIndex: ["creatorSnapshot", "username"],
        key: "creatorSnapshotName",
        width: 150,
        render: (v: string) => formatText(v),
      },
      {
        title: "Hành động",
        dataIndex: "action",
        key: "action",
        width: 110,
        align: "center",
        render: (value: string) => logActionMapping[value] || value,
      },
      {
        title: "Module",
        dataIndex: "targetEntity",
        key: "targetEntity",
        width: 150,
        render: (v: Module) => targetEntityMapping[v] || v,
      },
      {
        title: "Đối tượng",
        dataIndex: "targetSnapshot",
        key: "targetId",
        width: 180,
        render: (v: any) => v?.code || v?.name,
      },

      {
        title: "Kết quả",
        dataIndex: "success",
        key: "success",
        width: 110,
        align: "center",
        render: (v: boolean) => (
          <span
            className={`inline-flex items-center px-2 py-[2px] rounded-md text-[11px] font-medium border ${v ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}
          >
            {v ? "Thành công" : "Lỗi"}
          </span>
        ),
      },
      {
        title: "Chi tiết",
        key: "detail",
        width: 100,
        align: "center",
        fixed: "right" as const,
        render: (record: OperationLog) => (
          <Tooltip title="Xem chi tiết">
            <Button size="small" type="primary" ghost onClick={() => onViewDetail?.(record)}>
              Xem
            </Button>
          </Tooltip>
        ),
      },
    ],
    [],
  );

  return (
    <TableColumnConfig
      columns={columns}
      itemName="bản ghi"
      tableKey="operation-log-table"
      showCreator={false}
      showUpdater={false}
      {...rest}
    />
  );
};
