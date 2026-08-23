import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import {
  PartnerDebtReport,
  PartnerDebtTransaction,
  PartnerDebtRefTypeEnum,
  partnerDebtRefTypeMap,
} from "../partnerDebtReport.model";
import { PaginationProps, SummaryData } from "@/shared/interfaces/api";
import { CLASSNAME } from "@/shared/constants/ui";
import { formatMoney } from "@/shared/utils/number.util";
import { formatDateDDMMYYYY } from "@/shared/utils/date.util";
import DateRangeFilter from "@/shared/components/button/DateRangeFilter";
import { PartnerCardLite } from "@/modules/partner";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import CustomPagination from "@/shared/components/CustomPagination";
import { RefTypeFilter } from "./RefTypeFilter";
import { DebtSideEnum, debtSideMap, TransactionType } from "@/shared/constants/enum";

interface Props {
  side: DebtSideEnum;
  partner?: PartnerDebtReport;
  dataSource: PartnerDebtTransaction[];
  summaryData?: SummaryData | null;
  pagination?: PaginationProps | null;
  setPage?: (page: number) => void;
  setSize?: (size: number) => void;
  open: boolean;
  startAt?: string;
  endAt?: string;
  refType?: PartnerDebtRefTypeEnum;
  setRefType?: (refType?: PartnerDebtRefTypeEnum) => void;
  onDateRangerChange?: (startAt?: string, endAt?: string) => void;
  onClose: () => void;
}

export const DetailPartnerDebtReportModal: React.FC<Props> = ({
  side,

  dataSource,
  partner,
  summaryData,
  pagination,
  setPage,
  setSize,
  endAt,
  startAt,
  onDateRangerChange,

  refType,
  setRefType,

  open,
  onClose,
}) => {
  const [data, setData] = useState<any[]>([]);

  const { isMobile } = useGlobalData();

  useEffect(() => {
    const formatData: any[] = [];

    // Đầu kỳ - sticky top
    formatData.push({
      index: "",
      key: "summary-beginning-balance",
      content: "Đầu kỳ",
      closingAmount: summaryData?.openingAmount || 0,
      isSummary: true,
      stickyPosition: "top",
    });

    dataSource.forEach((item, index) => {
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
      inAmount: summaryData?.inAmount || 0,
      outAmount: summaryData?.outAmount || 0,
      stickyPosition: "bottom",
      isSummary: true,
    });

    formatData.push({
      index: "",
      key: "summary-ending-balance",
      content: "Cuối kỳ",
      closingAmount: summaryData?.closingAmount || 0,
      stickyPosition: "bottom",
      isSummary: true,
    });

    setData(formatData);
  }, [dataSource, summaryData]);

  if (!partner) return null;

  const columns: any = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      fixed: isMobile ? undefined : "left",
      width: 50,
      ellipsis: true,
      className: "index-column",
    },
    {
      title: "Ngày",
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 150,
      ellipsis: true,
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
    <Modal
      title={`Chi tiết ${debtSideMap[side]} - ${partner?.name || ""}`}
      open={open}
      footer={null}
      destroyOnClose
      maskClosable={false}
      centered
      width={"100vw"}
      className="fullscreen-modal"
      onCancel={onClose}
    >
      <div className="flex flex-col h-full gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="w-full sm:w-96">
            <PartnerCardLite item={partner} />
          </div>
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
              onRangeChange={(startAt, endAt) => onDateRangerChange?.(startAt, endAt)}
            />
          </div>
        </div>

        <div className="flex flex-col h-[calc(100%-76px)] rounded-lg border overflow-hidden">
          <Table
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
              pagination === undefined ? (
                <></>
              ) : (
                <CustomPagination
                  pagination={pagination}
                  itemName={"bản ghi"}
                  length={data.length - 3}
                  showTotal={true}
                  setPage={setPage}
                  setSize={setSize}
                />
              )
            }
          />
        </div>
      </div>
    </Modal>
  );
};
