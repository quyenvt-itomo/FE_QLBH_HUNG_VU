import React, { useMemo } from "react";
import { ColumnsConfigType, ObjectTableProps, TableColumnConfig } from "@/shared/components";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { Sale, OrderStatus } from "../model";
import { SaleStatusTag } from "./Tag";

interface Props extends ObjectTableProps {
  onViewDetail?: (record: Sale) => void;
  isReturn?: boolean;
}

export const SaleTable: React.FC<Props> = ({ onViewDetail, isReturn = false, ...rest }) => {
  const columns: ColumnsConfigType<Sale> = useMemo(
    () => [
      ...(isReturn
        ? [{
            title: "Đơn bán gốc",
            key: "refOrder",
            width: 140,
            render: (record: Sale) => (record as any).refOrder?.code || (record as any).refOrderId || "—",
          }]
        : []),
      {
        title: "Mã đơn bán",
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
        title: "Ngày bán",
        dataIndex: "orderAt",
        key: "orderAt",
        width: 150,
        render: (value) => formatDateTimeDDMMYYYY(value),
      },
      {
        title: "Khách hàng",
        key: "partner",
        width: 220,
        render: (record) => record.partner?.name || record.partnerSnapshot?.name || "Khách lẻ",
      },
      {
        title: isReturn ? "Tiền hàng trả" : "Tiền hàng",
        dataIndex: "grossAmount",
        key: "grossAmount",
        width: 140,
        align: "right",
        render: (value, record) => formatMoney(isReturn ? record.returnGrossAmount : value),
      },
      {
        title: "Giảm giá",
        dataIndex: "discountAmount",
        key: "discountAmount",
        width: 120,
        align: "right",
        render: (value, record) => formatMoney(isReturn ? record.returnDiscountAmount : value),
      },
      {
        title: "VAT",
        dataIndex: "taxAmount",
        key: "taxAmount",
        width: 120,
        align: "right",
        render: (value, record) => formatMoney(isReturn ? record.returnTaxAmount : value),
      },
      {
        title: "Phí vận chuyển",
        dataIndex: "shippingFee",
        key: "shippingFee",
        width: 130,
        align: "right",
        render: (value, record) =>
          !value ? "—" : record.isFreeShipping ? <span className="line-through text-gray-400">{formatMoney(value)}</span> : formatMoney(value),
      },
      {
        title: isReturn ? "Tổng tiền trả" : "Tổng đơn",
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 150,
        align: "right",
        className: "font-semibold",
        render: (value, record) => formatMoney(isReturn ? record.returnTotalAmount : value),
      },
      {
        title: isReturn ? "Đã hoàn khách" : "Khách thanh toán",
        key: "paidAmount",
        width: 150,
        align: "right",
        render: (record) =>
          formatMoney(
            (record.incomeExpenses || []).reduce(
              (total, item) => total + Math.max(0, Number(item.amount || 0)),
              0,
            ),
          ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 120,
        align: "center",
        fixed: "right",
        render: (value: OrderStatus) => <SaleStatusTag value={value} isReturn={isReturn} />,
      },
    ],
    [isReturn, onViewDetail],
  );

  return (
    <TableColumnConfig
      columns={columns}
      itemName={isReturn ? "phiếu trả hàng" : "đơn bán"}
      hasStoreInfo
      tableKey={isReturn ? "sale-return-table" : "sale-table"}
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
