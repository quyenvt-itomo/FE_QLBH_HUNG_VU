import React from "react";
import { App, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { usePageState } from "@/shared/hooks/usePageState";
import { ShippingPlan } from "./shippingPlan.model";
import { useShippingPlanStore } from "./shippingPlan.store";
import { useShippingPlanHandlers } from "./shippingPlan.handlers";
import { Panel } from "@/shared";
import { SearchInput } from "@/shared";
import { ShippingPlanAddUpdateModal } from "./components/ShippingPlanAddUpdateModal";
import { ShippingPlanDetailModal } from "./components/ShippingPlanDetailModal";
import { ApproveStatusTag } from "@/shared";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";
import { formatDateTime } from "@/shared/utils/date.util";

export const ShippingPlanPage: React.FC = () => {
  const {
    keyword,
    page,
    size,
    setPage,
    setSize,
    reload,
    open,
    setOpen,
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<ShippingPlan>();
  const {
    data,
    loading,
    pagination,
    errors,
    creating,
    updating,
    getById,
    create,
    update,
    remove,
    approve,
    reject,
  } = useShippingPlanStore({ keyword, page, size, reload }, () => pageAction.handleClose());

  const { handleOpenAdd, handleOpenEdit, handleDelete, handleApprove, handleReject } =
    useShippingPlanHandlers({
      create,
      update,
      remove,
      getById,
      approve,
      reject,
      setOpen,
      setOpenDetail,
      setRowData,
    });

  const columns: ColumnsType<ShippingPlan> = [
    { title: "M?", dataIndex: "code", key: "code", width: 140, className: "font-mono" },
    {
      title: "Ngày d? ki?n",
      dataIndex: "plannedAt",
      key: "plannedAt",
      width: 160,
      render: (v: string) => formatDateTime(v),
    },
    {
      title: "ÐVVC",
      key: "partner",
      width: 200,
      render: (r: ShippingPlan) => resolveByPath(r, ["partner", "name"], "—"),
    },
    {
      title: "Cý?c VC",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 120,
      align: "right",
      render: (v: number) => formatMoney(v),
    },
    {
      title: "S? chuy?n",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "right",
      render: (v: number) => formatQuantity(v),
    },
    {
      title: "T?ng ti?n",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 140,
      align: "right",
      render: (v: number) => <span className="font-semibold">{formatMoney(v)}</span>,
    },
    {
      title: "Tr?ng thái",
      dataIndex: "approveStatus",
      key: "approveStatus",
      width: 120,
      align: "center",
      render: (v: ShippingPlan["approveStatus"]) => <ApproveStatusTag value={v} />,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      render: (v: string) => v || "—",
    },
  ];

  return (
    <Panel title="Phýõng án v?n chuy?n">
      <div className="flex items-center justify-between mb-3">
        <SearchInput value={keyword} onSearch={(kw) => {}} maxWidth={340} />
      </div>
      <Table<ShippingPlan>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        onRow={(record) => ({
          onDoubleClick: () => {
            setRowData(record);
            setOpenDetail(true);
          },
        })}
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

      <ShippingPlanAddUpdateModal
        open={open}
        editData={rowData}
        errors={errors}
        loading={creating || updating}
        onAdd={create}
        onEdit={update}
        onClose={() => {
          setOpen(false);
          setRowData(undefined);
        }}
      />

      <ShippingPlanDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => {
          setOpenDetail(false);
          setRowData(undefined);
        }}
      />
    </Panel>
  );
};
