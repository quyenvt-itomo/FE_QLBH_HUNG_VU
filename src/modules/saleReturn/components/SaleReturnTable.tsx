import React, { useMemo } from "react";
import { ColumnsConfigType, ObjectTableProps, TableColumnConfig } from "@/shared/components";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { SaleReturn, OrderStatus } from "../model";
import { SaleReturnStatusTag } from "./Tag";

interface Props extends ObjectTableProps {
  onViewDetail?: (record: SaleReturn) => void;
  isReturn?: boolean;
}

export const SaleReturnTable: React.FC<Props> = ({
  dataSource,
  summaryData,
  onViewDetail,
  ...rest
}) => {
  const formatedDataSource = useMemo(() => {
    const summaryRow = {
      id: "summary",
      code: "Tổng",
      grossAmount: summaryData?.totalGrossAmount || 0,
      discountAmount: summaryData?.totalDiscountAmount || 0,
      netAmount: summaryData?.totalNetAmount || 0,
      taxAmount: summaryData?.totalTaxAmount || 0,
      totalAmount: summaryData?.totalAmount || 0,
      returnTotalAmount: summaryData?.totalReturnAmount || 0,
      paidAmount: summaryData?.totalPaidAmount || 0,
      actualShippingFee: summaryData?.totalActualShippingFee || 0,
      isSummary: true,
    };

    return [summaryRow, ...(dataSource || [])];
  }, [dataSource, summaryData]);

  const columns: ColumnsConfigType<SaleReturn> = useMemo(
    () => [
      {
        title: "Mã đơn bán",
        key: "code",
        width: 150,
        fixed: "left",
        className: "font-mono",
        render: (record) =>
          record.isSummary ? (
            <span className="font-semibold">{record.code}</span>
          ) : (
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
        render: (record) => {
          const partnerDisplay = record.partner?.name || record.partnerSnapshot?.name || "Khách lẻ";
          return record.isSummary ? "" : partnerDisplay;
        },
      },
      {
        title: "Tiền hàng trả",
        dataIndex: "returnGrossAmount",
        key: "returnGrossAmount",
        width: 140,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "Giảm giá hàng trả",
        dataIndex: "returnDiscountAmount",
        key: "returnDiscountAmount",
        width: 120,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "VAT hàng trả",
        dataIndex: "returnTaxAmount",
        key: "returnTaxAmount",
        width: 120,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "Tổng tiền trả",
        dataIndex: "returnTotalAmount",
        key: "returnTotalAmount",
        width: 150,
        align: "right",
        className: "font-semibold",
        render: (value) => formatMoney(value),
      },
      {
        title: "Tiền hàng đổi",
        dataIndex: "grossAmount",
        key: "grossAmount",
        width: 140,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "Giảm giá hàng đổi",
        dataIndex: "discountAmount",
        key: "discountAmount",
        width: 120,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "VAT hàng đổi",
        dataIndex: "taxAmount",
        key: "taxAmount",
        width: 120,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "Tổng đơn đổi",
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 150,
        align: "right",
        className: "font-semibold",
        render: (value) => formatMoney(value),
      },
      {
        title: "Phí vận chuyển",
        dataIndex: "actualShippingFee",
        key: "actualShippingFee",
        width: 130,
        align: "right",
        render: (value) => formatMoney(value),
      },
      {
        title: "Cần trả khách",
        key: "settlementAmount",
        width: 150,
        align: "right",
        render: (record: SaleReturn) =>
          formatMoney(Math.max(0, Number(record.settlementAmount || 0))),
      },
      {
        title: "Đã hoàn khách",
        key: "paidAmount",
        width: 150,
        align: "right",
        render: (record: SaleReturn) => formatMoney(Number(record.paidAmount || 0)),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 100,
        align: "center",
        fixed: "right",
        render: (value: OrderStatus) => <SaleReturnStatusTag value={value} />,
      },
    ],
    [onViewDetail],
  );

  return (
    <TableColumnConfig
      dataSource={formatedDataSource}
      hasSummary
      columns={columns}
      itemName={"phiếu trả hàng"}
      hasStoreInfo
      tableKey={"sale-return-table"}
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
