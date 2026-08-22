import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import CustomizeColumnDisplay from "./CustomizeColumnDisplay";
import HandleColumnSelector, { ColumnsConfigType } from "./handleColumnSelector";
import { TableProps } from "antd/lib";
import DropdownAction from "../dropdown/ActionMenu";
import { PaginationProps, SummaryData } from "../../models/base/api";
import NoData from "../display/NoData";
import CustomPagination from "../CustomPagination";
import ExpandIconButton from "../button/ExpandIconButton";
import { SorterResult } from "antd/es/table/interface";
import { CLASSNAME } from "../../constants/UI";
import { getInitialConfigColumns } from "./columnConfig";
import { handleCheckLockAction } from "../../utils/permissionUtils";
import { useClientData } from "../../hooks/core/useClientData";
import { OrderStatusEnum } from "../../constants/enum";

export interface TableColumnConfigProps extends Omit<TableProps, "pagination"> {
  columns: ColumnsConfigType;
  tableKey: string;
  dataSource: any[];
  loading: boolean;
  pagination?: PaginationProps | null;
  itemName: string;
  hasFilter?: boolean;
  detailTableColumns?: ColumnsConfigType;
  detailTableTitle?: string;
  actionWidth?: number | string;
  showTotal?: boolean;
  resize?: boolean;
  summaryData?: SummaryData | null;
  hasSummary?: boolean;
  dataLength?: number;
  setPage?: (page: number) => void;
  setSize?: (size: number) => void;
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  onCopy?: (record: any) => void;
  onUpdate?: (record: any) => void;
  onViewDetails?: (record: any) => void;
  onExportExcel?: (record: any) => void;
  onPrint?: (record: any) => void;
  onViewReport?: (record: any) => void;
  onViewInventory?: (record: any) => void;
  // hủy đơn, khôi phục đơn
  onCancel?: (record: any) => void;
  onRestore?: (record: any) => void;
  onSort?: (field: string | undefined, type: string | undefined) => void;
}

export interface ObjectTableProps extends Omit<
  TableColumnConfigProps,
  "columns" | "tableKey" | "itemName"
> {
  onApprove?: (record: any) => void;
  onShowProgress?: (record: any) => void;
}

const projectName = "QLCTXD";

const TableColumnConfig: React.FC<TableColumnConfigProps> = ({
  columns,
  tableKey,
  dataSource,
  loading,
  pagination,
  itemName,
  detailTableColumns,
  detailTableTitle,
  actionWidth = 60,
  showTotal = true,
  resize = false,
  className,
  hasSummary = false,
  dataLength,
  setPage,
  setSize,
  onEdit,
  onDelete,
  onCopy,
  onUpdate,
  onCancel,
  onRestore,
  onSort,
  onViewDetails,
  onExportExcel,
  onPrint,
  onViewReport,
  onViewInventory,
  ...rest
}) => {
  const fullTableKey = `${projectName}-${tableKey}`;
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [configColumns, setConfigColumns] = useState<ColumnsConfigType>(() =>
    getInitialConfigColumns(columns, fullTableKey),
  );
  const [finalColumns, setFinalColumns] = useState<TableColumnsType>([]);
  const { info } = useClientData();
  const length = dataSource?.length;
  const increasedLength = hasSummary ? 1 : 0;
  const hasRowExpandable = (record: any) =>
    (Array.isArray(record.children) && record.children.length > 0) ||
    (Array.isArray(record.details) && record.details.length > 0) ||
    (Array.isArray(record.items) && record.items.length > 0);
  const hasAnyExpandable = dataSource.some(
    (record, index) => !record.isSummary && hasRowExpandable(record),
  );

  const indexRen = (value: any, record: any, index: number) => {
    return record.isSummary
      ? ""
      : value !== undefined
        ? value
        : ((pagination?.currentPage || 1) - 1) * (pagination?.size || 20) +
            index +
            1 -
            increasedLength || "";
  };

  const getFinalColumns = (cols: ColumnsConfigType): TableColumnsType => {
    const baseColumns: TableColumnsType = [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        align: "center",
        fixed: "left",
        width: 50,
        ellipsis: true,
        className: "index-column",
        render: (value: any, record: any, index: number) => indexRen(value, record, index),
      },
      ...cols
        .filter((col) => !col.is_hide)
        .map((col, index) => ({
          ...col,
          ellipsis: true,
          onHeaderCell: () => {
            const headerProps: React.HTMLAttributes<any> = (col as any).onHeaderCell?.() || {};
            return {
              ...headerProps,
              width: col.width,
              onResize: handleResize(index),
            } as unknown as React.HTMLAttributes<any>;
          },
        })),
      {
        dataIndex: "action",
        key: "action",
        className: "action-column",
        fixed: "right",
        // align: "right",
        ellipsis: true,
        render(_: any, record: any) {
          const isLockAction = handleCheckLockAction(record, info);
          return (
            <div className="flex w-full min-w-[50px] justify-end">
              <div
                onClick={(e) => e.stopPropagation()}
                className="hover:text-white flex justify-center h-[32px]"
              >
                {(!onDelete &&
                  !onEdit &&
                  !onUpdate &&
                  !onCopy &&
                  !onViewDetails &&
                  !onCancel &&
                  !onRestore &&
                  !onExportExcel &&
                  !onPrint &&
                  !onViewReport &&
                  !onViewInventory) ||
                record.isChild ||
                record.isSummary ||
                (isLockAction && !onUpdate) ? (
                  <></>
                ) : (
                  <DropdownAction
                    onCopy={onCopy ? () => onCopy(record) : undefined}
                    onViewDetails={onViewDetails ? () => onViewDetails(record) : undefined}
                    onEdit={onEdit && !isLockAction ? () => onEdit(record) : undefined}
                    onDelete={onDelete && !isLockAction ? () => onDelete(record) : undefined}
                    onCancel={
                      onCancel && !isLockAction && record.status !== OrderStatusEnum.CANCELLED
                        ? () => onCancel(record)
                        : undefined
                    }
                    onRestore={
                      onRestore && !isLockAction && record.status === OrderStatusEnum.CANCELLED
                        ? () => onRestore(record)
                        : undefined
                    }
                    onExportExcel={onExportExcel ? () => onExportExcel(record) : undefined}
                    onPrint={onPrint ? () => onPrint(record) : undefined}
                    onViewReport={onViewReport ? () => onViewReport(record) : undefined}
                    onViewInventory={onViewInventory ? () => onViewInventory(record) : undefined}
                  />
                )}
              </div>
            </div>
          );
        },
      },
    ];

    // Add EXPAND_COLUMN at the beginning if has expandable data
    if (hasAnyExpandable && !detailTableColumns) {
      return [
        {
          title: "",
          dataIndex: "expand",
          key: "expand",
          align: "right",
          width: 32,
          className: "ant-table-cell-with-append",
        },
        ...baseColumns,
      ];
    }

    return baseColumns;
  };
  const handleResize =
    (index: number) =>
    (e: React.SyntheticEvent<Element>, { size }: { size: { width: number } }) => {
      setConfigColumns((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          width: size.width,
        };
        return next;
      });
    };

  // Sync configColumns with columns prop changes while preserving user settings AND order
  useEffect(() => {
    setConfigColumns((prevConfig) => {
      // First, update existing columns in their current order (preserving user's sort order)
      const updatedColumns = prevConfig
        .map((oldCol) => {
          const newCol = columns.find((c) => c.key === oldCol.key);
          if (newCol) {
            // Preserve user settings (is_hide, width, order) but update dynamic properties (render, title)
            return {
              ...newCol,
              is_hide: oldCol.is_hide,
              width: oldCol.width,
            };
          }
          return null; // Column no longer exists in new columns
        })
        .filter(Boolean); // Remove nulls

      // Then add any new columns that weren't in prevConfig
      const newColumns = columns.filter((col) => !prevConfig.find((c) => c.key === col.key));

      return [...updatedColumns, ...newColumns] as ColumnsConfigType;
    });
  }, [columns]);

  useEffect(() => {
    const cols = getFinalColumns(configColumns);
    setFinalColumns(cols);

    const openColumnKeys = configColumns.map((col) => ({
      key: col.key,
      is_hide: col.is_hide,
      width: col.width,
    }));

    localStorage.setItem(fullTableKey, JSON.stringify(openColumnKeys));
  }, [configColumns, info, dataSource, fullTableKey]);

  const onChange: TableProps<any>["onChange"] = (pagination, filters, sorter, extra) => {
    const { field, order } = sorter as SorterResult;
    onSort?.(
      field ? field.toString() : undefined,
      order ? order.replace("end", "").toUpperCase() : undefined,
    );
  };

  return (
    <div className="flex flex-col w-full h-full relative">
      <Table
        rowKey="key"
        columns={finalColumns}
        dataSource={dataSource.map((data, index) => ({
          ...data,
          key: data.id || data.key || `key-${index}`,
        }))}
        pagination={false}
        loading={loading}
        footer={() =>
          pagination === undefined ? (
            <></>
          ) : (
            <CustomPagination
              pagination={pagination}
              itemName={itemName}
              length={dataLength || length - increasedLength}
              showTotal={showTotal}
              setPage={setPage}
              setSize={setSize}
            />
          )
        }
        onChange={onChange}
        tableLayout="fixed"
        locale={{
          emptyText: (
            <div className="h-[calc(100vh-28rem)] flex items-center justify-center">
              <NoData />
            </div>
          ),
        }}
        expandable={
          hasAnyExpandable
            ? {
                expandIcon: (props) => {
                  const { record } = props;

                  if (record?.isSummary || !hasRowExpandable(record)) {
                    return <span style={{ display: "inline-block", width: 16 }} />;
                  }

                  return <ExpandIconButton {...props} />;
                },

                expandedRowKeys,
                onExpand: (expanded, record) => {
                  setExpandedRowKeys((prev) =>
                    expanded ? [...prev, record.key] : prev.filter((k) => k !== record.key),
                  );
                },

                ...(detailTableColumns
                  ? {
                      expandedRowRender: (record) => (
                        <div className="flex flex-col pl-8">
                          {/* {detailTableTitle && (
                            <div className="font-semibold mb-2">{detailTableTitle}</div>
                          )} */}
                          <div className="border p-1 pb-0 rounded-lg sub-table">
                            <Table
                              columns={detailTableColumns}
                              dataSource={record.children || record.details || record.items || []}
                              pagination={false}
                              rowKey="id"
                              size="small"
                              scroll={{ x: "max-content", y: "max-content" }}
                            />
                          </div>
                        </div>
                      ),
                    }
                  : {}),
              }
            : undefined
        }
        className={CLASSNAME.table + (className ? ` ${className}` : "")}
        scroll={{ x: "max-content", y: "max-content" }}
        rowClassName={(record: any) =>
          record.isSummary ? "summary-row font-semibold" : "cursor-pointer"
        }
        {...rest}
      />
      <CustomizeColumnDisplay
        title={"Tùy chỉnh cột hiển thị"}
        content={
          <HandleColumnSelector
            columns={configColumns}
            onConfigColumns={setConfigColumns}
            onResetColumns={() => setConfigColumns(columns)}
          />
        }
      />
    </div>
  );
};

export default TableColumnConfig;
