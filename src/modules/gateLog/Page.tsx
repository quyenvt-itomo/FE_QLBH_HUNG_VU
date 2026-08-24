import React, { useState } from "react";
import { App, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { usePageState } from "@/shared/hooks/usePageState";
import { GateLog } from "./gateLog.model";
import { useGateLogStore } from "./gateLog.store";
import { Panel } from "@/shared";
import { SearchInput } from "@/shared";

const GateLogPage: React.FC = () => {
  const { modal } = App.useApp();
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<GateLog>();
  const { data, loading, pagination, remove } = useGateLogStore({ keyword, page, size });

  const handleDelete = remove
    ? (record: GateLog) => {
        modal.confirm({
          title: "Xóa",
          content: "Xác nh?n xóa?",
          okText: "Xóa",
          okButtonProps: { danger: true },
          cancelText: "H?y",
          onOk: () => remove(record.id),
        });
      }
    : undefined;

  const columns: ColumnsType<GateLog> = [
    { title: "M?", dataIndex: "code", key: "code", width: 120, className: "font-mono" },

    { title: "Ngày", dataIndex: "occurredAt", key: "occurredAt", width: 120 },
    { title: "Bi?n s?", dataIndex: "vehiclePlate", key: "vehiclePlate", width: 120 },
    { title: "Lo?i xe", dataIndex: "vehicleType", key: "vehicleType", width: 100 },

    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      render: (v: string) => v || "-",
    },
    {
      title: "",
      key: "actions",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_: any, record: GateLog) => (
        <div className="flex gap-1 justify-center">
          {record._actions?.update?.can && (
            <button className="text-blue-500 hover:text-blue-700 text-xs">S?a</button>
          )}
          {record._actions?.delete?.can && (
            <button
              className="text-red-500 hover:text-red-700 text-xs"
              onClick={() => handleDelete?.(record)}
            >
              Xóa
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Panel title="Nh?t k? c?ng">
      <div className="flex items-center justify-between mb-3">
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
      </div>
      <Table<GateLog>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={
          pagination
            ? {
                current: pagination.currentPage,
                pageSize: pagination.size,
                total: pagination.totalRecords,
                onChange: (p) => setPage(p),
                onShowSizeChange: (_c, s) => setSize(s),
              }
            : false
        }
      />
    </Panel>
  );
};

export default GateLogPage;
