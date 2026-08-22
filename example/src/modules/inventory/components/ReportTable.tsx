import { ObjectTableProps, TableColumnConfig, ColumnsConfigType } from "@/shared/components/table";
import { InventoryReport } from "../inventory.model";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { useMemo } from "react";

interface DataType extends Partial<InventoryReport> {
  children?: Partial<DataType>[];
  index?: string;
  key: string;
}

export const ReportTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const summaryRow = {
    id: "summary",
    code: "Tổng",
    openingQuantity: summaryData?.openingQuantity || 0,
    openingAmount: summaryData?.openingAmount || 0,
    inQuantity: summaryData?.inQuantity || 0,
    inAmount: summaryData?.inAmount || 0,
    outQuantity: summaryData?.outQuantity || 0,
    outAmount: summaryData?.outAmount || 0,
    closingQuantity: summaryData?.closingQuantity || 0,
    closingAmount: summaryData?.closingAmount || 0,
    isSummary: true,
  };

  const formatData = (dataSource: InventoryReport[]) => {
    const formattedData: DataType[] = [];

    dataSource.forEach((item) => {
      const children: Partial<DataType>[] = [];

      formattedData.push({
        ...item,
        key: item.id,
        children: children.length > 0 ? children : undefined,
      });
    });

    return formattedData;
  };

  const formattedData = formatData(dataSource);

  const finalDataSource = dataSource?.length ? [summaryRow, ...formattedData] : formattedData;

  const columns: ColumnsConfigType<InventoryReport> = useMemo(
    () => [
      {
        title: "Mã hàng",
        dataIndex: "code",
        key: "code",
        width: 100,
        fixed: "left",
      },
      {
        title: "Tên hàng",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        width: 150,
      },
      {
        title: "ĐVT",
        dataIndex: ["unit", "name"],
        key: "unit",
        width: 80,
      },
      {
        title: "Tồn đầu kỳ",
        dataIndex: "opening",
        key: "opening",
        width: 150,
        children: [
          {
            title: "Số lượng",
            dataIndex: "openingQuantity",
            key: "openingQuantity",
            width: 100,
            align: "right",
            render: (value: number) => formatQuantity(value),
          },
          {
            title: "Giá trị",
            dataIndex: "openingAmount",
            key: "openingAmount",
            width: 100,
            align: "right",
            render: (value: number) => formatMoney(value),
          },
        ],
      },
      {
        title: "Nhập trong kỳ",
        dataIndex: "in",
        key: "in",
        children: [
          {
            title: "Số lượng",
            dataIndex: "inQuantity",
            key: "inQuantity",
            width: 100,
            align: "right",
            render: (value: number) => formatQuantity(value),
          },
          {
            title: "Giá trị",
            dataIndex: "inAmount",
            key: "inAmount",
            width: 100,
            align: "right",
            render: (value: number) => formatMoney(value),
          },
        ],
      },
      {
        title: "Xuất trong kỳ",
        dataIndex: "out",
        key: "out",
        children: [
          {
            title: "Số lượng",
            dataIndex: "outQuantity",
            key: "outQuantity",
            width: 100,
            align: "right",
            render: (value: number) => formatQuantity(value),
          },
          {
            title: "Giá trị",
            dataIndex: "outAmount",
            key: "outAmount",
            width: 100,
            align: "right",
            render: (value: number) => formatMoney(value),
          },
        ],
      },
      {
        title: "Tồn cuối kỳ",
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
            width: 100,
            align: "right",
            render: (value: number) => formatMoney(value),
          },
        ],
      },
    ],
    [],
  );
  return (
    <TableColumnConfig
      columns={columns}
      dataSource={finalDataSource}
      itemName={"hàng hóa"}
      tableKey="inventory-report-table"
      pagination={pagination}
      hasSummary
      showCreator={false}
      showUpdater={false}
      className="double-floor"
      {...rest}
    />
  );
};
