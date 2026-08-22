import ContentTooltip from "../../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { formatDateTimeDDMMYYYY } from "../../../../../utils/dateUtils";
import { formatMoney } from "../../../../../utils/formatNumber";

const FundTransferTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { format } = useClientData();

  const columns: any = [
    {
      title: "Ngày",
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 100,
      render: (date: string) => formatDateTimeDDMMYYYY(date),
    },
    {
      title: "Số phiếu",
      dataIndex: "code",
      key: "code",
      width: 80,
    },
    {
      title: "Nội dung",
      dataIndex: "reason",
      key: "reason",
      width: 200,
      render: (reason: string) => <ContentTooltip content={reason} />,
    },
    {
      title: "Quỹ chuyển",
      dataIndex: ["fromFund", "name"],
      key: "fromFundName",
      width: 150,
    },
    {
      title: "Quỹ nhận",
      dataIndex: ["toFund", "name"],
      key: "toFundName",
      width: 150,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value, format),
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
      dataSource={dataSource}
      itemName={"phiếu"}
      tableKey="fund-transfer-table"
      pagination={pagination}
      {...rest}
    />
  );
};

export default FundTransferTable;
