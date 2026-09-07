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

      returnGrossAmount: summaryData?.totalReturnGrossAmount || 0,
      returnDiscountAmount: summaryData?.totalReturnDiscountAmount || 0,
      returnTaxAmount: summaryData?.totalReturnTaxAmount || 0,
      returnTotalAmount: summaryData?.totalReturnTotalAmount || 0,

      grossAmount: summaryData?.totalGrossAmount || 0,
      discountAmount: summaryData?.totalDiscountAmount || 0,
      netAmount: summaryData?.totalNetAmount || 0,
      taxAmount: summaryData?.totalTaxAmount || 0,
      totalAmount: summaryData?.totalAmount || 0,

      settlementAmount: summaryData?.totalSettlementAmount || 0,

      paidAmount: summaryData?.totalPaidAmount || 0,
      customerPaidAmount: summaryData?.totalCustomerPaidAmount || 0,
      refundedAmount: summaryData?.totalRefundedAmount || 0,
      amountToRefund: summaryData?.totalAmountToRefund || 0,
      amountToCollect: summaryData?.totalAmountToCollect || 0,
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
        width: 100,
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
        width: 120,
        render: (value) => formatDateTimeDDMMYYYY(value),
      },
      {
        title: "Mã KH",
        key: "partnerCode",
        width: 80,
        render: (record) => {
          const partnerDisplay = record.partner?.code || record.partnerSnapshot?.code || "";
          return record.isSummary ? "" : partnerDisplay;
        },
      },
      {
        title: "Khách hàng",
        key: "partner",
        width: 120,
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
        hidden: true,
        render: (value) => formatMoney(value),
      },
      {
        title: "Giảm giá hàng trả",
        dataIndex: "returnDiscountAmount",
        key: "returnDiscountAmount",
        width: 120,
        align: "right",
        hidden: true,
        render: (value) => formatMoney(value),
      },
      {
        title: "VAT hàng trả",
        dataIndex: "returnTaxAmount",
        key: "returnTaxAmount",
        width: 120,
        align: "right",
        hidden: true,
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
        hidden: true,
        render: (value) => formatMoney(value),
      },
      {
        title: "Giảm giá hàng đổi",
        dataIndex: "discountAmount",
        key: "discountAmount",
        width: 120,
        align: "right",
        hidden: true,
        render: (value) => formatMoney(value),
      },
      {
        title: "VAT hàng đổi",
        dataIndex: "taxAmount",
        key: "taxAmount",
        width: 120,
        align: "right",
        hidden: true,
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
        title: "Doanh thu",
        key: "settlementAmount",
        width: 150,
        align: "right",
        render: (record: SaleReturn) => formatMoney(Number(record.settlementAmount || 0)),
      },
      {
        title: "Cần trả khách",
        dataIndex: "amountToRefund",
        key: "amountToRefund",
        width: 150,
        align: "right",
        render: (value) => <span className="text-red-600">{formatMoney(Number(value || 0))}</span>,
      },
      {
        title: "Cần thu thêm",
        dataIndex: "amountToCollect",
        key: "amountToCollect",
        width: 150,
        align: "right",
        render: (value) => (
          <span className="text-green-600">{formatMoney(Number(value || 0))}</span>
        ),
      },
      {
        title: "Đã hoàn khách",
        dataIndex: "refundedAmount",
        key: "refundedAmount",
        width: 150,
        align: "right",
        render: (value) => formatMoney(Number(value || 0)),
      },
      {
        title: "Khách thanh toán",
        dataIndex: "customerPaidAmount",
        key: "customerPaidAmount",
        width: 150,
        align: "right",
        render: (value) => formatMoney(Number(value || 0)),
      },
      {
        title: "Người hoàn thành",
        key: "completerName",
        width: 150,
        hidden: true,
        render: (record) => record.completer?.name || record.completerSnapshot?.name,
      },
      {
        title: "Thời điểm HT",
        dataIndex: "occurredAt",
        key: "occurredAt",
        width: 120,
        hidden: true,
        render: (value) => formatDateTimeDDMMYYYY(value),
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
