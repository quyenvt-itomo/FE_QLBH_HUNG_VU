import React, { useMemo, useState } from "react";
import { moduleMap, Module } from "@/shared/constants/permission";
import { logActionMapping, OperationLog } from "../operationLog.model";
import { Button, Tooltip } from "antd";
import LogDetailDrawer from "./LogDetailDrawer";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { ColumnsConfigType } from "@/shared/components/table/handleColumnSelector";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";

const formatText = (v?: string | null) => v || "--";

export const OperationLogTable: React.FC<ObjectTableProps> = ({ ...rest }) => {
  const [selected, setSelected] = useState<OperationLog | null>(null);
  const columns: ColumnsConfigType = useMemo(
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
        render: (v: Module) => moduleMap[v] || v,
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
            <Button size="small" type="primary" ghost onClick={() => setSelected(record)}>
              Xem
            </Button>
          </Tooltip>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <TableColumnConfig
        columns={columns}
        itemName="nhật ký"
        tableKey="operation-log-table"
        showCreator={false}
        showUpdater={false}
        {...rest}
      />
      <LogDetailDrawer open={!!selected} log={selected} onClose={() => setSelected(null)} />
    </>
  );
};
