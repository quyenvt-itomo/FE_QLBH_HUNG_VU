import React, { useMemo } from "react";
import { Tag } from "antd";
import { TableColumnConfig, ObjectTableProps, ColumnsConfigType } from "@/shared/components";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { Purchase, OrderStatus, purchaseStatusMap } from "../purchase.model";
import { PurchaseStatusTag } from "./Tag";

interface Props extends ObjectTableProps {
  onViewDetail?: (record: Purchase) => void;
  isPurchaseReturn?: boolean;
}

export const PurchaseTable: React.FC<Props> = ({ onViewDetail, isPurchaseReturn = false, ...rest }) => {
  const columns: ColumnsConfigType<Purchase> = useMemo(
    () => [
      {
        title: isPurchaseReturn ? "Mã phiếu trả" : "Mã phiếu nhập",
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
        title: isPurchaseReturn ? "Ngày trả hàng" : "Ngày hoàn thành",
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
        title: "Tiền hàng",
        dataIndex: isPurchaseReturn ? "returnGrossAmount" : "grossAmount",
        key: "grossAmount",
        width: 140,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "Giảm giá",
        dataIndex: isPurchaseReturn ? "returnDiscountAmount" : "discountAmount",
        key: "discountAmount",
        width: 120,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "VAT",
        dataIndex: isPurchaseReturn ? "returnTaxAmount" : "taxAmount",
        key: "taxAmount",
        width: 120,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "Phí vận chuyển",
        dataIndex: "shippingAmount",
        key: "shippingAmount",
        width: 120,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "Tổng đơn",
        dataIndex: isPurchaseReturn ? "returnTotalAmount" : "totalAmount",
        key: "totalAmount",
        width: 150,
        align: "right",
        className: "font-semibold",
        render: (value) => formatMoney(value),
      },
      {
        title: isPurchaseReturn ? "Người xử lý" : "Người hoàn thành",
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
          <PurchaseStatusTag value={value} size="sm" variant="solid" isPurchaseReturn={isPurchaseReturn} />
        ),
      },
    ],
    [isPurchaseReturn, onViewDetail],
  );

  return (
    <TableColumnConfig
      columns={columns}
      itemName={isPurchaseReturn ? "phiếu trả hàng nhập" : "phiếu nhập"}
      hasStoreInfo
      tableKey={isPurchaseReturn ? "purchase-return-table" : "purchase-table"}
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
