import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps, ColumnsConfigType } from "@/shared/components";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { Purchase, OrderStatus, purchaseReturnStatusMap } from "../purchase.model";
import { PurchaseStatusTag } from "./Tag";

interface Props extends ObjectTableProps {
  onViewDetail?: (record: Purchase) => void;
}

export const PurchaseReturnTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const columns: ColumnsConfigType<Purchase> = useMemo(
    () => [
      {
        title: "Mã phiếu trả",
        key: "code",
        width: 150,
        fixed: "left",
        className: "font-mono",
        render: (record) => (
          <button
            type="button"
            className="font-mono text-blue-600 hover:underline"
            onClick={(event) => {
              event.stopPropagation();
              onViewDetail?.(record);
            }}
          >
            {record.code}
          </button>
        ),
      },
      {
        title: "Ngày lập phiếu",
        dataIndex: "orderAt",
        key: "orderAt",
        width: 150,
        render: (value) => formatDateTimeDDMMYYYY(value),
      },
      {
        title: "Ngày trả hàng",
        dataIndex: "occurredAt",
        key: "occurredAt",
        width: 150,
        render: (value) => (value ? formatDateTimeDDMMYYYY(value) : "—"),
      },
      {
        title: "Nhà cung cấp",
        key: "partner",
        width: 220,
        render: (record) => record.partner?.name || record.partnerSnapshot?.name || "—",
      },
      {
        title: "Số hóa đơn",
        dataIndex: "invoiceNumber",
        key: "invoiceNumber",
        width: 140,
        render: (value) => value || "—",
      },
      {
        title: "Tiền hàng trả lại",
        dataIndex: "returnGrossAmount",
        key: "returnGrossAmount",
        width: 150,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "Giảm giá",
        dataIndex: "returnDiscountAmount",
        key: "returnDiscountAmount",
        width: 120,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "Thuế trả lại",
        dataIndex: "returnTaxAmount",
        key: "returnTaxAmount",
        width: 130,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "Tổng tiền trả lại",
        dataIndex: "returnTotalAmount",
        key: "returnTotalAmount",
        width: 160,
        align: "right",
        className: "font-semibold",
        render: (value) => formatMoney(value),
      },
      {
        title: "Người xử lý",
        key: "completer",
        width: 160,
        render: (record) => record.completer?.name || record.completerSnapshot?.name || "—",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 80,
        align: "center",
        fixed: "right",
        render: (value: OrderStatus) => (
          <PurchaseStatusTag value={value} size="sm" variant="solid" isPurchaseReturn />
        ),
      },
    ],
    [onViewDetail],
  );

  return (
    <TableColumnConfig
      columns={columns}
      itemName="phiếu trả hàng nhập"
      hasStoreInfo
      tableKey="purchase-return-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
