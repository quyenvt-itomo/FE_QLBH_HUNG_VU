import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { formatMoney } from "../../../../../utils/formatNumber";

const ReportTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { format, currentStore } = useClientData();

  const summaryRow = {
    id: "summary",
    code: "Tổng",
    openingAmount: summaryData?.openingAmount || 0,
    increaseAmount: summaryData?.increaseAmount || 0,
    decreaseAmount: summaryData?.decreaseAmount || 0,
    closingAmount: summaryData?.closingAmount || 0,
    isSummary: true,
  };

  const finalDataSource = dataSource?.length ? [summaryRow, ...dataSource] : dataSource;

  const columns: any = [
    {
      title: "Mã quỹ",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "Tên quỹ",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Số dư đầu kỳ",
      dataIndex: "openingAmount",
      key: "openingAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Tăng trong kỳ",
      dataIndex: "increaseAmount",
      key: "increaseAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Giảm trong kỳ",
      dataIndex: "decreaseAmount",
      key: "decreaseAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Số dư cuối kỳ",
      dataIndex: "closingAmount",
      key: "closingAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
  ];

  if (!currentStore) {
    columns?.push({
      title: "Cửa hàng",
      dataIndex: ["store", "name"],
      key: "storeName",
      fixed: "right",
      width: 150,
    });
  }
  return (
    <TableColumnConfig
      columns={columns}
      dataSource={finalDataSource}
      itemName={"quỹ"}
      tableKey="fund-balance-report-table"
      pagination={pagination}
      hasSummary
      {...rest}
    />
  );
};

export default ReportTable;
