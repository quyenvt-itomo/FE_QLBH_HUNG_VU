import ContentTooltip from "../../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { formatDateTimeDDMMYYYY } from "../../../../../utils/dateUtils";
import { formatMoney } from "../../../../../utils/formatNumber";

const DebtOffsetTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { currentStore } = useClientData();

  const summaryRow = {
    id: "summary",
    key: "Tổng",
    code: "Tổng",
    offsetAmount: summaryData?.totalOffsetAmount,
    isSummary: true,
  };

  const finalDataSource = dataSource?.length ? [summaryRow, ...dataSource] : dataSource;

  const columns: any = [
    {
      title: "Ngày",
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 200,
      render: (date: string) => formatDateTimeDDMMYYYY(date),
    },
    {
      title: "Số phiếu",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    !currentStore && {
      title: "Cửa hàng",
      dataIndex: ["store", "name"],
      key: "storeName",
      width: 200,
    },
    {
      title: "Đối tác thực hiện",
      dataIndex: ["partner", "name"],
      key: "partnerName",
      width: 200,
    },
    {
      title: "Nợ phải thu",
      dataIndex: "receivableDebtAmount",
      key: "receivableDebtAmount",
      width: 200,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Nợ phải trả",
      dataIndex: "payableDebtAmount",
      key: "payableDebtAmount",
      width: 200,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Giá trị đối trừ",
      dataIndex: "offsetAmount",
      key: "offsetAmount",
      width: 200,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 200,
      render: (reason: string) => <ContentTooltip content={reason} />,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      render: (note: string) => <ContentTooltip content={note} />,
    },
  ];
  return (
    <TableColumnConfig
      columns={columns}
      dataSource={finalDataSource}
      itemName={"phiếu"}
      hasSummary
      tableKey={`debt-offset-table-${currentStore ? `-store` : ""}`}
      pagination={pagination}
      {...rest}
    />
  );
};

export default DebtOffsetTable;
