import React, { useMemo } from "react";
import { Table } from "antd";
import { CustomPagination } from "@/shared/components";
import { PaginationProps, SummaryData } from "@/shared/interfaces/api";
import { CLASSNAME } from "@/shared/constants/ui";
import { TransactionType } from "@/shared/constants/enum";
import { formatDateDDMMYYYY, formatMoney, formatQuantity } from "@/shared/utils";
import {
  InventoryTransaction,
  InventoryTransactionRefType,
  inventoryTransactionRefTypeMap,
} from "../inventory.model";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

interface Props {
  loading?: boolean;
  dataSource: InventoryTransaction[];
  summaryData?: SummaryData | null;
  pagination?: PaginationProps | null;
  setPage?: (page: number) => void;
  setSize?: (size: number) => void;
}

interface TableRow extends InventoryTransaction {
  index: number | string;
  key: string;
  content: string;
  totalInQuantity?: number;
  totalInAmount?: number;
  totalOutQuantity?: number;
  totalOutAmount?: number;
  isSummary?: boolean;
  stickyPosition?: "top" | "bottom";
  closingQuantity?: number;
  closingAmount?: number;
}

export const InventoryTransactionTable: React.FC<Props> = ({
  loading,
  dataSource,
  summaryData,
  pagination,
  setPage,
  setSize,
}) => {
  const { isMobile } = useGlobalData();

  const data = useMemo<TableRow[]>(() => {
    const rows: TableRow[] = [
      {
        index: "",
        key: "summary-beginning-balance",
        content: "Đầu kỳ",
        closingQuantity: summaryData?.openingQuantity || 0,
        closingAmount: summaryData?.openingAmount || 0,
        isSummary: true,
        stickyPosition: "top",
      } as TableRow,
    ];

    dataSource.forEach((item, index) => {
      const isImport = item.type === TransactionType.IN;

      rows.push({
        ...item,
        index: index + 1,
        totalInQuantity: isImport ? item.quantity : 0,
        totalInAmount: isImport ? item.amount : 0,
        totalOutQuantity: !isImport ? item.quantity : 0,
        totalOutAmount: !isImport ? item.amount : 0,
        content:
          inventoryTransactionRefTypeMap[
            item.refType as InventoryTransactionRefType
          ] || item.refType,
        key: item.id,
        closingQuantity: item.closingQuantity,
        closingAmount: item.closingAmount,
      });
    });

    rows.push({
      index: "",
      key: "summary-in-out",
      content: "Tổng phát sinh",
      totalInQuantity: summaryData?.totalInQuantity || 0,
      totalInAmount: summaryData?.totalInAmount || 0,
      totalOutQuantity: summaryData?.totalOutQuantity || 0,
      totalOutAmount: summaryData?.totalOutAmount || 0,
      isSummary: true,
      stickyPosition: "bottom",
    } as TableRow);

    rows.push({
      index: "",
      key: "summary-ending-balance",
      content: "Cuối kỳ",
      closingQuantity: summaryData?.closingQuantity || 0,
      closingAmount: summaryData?.closingAmount || 0,
      isSummary: true,
      stickyPosition: "bottom",
    } as TableRow);

    return rows;
  }, [dataSource, summaryData]);

  const columns: any[] = useMemo(
    () => [
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
        title: "Số phiếu",
        dataIndex: "refCode",
        key: "refCode",
        width: 120,
      },
      {
        title: "Nội dung",
        dataIndex: "content",
        key: "content",
        width: 120,
      },
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
    ],
    [isMobile],
  );

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={data}
      className={`${CLASSNAME.table} double-floor`}
      pagination={false}
      tableLayout="fixed"
      scroll={{ x: "max-content", y: "max-content" }}
      rowKey="key"
      rowClassName={(record: TableRow) => {
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
            itemName="bản ghi"
            length={dataSource.length}
            showTotal
            setPage={setPage}
            setSize={setSize}
          />
        )
      }
    />
  );
};
