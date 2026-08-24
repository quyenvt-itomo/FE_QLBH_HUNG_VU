import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components";
import { Purchase, paymentMethodMap } from "../purchase.model";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney, formatPercentage } from "@/shared/utils/number.util";
import { ColumnsConfigType } from "@/shared/components";
import { resolveByPath } from "@/shared/utils/common.util";
import { ApproveStatusTag } from "@/shared/components";
import { MediaDropdown } from "@/shared/components";
import { File } from "@/shared/interfaces/file";
import { EntityInfo } from "@/shared/components";
import { Progress } from "antd";

interface Props extends ObjectTableProps {
  onViewDetail?: (record: Purchase) => void;
  onConfirmComplete?: (record: Purchase) => void;
}

export const PurchaseTable: React.FC<Props> = ({ onViewDetail, onConfirmComplete, ...rest }) => {
  const cols: ColumnsConfigType<Purchase> = useMemo(
    () => [
      {
        title: "Số phiếu",
        key: "code",
        width: 140,
        className: "code-column font-mono",
        fixed: "left",
        render: (record: Purchase) => (
          <EntityInfo
            title={record.code}
            subTitle={formatDateTimeDDMMYYYY(record.orderedAt)}
            onClick={onViewDetail ? () => onViewDetail(record) : undefined}
          />
        ),
      },
      {
        title: "Nhà cung cấp",
        key: "supplierName",
        width: 200,
        render: (record: Purchase) => resolveByPath(record, ["supplier", "name"]) || "--",
      },
      {
        title: "Mã NCC",
        key: "supplierCode",
        width: 150,
        render: (record: Purchase) => resolveByPath(record, ["supplier", "code"]) || "--",
      },
      {
        title: "Nhóm NCC",
        dataIndex: ["supplier", "group", "name"],
        key: "supplierGroup",
        width: 150,
      },
      {
        title: "Dung sai",
        dataIndex: "toleranceRate",
        key: "toleranceRate",
        width: 80,
        align: "right",
        render: (v: number) => formatPercentage(v),
      },
      {
        title: "Giá trị hàng",
        dataIndex: "subTotal",
        key: "subTotal",
        width: 150,
        align: "right",
        render: (v: number) => formatMoney(v),
      },
      {
        title: "Tổng VAT",
        dataIndex: "taxAmount",
        key: "taxAmount",
        width: 100,
        align: "right",
        render: (v: number) => formatMoney(v),
      },
      {
        title: "Tổng tiền",
        dataIndex: "totalAmount",
        key: "total",
        width: 150,
        align: "right",
        render: (v: number) => formatMoney(v),
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
        title: "Người bán",
        key: "sellerName",
        width: 120,
        className: "yellow-column",
        render: (record: Purchase) => (
          <EntityInfo
            title={resolveByPath(record, ["seller", "name"])}
            subTitle={resolveByPath(record, ["seller", "phone"])}
          />
        ),
      },
      {
        title: "Hoa hồng",
        dataIndex: "totalCommissionAmount",
        key: "totalCommissionAmount",
        width: 120,
        align: "right",
        render: (v: number) => formatMoney(v),
      },
      {
        title: "NV mua hàng",
        key: "staffName",
        width: 120,
        render: (record: Purchase) => (
          <EntityInfo
            title={resolveByPath(record, ["staff", "name"])}
            subTitle={resolveByPath(record, ["staff", "code"])}
          />
        ),
      },
      {
        title: "Thanh toán",
        dataIndex: "paymentMethod",
        key: "payment",
        width: 120,
        render: (v: string) =>
          v ? paymentMethodMap[v as keyof typeof paymentMethodMap] || v : "--",
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        width: 150,
        render: (v: string) => v || "--",
      },
      {
        title: "Tiến độ giao hàng",
        key: "progress",
        width: 150,
        align: "center",
        fixed: "right",
        render: (record: Purchase) => {
          if (record.isCompleted)
            return (
              <div className="flex flex-col items-center text-xs">
                <span className="text-primary">Đã hoàn thành</span>
                <span className="text-gray-400">{formatDateTimeDDMMYYYY(record.completedAt)}</span>
              </div>
            );

          const totalQuantity =
            record.lines?.reduce((sum, line) => sum + (line.quantity || 0), 0) || 0;
          const totalDeliveredQuantity =
            record.lines?.reduce((sum, line) => sum + (line.deliveredQuantity || 0), 0) || 0;
          return (
            <Progress
              percent={totalQuantity > 0 ? (totalDeliveredQuantity / totalQuantity) * 100 : 0}
              size="small"
              showInfo={false}
              strokeColor="#1890ff"
            />
          );
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "approveStatus",
        key: "approveStatus",
        width: 80,
        align: "center",
        fixed: "right",
        render: (val: Purchase["approveStatus"]) => <ApproveStatusTag value={val} />,
      },
    ],
    [onViewDetail],
  );

  return (
    <TableColumnConfig
      columns={cols}
      itemName="đơn mua"
      tableKey="purchase-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
