import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import {
  InventoryReport,
  InventoryTransaction,
  InventoryTransactionRefTypeEnum,
  inventoryTransactionRefTypeMap,
} from "../inventory.model";
import { PaginationProps, SummaryData } from "@/shared/interfaces/api";
import { CLASSNAME, CSS } from "@/shared/constants/ui";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import DateRangeFilter from "@/shared/components/button/DateRangeFilter";
import { ProductCardLite } from "@/modules/product";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import CustomPagination from "@/shared/components/CustomPagination";
import { RefTypeFilter } from "./RefTypeFilter";
import { TransactionTypeEnum } from "@/shared/constants/enum";

interface Props {
  product?: InventoryReport;
  dataSource: InventoryTransaction[];
  summaryData?: SummaryData | null;
  pagination?: PaginationProps | null;
  setPage?: (page: number) => void;
  setSize?: (size: number) => void;
  open: boolean;
  startAt?: string;
  endAt?: string;
  refType?: InventoryTransactionRefTypeEnum;
  setRefType?: (refType?: InventoryTransactionRefTypeEnum) => void;
  onDateRangerChange?: (startAt?: string, endAt?: string) => void;
  onClose: () => void;
}

export const DetailInventoryReportModal: React.FC<Props> = ({
  dataSource,
  product,
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

  const { isMobile, filter } = useGlobalData();

  useEffect(() => {
    const formatData: any[] = [];

    // Đầu kỳ - sticky top
    formatData.push({
      index: "",
      key: "summary-beginning-balance",
      content: "Đầu kỳ",
      closingQuantity: summaryData?.openingQuantity || 0,
      closingAmount: summaryData?.openingAmount || 0,
      isSummary: true,
      stickyPosition: "top",
    });

    dataSource.forEach((item, index) => {
      const isImport = item.type === TransactionTypeEnum.IN;

      formatData.push({
        ...item,
        index: index + 1,
        totalInQuantity: isImport ? item.quantity : 0,
        totalInAmount: isImport ? item.amount : 0,
        totalOutQuantity: !isImport ? item.quantity : 0,
        totalOutAmount: !isImport ? item.amount : 0,
        content: inventoryTransactionRefTypeMap[item.refType] || item.refType,
        key: item.id,
        closingQuantity: item.closingQuantity,
        closingAmount: item.closingAmount,
      });
    });

    formatData.push({
      index: "",
      key: "summary-in-out",
      content: "Tổng phát sinh",
      totalInQuantity: summaryData?.totalInQuantity || 0,
      totalInAmount: summaryData?.totalInAmount || 0,
      totalOutQuantity: summaryData?.totalOutQuantity || 0,
      totalOutAmount: summaryData?.totalOutAmount || 0,
      stickyPosition: "bottom",
      isSummary: true,
    });

    formatData.push({
      index: "",
      key: "summary-ending-balance",
      content: "Cuối kỳ",
      closingQuantity: summaryData?.closingQuantity || 0,
      closingAmount: summaryData?.closingAmount || 0,
      stickyPosition: "bottom",
      isSummary: true,
    });

    setData(formatData);
  }, [dataSource, summaryData]);

  if (!product) return null;

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
      onHeaderCell: () => {
        const headerStyle = CSS.center_column.onHeaderCell().style;
        return {
          style: {
            ...headerStyle,
            borderLeftWidth: 0.5,
          },
        };
      },
      render: (value: string) => formatDateTimeDDMMYYYY(value),
    },
    {
      title: "Số phiếu",
      dataIndex: "refCode",
      key: "refCode",
      width: 120,
    },
    { title: "Nội dung", dataIndex: "content", key: "content", width: 120, ...CSS.center_column },

    {
      title: "Nhập",
      dataIndex: "in",
      key: "in",
      children: [
        {
          title: "Số lượng",
          dataIndex: "totalInQuantity",
          key: "totalInQuantity",
          width: 100,
          align: "right",
          render: (value: number) => formatQuantity(value),
        },
        {
          title: "Giá trị",
          dataIndex: "totalInAmount",
          key: "totalInAmount",
          width: 120,
          align: "right",
          render: (value: number) => formatMoney(value),
        },
      ],
    },
    {
      title: "Xuất",
      dataIndex: "out",
      key: "out",
      children: [
        {
          title: "Số lượng",
          dataIndex: "totalOutQuantity",
          key: "totalOutQuantity",
          width: 100,
          align: "right",
          render: (value: number) => formatQuantity(value),
        },
        {
          title: "Giá trị",
          dataIndex: "totalOutAmount",
          key: "totalOutAmount",
          width: 120,
          align: "right",
          render: (value: number) => formatMoney(value),
        },
      ],
    },
    {
      title: "Tồn",
      dataIndex: "closing",
      key: "closing",
      children: [
        {
          title: "Số lượng",
          dataIndex: "closingQuantity",
          key: "closingQuantity",
          width: 100,
          align: "right",
          render: (value: number) => formatQuantity(value),
        },
        {
          title: "Giá trị",
          dataIndex: "closingAmount",
          key: "closingAmount",
          width: 120,
          align: "right",
          render: (value: number) => formatMoney(value),
        },
      ],
    },
    {
      title: "Kho",
      dataIndex: ["warehouse", "name"],
      key: "warehouseName",
      width: 160,
      render: (value: string) => <span className="w-40 block truncate">{value}</span>,
    },
  ].filter(Boolean);

  return (
    <Modal
      title={`Chi tiết tồn kho - ${product?.name || ""}`}
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
            <ProductCardLite item={product} />
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
