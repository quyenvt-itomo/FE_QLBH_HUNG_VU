import React, { useState } from "react";
import { App, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { usePageState } from "@/shared/hooks/usePageState";
import { IncomeExpense } from "./incomeExpense.model";
import { useIncomeExpenseStore } from "./incomeExpense.store";
import { Panel } from "@/shared/components/display/Panel";
import { SearchInput } from "@/shared/components/input";

const IncomeExpensePage: React.FC = () => {
  const { modal } = App.useApp();
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<IncomeExpense>();
  const { data, loading, pagination, remove } = useIncomeExpenseStore({ keyword, page, size });

  const handleDelete = remove
    ? (record: IncomeExpense) => {
        modal.confirm({
          title: "Xóa",
          content: "Xác nhận xóa?",
          okText: "Xóa",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: () => remove(record.id),
        });
      }
    : undefined;

  const columns: ColumnsType<IncomeExpense> = [
    { title: "Mã", dataIndex: "code", key: "code", width: 120, className: "font-mono" },

    { title: "Ngày", dataIndex: "occurredAt", key: "occurredAt", width: 120 },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (t: string) => (
        <Tag color={t === "income" ? "green" : "red"}>{t === "income" ? "Thu" : "Chi"}</Tag>
      ),
    },
    { title: "Số tiền", dataIndex: "amount", key: "amount", width: 150, align: "right" },
    { title: "Mô tả", dataIndex: "description", key: "description", width: 200 },

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
      render: (_: any, record: IncomeExpense) => (
        <div className="flex gap-1 justify-center">
          {record._actions?.update?.can && (
            <button className="text-blue-500 hover:text-blue-700 text-xs">Sửa</button>
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
    <Panel title="Thu chi">
      <div className="flex items-center justify-between mb-3">
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
      </div>
      <Table<IncomeExpense>
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

export default IncomeExpensePage;
