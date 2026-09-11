import { usePageState } from "@/shared/hooks";
import {
  PartnerDebtRefType,
  partnerDebtRefTypeMap,
  PartnerDebtReport as PartnerDebtReportRow,
} from "../partnerDebtReport.model";
import { CLASSNAME, DebtSide, TransactionType } from "@/shared/constants";
import { useEffect, useState } from "react";
import { Partner } from "@/modules/partner/partner.model";
import { usePartnerDebtReportStore } from "../partnerDebtReport.store";
import { CustomPagination, DateRangeFilter } from "@/shared/components";
import { Table } from "antd";
import { RefTypeFilter } from "../components";
import { formatDateDDMMYYYY, formatMoney } from "@/shared/utils";

interface PartnerDebtReportProps {
  partner?: Partner;
  side?: DebtSide;
}
const DebtReport: React.FC<PartnerDebtReportProps> = ({ partner, side = DebtSide.RECEIVABLE }) => {
  const {
    keyword,
    page,
    size,
    startAt,
    endAt,
    filter,
    reload,
    sortBy,
    sortOrder,
    ranger,
    setPage,
    setSize,
    pageAction,
  } = usePageState<PartnerDebtReportRow>();
  const [refType, setRefType] = useState<PartnerDebtRefType | undefined>();
  const [data, setData] = useState<any[]>([]);

  const { loading, transactions, transactionSummary, transactionPagination } =
    usePartnerDebtReportStore({
      keyword,
      page,
      size,
      reload,
      startAt,
      endAt,
      sortBy,
      sortOrder,
      isLockedReport: true,
      isLockedTransaction: !partner,
      partnerId: partner?.id,
      refType,
      side,
      ...filter,
      ...ranger,
    });

  useEffect(() => {
    const formatData: any[] = [];

    // Đầu kỳ - sticky top
    formatData.push({
      index: "",
      key: "summary-beginning-balance",
      content: "Đầu kỳ",
      closingAmount: transactionSummary?.openingAmount || 0,
      isSummary: true,
      stickyPosition: "top",
    });

    transactions.forEach((item, index) => {
      const isImport = item.type === TransactionType.IN;

      formatData.push({
        ...item,
        index: index + 1,
        inAmount: isImport ? item.amount : 0,
        outAmount: !isImport ? item.amount : 0,
        content: partnerDebtRefTypeMap[item.refType] || item.refType,
        key: item.id,
        closingAmount: item.closingAmount,
      });
    });

    formatData.push({
      index: "",
      key: "summary-in-out",
      content: "Tổng phát sinh",
      inAmount: transactionSummary?.inAmount || 0,
      outAmount: transactionSummary?.outAmount || 0,
      stickyPosition: "bottom",
      isSummary: true,
    });

    formatData.push({
      index: "",
      key: "summary-ending-balance",
      content: "Cuối kỳ",
      closingAmount: transactionSummary?.closingAmount || 0,
      stickyPosition: "bottom",
      isSummary: true,
    });

    setData(formatData);
  }, [transactions, transactionSummary]);

  const columns: any = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      fixed: "left",
      width: 50,
      ellipsis: true,
      className: "index-column",
    },
    {
      title: "Ngày",
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 100,
      ellipsis: true,
      fixed: "left",
      render: (value: string) => formatDateDDMMYYYY(value),
    },
    {
      title: "Loại chứng từ",
      dataIndex: "content",
      key: "content",
      width: 120,
    },
    {
      title: "Số chứng từ",
      dataIndex: "refCode",
      key: "refCode",
      width: 120,
    },

    {
      title: "Tăng",
      dataIndex: "inAmount",
      key: "inAmount",
      width: 120,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Giảm",
      dataIndex: "outAmount",
      key: "outAmount",
      width: 120,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Nợ còn lại",
      dataIndex: "closingAmount",
      key: "closingAmount",
      width: 120,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
  ].filter(Boolean);

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-primary">LỌC THEO</span>
          {/* Ref type Filter */}
          <RefTypeFilter refType={refType} setRefType={setRefType} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-primary">THỜI GIAN THỰC HIỆN</span>
          <DateRangeFilter
            startDate={startAt}
            endDate={endAt}
            onRangeChange={pageAction.handleDateRangerChange}
          />
        </div>
      </div>

      <div className="flex flex-col h-[calc(100%-76px)] rounded-lg border overflow-hidden">
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          className={CLASSNAME.table + " double-floor"}
          pagination={false}
          tableLayout="fixed"
          scroll={{
            x: "max-content",
            y: "max-content",
          }}
          rowKey="key"
          rowClassName={(record: any) => {
            if (record.stickyPosition === "top") return "summary-row sticky-top-row";
            if (record.stickyPosition === "bottom") return "summary-row sticky-bottom-row";
            if (record.isSummary) return "summary-row";
            return "cursor-pointer";
          }}
          footer={() =>
            transactionPagination === undefined ? (
              <></>
            ) : (
              <CustomPagination
                pagination={transactionPagination}
                itemName={"bản ghi"}
                length={transactions.length - 3}
                showTotal={true}
                setPage={setPage}
                setSize={setSize}
              />
            )
          }
        />
      </div>
    </div>
  );
};

export const ReceivableDebtReport: React.FC<{ partner?: Partner }> = ({ partner }) => (
  <DebtReport partner={partner} side={DebtSide.RECEIVABLE} />
);

export const PayableDebtReport: React.FC<{ partner?: Partner }> = ({ partner }) => (
  <DebtReport partner={partner} side={DebtSide.PAYABLE} />
);
