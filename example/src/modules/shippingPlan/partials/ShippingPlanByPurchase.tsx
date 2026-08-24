import React from "react";
import { Card, Button, Empty } from "antd";
import { ShippingPlan } from "../shippingPlan.model";
import { useShippingPlanStore } from "../shippingPlan.store";
import { useShippingPlanHandlers } from "../shippingPlan.handlers";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";
import { TableColumnConfig } from "@/shared/components/table/TableColumnConfig";
import { ColumnsConfigType } from "@/shared/components/table";
import { Purchase } from "@/modules/purchase";
import { SortOrder } from "@/shared/constants/enum";
import AddButton from "@/shared/components/button/AddButton";
import { usePageState } from "@/shared/hooks/usePageState";
import { ApproveStatusTag } from "@/shared/components/display/Tag";
import { ShippingPlanAddUpdateModal } from "../components/ShippingPlanAddUpdateModal";
import { ShippingPlanDetailModal } from "../components/ShippingPlanDetailModal";
import { MediaDropdown } from "@/shared/components/dropdown";
import { File } from "@/shared/interfaces/file";

interface Props {
  purchase: Purchase;
  canCreate?: boolean;
  onAdd?: () => void;
}

export const ShippingPlanByPurchase: React.FC<Props> = ({ purchase, canCreate, onAdd }) => {
  const { reload, open, setOpen, openDetail, setOpenDetail, rowData, setRowData, pageAction } =
    usePageState<ShippingPlan>();

  const {
    data,
    fetching,
    summary,
    creating,
    updating,
    errors,
    getById,
    approve,
    reject,
    create,
    update,
    remove,
  } = useShippingPlanStore(
    {
      page: 1,
      size: 999,
      sortBy: "plannedAt",
      sortOrder: SortOrder.DESC,
      purchaseId: purchase.id,
    },
    () => pageAction.handleClose(),
  );

  const { handleOpenAdd, handleOpenEdit, handleDelete, handleApprove, handleReject } =
    useShippingPlanHandlers({
      approve,
      reject,
      getById,
      create: canCreate ? create : undefined,
      update,
      remove,

      setOpen,
      setOpenDetail,
      setRowData,
    });

  const cols: ColumnsConfigType<ShippingPlan> = [
    {
      title: "Mã phương án",
      key: "code",
      width: 150,
      fixed: "left",
      render: (r: ShippingPlan) => r.code || "—",
    },
    {
      title: "Đơn vị vận chuyển",
      key: "partner",
      width: 200,
      render: (r: ShippingPlan) => resolveByPath(r, ["partner", "name"], "—"),
    },
    {
      title: "Mã ĐVVC",
      key: "partnerCode",
      width: 150,
      render: (r: ShippingPlan) => resolveByPath(r, ["partner", "code"], "—"),
    },
    {
      title: "Cước VC",
      dataIndex: "unitPrice",
      key: "price",
      width: 130,
      align: "right",
      render: (v: number) => formatMoney(v),
    },
    {
      title: "Số chuyến",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "right",
      render: (v: number) => formatQuantity(v),
    },
    {
      title: "Tiền cước",
      dataIndex: "subTotal",
      key: "sub",
      width: 130,
      align: "right",
      render: (v: number) => formatMoney(v),
    },
    {
      title: "%VAT",
      dataIndex: "taxRate",
      key: "tax",
      width: 70,
      align: "right",
      render: (v: number) => `${v}%`,
    },
    {
      title: "Tổng",
      dataIndex: "totalAmount",
      key: "total",
      width: 140,
      align: "right",
      render: (v: number) => <span className="font-semibold">{formatMoney(v)}</span>,
    },
    {
      title: "Tài liệu",
      dataIndex: "document",
      key: "document",
      width: 120,
      align: "center",
      render: (value: File[]) => <MediaDropdown files={value} />,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "approveStatus",
      key: "approveStatus",
      width: 80,
      align: "center",
      fixed: "right",
      render: (val: ShippingPlan["approveStatus"]) => <ApproveStatusTag value={val} />,
    },
  ];

  return (
    <div>
      <Card
        title={
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
              Phương án vận chuyển
            </span>

            <AddButton onOpenAdd={handleOpenAdd} />
          </div>
        }
        size="small"
        className="shadow-sm"
        styles={{
          header: { borderBottom: "1px solid #f0f0f0", paddingTop: 4, paddingBottom: 4 },
          body: { padding: 0, paddingTop: 1 },
        }}
      >
        <div className="flex flex-col h-60">
          <TableColumnConfig
            columns={cols}
            dataSource={data || []}
            itemName="phương án"
            tableKey={`shipping-plan-${purchase.id}`}
            loading={fetching}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="flex flex-col items-center gap-2">
                      <span>Chưa có phương án vận chuyển cho đơn hàng này</span>
                      {handleOpenAdd && (
                        <Button type="primary" size="small" onClick={handleOpenAdd}>
                          Thêm mới
                        </Button>
                      )}
                    </div>
                  }
                />
              ),
            }}
          />
        </div>
      </Card>

      <ShippingPlanAddUpdateModal
        open={open}
        editData={rowData}
        defaultData={{ purchaseId: purchase.id }}
        errors={errors}
        loading={creating || updating}
        onAdd={create}
        onEdit={update}
        onClose={pageAction.handleClose}
      />

      <ShippingPlanDetailModal open={openDetail} data={rowData} onClose={pageAction.handleClose} />
    </div>
  );
};
