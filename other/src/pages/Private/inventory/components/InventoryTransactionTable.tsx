import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../hooks/core/useClientData";
import { formatDateTimeDDMMYYYY } from "../../../../utils/dateUtils";
import { formatQuantity, formatMoney } from "../../../../utils/formatNumber";
import { useEffect, useMemo, useState } from "react";
import { inventoryRefTypeMap, InventoryTransactionTypeEnum } from "../../../../constants/enum";
import { CLASSNAME, CSS } from "../../../../constants/UI";
import { IProductVariant } from "../../../../models/product";
import { getFullVariantOptionContent } from "../../../../utils/common";
import { IInventoryTransaction } from "../../../../models/store/inventory";
import { Table } from "antd";
import CustomPagination from "../../../../components/CustomPagination";
import { PaginationProps } from "../../../../models/base/api";

interface Props extends ObjectTableProps {
  hasVariant?: boolean;
  pagination?: PaginationProps | null;
  setPage?: (page: number) => void;
  setSize?: (size: number) => void;
}
const InventoryTransactionTable: React.FC<Props> = ({
  dataSource,
  summaryData,
  hasVariant,
  pagination,
  setPage,
  setSize,
}) => {
  const { currentStore } = useClientData();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const formatData: any[] = [];

    // Đầu kỳ - sticky top
    formatData.push({
      index: "",
      key: "summary-beginning-balance",
      content: "Đầu kỳ",
      closingQty: summaryData?.openingQty || 0,
      closingAmount: summaryData?.openingAmount || 0,
      isSummary: true,
      stickyPosition: "top",
    });

    // Giao dịch - dùng closingQty/closingAmount từ BE (đã tính sẵn)
    dataSource.forEach((item: IInventoryTransaction, index: number) => {
      const isImport = item.type === InventoryTransactionTypeEnum.IN;

      formatData.push({
        ...item,
        index: index + 1,
        totalInQty: isImport ? item.quantity : 0,
        totalInAmount: isImport ? item.amount : 0,
        totalOutQty: !isImport ? item.quantity : 0,
        totalOutAmount: !isImport ? item.amount : 0,
        content: inventoryRefTypeMap[item.refType] || item.refType,
        key: item.id,
        closingQty: item.closingQty,
        closingAmount: item.closingAmount,
      });
    });

    // Pagination row - nằm GIỮA transactions và summary
    formatData.push({
      index: "",
      key: "pagination-row",
      isPaginationRow: true,
    });

    // Tổng phát sinh - sticky bottom
    formatData.push({
      index: "",
      key: "summary-in-out",
      isSummary: true,
      content: "Tổng phát sinh",
      totalInQty: summaryData?.totalInQty || 0,
      totalInAmount: summaryData?.totalInAmount || 0,
      totalOutQty: summaryData?.totalOutQty || 0,
      totalOutAmount: summaryData?.totalOutAmount || 0,
      stickyPosition: "bottom",
    });

    // Cuối kỳ - sticky bottom
    formatData.push({
      index: "",
      key: "summary-ending-balance",
      isSummary: true,
      content: "Cuối kỳ",
      closingQty: summaryData?.closingQty || 0,
      closingAmount: summaryData?.closingAmount || 0,
      stickyPosition: "bottom",
    });

    setData(formatData);
  }, [dataSource, summaryData]);

  // Tính số cột (leaf columns) cho colSpan của pagination row
  const leafColumnCount = useMemo(() => {
    let count = 5; // STT, Ngày, Số phiếu, Nội dung + Nhập(2) + Xuất(2) + Tồn(2) = actually let me recount
    // STT(1) + Ngày(1) + Số phiếu(1) + Nội dung(1) + Nhập.SL(1) + Nhập.GT(1) + Xuất.SL(1) + Xuất.GT(1) + Tồn.SL(1) + Tồn.GT(1)
    count = 10;
    if (hasVariant) count += 1;
    if (!currentStore) count += 1;
    return count;
  }, [hasVariant, currentStore]);

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
      render: (value: any, record: any) => {
        if (record.isPaginationRow) return { props: { colSpan: 0 } };
        return value;
      },
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
      render: (value: string, record: any) => {
        if (record.isPaginationRow) {
          return {
            children: (
              <div className="px-2 pb-1">
                <CustomPagination
                  pagination={pagination}
                  itemName="bản ghi"
                  length={dataSource.length}
                  showTotal={false}
                  setPage={setPage}
                  setSize={setSize}
                />
              </div>
            ),
            props: { colSpan: leafColumnCount },
          };
        }
        return formatDateTimeDDMMYYYY(value);
      },
    },
    {
      title: "Số phiếu",
      dataIndex: "refCode",
      key: "refCode",
      width: 120,
      ...CSS.center_column,
      render: (value: string, record: any) => {
        if (record.isPaginationRow) return { props: { colSpan: 0 } };
        return value;
      },
    },
    hasVariant && {
      title: "Mẫu mã",
      dataIndex: "productVariant",
      key: "productVariant",
      width: 120,
      ...CSS.center_column,
      render: (value: IProductVariant, record: any) => {
        if (record.isPaginationRow) return { props: { colSpan: 0 } };
        return <span className="w-32 block truncate">{getFullVariantOptionContent(value)}</span>;
      },
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: 120,
      ...CSS.center_column,
      render: (value: string, record: any) => {
        if (record.isPaginationRow) return { props: { colSpan: 0 } };
        return value;
      },
    },

    {
      title: "Nhập",
      dataIndex: "in",
      key: "in",
      ...CSS.center_column,
      children: [
        {
          title: "Số lượng",
          dataIndex: "totalInQty",
          key: "totalInQty",
          width: 100,
          align: "right",
          ...CSS.center_column,
          render: (value: number, record: any) => {
            if (record.isPaginationRow) return { props: { colSpan: 0 } };
            return formatQuantity(value);
          },
        },
        {
          title: "Giá trị",
          dataIndex: "totalInAmount",
          key: "totalInAmount",
          width: 120,
          align: "right",
          ...CSS.center_column,
          render: (value: number, record: any) => {
            if (record.isPaginationRow) return { props: { colSpan: 0 } };
            return formatMoney(value);
          },
        },
      ],
    },
    {
      title: "Xuất",
      dataIndex: "out",
      key: "out",
      ...CSS.center_column,
      children: [
        {
          title: "Số lượng",
          dataIndex: "totalOutQty",
          key: "totalOutQty",
          width: 100,
          align: "right",
          ...CSS.center_column,
          render: (value: number, record: any) => {
            if (record.isPaginationRow) return { props: { colSpan: 0 } };
            return formatQuantity(value);
          },
        },
        {
          title: "Giá trị",
          dataIndex: "totalOutAmount",
          key: "totalOutAmount",
          width: 120,
          align: "right",
          ...CSS.center_column,
          render: (value: number, record: any) => {
            if (record.isPaginationRow) return { props: { colSpan: 0 } };
            return formatMoney(value);
          },
        },
      ],
    },
    {
      title: "Tồn",
      dataIndex: "closing",
      key: "closing",
      ...CSS.center_column,
      children: [
        {
          title: "Số lượng",
          dataIndex: "closingQty",
          key: "closingQty",
          width: 100,
          align: "right",
          ...CSS.center_column,
          render: (value: number, record: any) => {
            if (record.isPaginationRow) return { props: { colSpan: 0 } };
            return formatQuantity(value);
          },
        },
        {
          title: "Giá trị",
          dataIndex: "closingAmount",
          key: "closingAmount",
          width: 120,
          align: "right",
          ...CSS.center_column,
          render: (value: number, record: any) => {
            if (record.isPaginationRow) return { props: { colSpan: 0 } };
            return formatMoney(value);
          },
        },
      ],
    },
    !currentStore && {
      title: "Kho/ Cửa hàng",
      dataIndex: ["store", "name"],
      key: "storeName",
      width: 160,
      render: (value: string, record: any) => {
        if (record.isPaginationRow) return { props: { colSpan: 0 } };
        return <span className="w-40 block truncate">{value}</span>;
      },
      ...CSS.center_column,
    },
  ].filter(Boolean);

  return (
    <Table
      columns={columns}
      dataSource={data}
      className={CLASSNAME.table + " double-floor inventory-transaction-table"}
      pagination={false}
      tableLayout="fixed"
      scroll={{
        x: "max-content",
        y: "max-content",
      }}
      rowClassName={(record: any) => {
        if (record.isPaginationRow) return "pagination-row sticky-bottom-row";
        if (record.stickyPosition === "top") return "summary-row sticky-top-row";
        if (record.stickyPosition === "bottom") return "summary-row sticky-bottom-row";
        if (record.isSummary) return "summary-row";
        return "cursor-pointer";
      }}
    />
  );
};

export default InventoryTransactionTable;
