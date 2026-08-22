import ContentTooltip from "../../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { FundTransactionTypeEnum } from "../../../../../constants/enum";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { IFundAdjustment } from "../../../../../models/fundAdjustment";
import { formatDateTimeDDMMYYYY } from "../../../../../utils/dateUtils";
import { formatMoney } from "../../../../../utils/formatNumber";

const FundAdjustmentTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { format, currentStore } = useClientData();
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
      title: "Quỹ thực hiện",
      dataIndex: ["fund", "name"],
      key: "fundName",
      width: 150,
    },
    {
      title: "Số dư hệ thống",
      dataIndex: "countedAmount",
      key: "countedAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Số dư thực tế",
      dataIndex: "expectedAmount",
      key: "expectedAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Chênh lệch",
      dataIndex: "deltaAmount",
      key: "deltaAmount",
      width: 150,
      align: "right",
      render: (value: number, record: IFundAdjustment) => (
        <span
          className={`${record.direction === FundTransactionTypeEnum.DECREASE ? "text-red-600" : "text-blue-500"}`}
        >
          {formatMoney(value)}
        </span>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 250,
      render: (reason: string) => <ContentTooltip content={reason} width={250} />,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 120,
      render: (note: string) => <ContentTooltip content={note} />,
    },
  ].filter(Boolean);

  if (!currentStore) {
    columns?.push({
      title: "Cửa hàng",
      dataIndex: ["fund", "store", "name"],
      key: "storeName",
      fixed: "right",
      width: 150,
    });
  }

  return (
    <TableColumnConfig
      columns={columns}
      dataSource={dataSource}
      itemName={"phiếu"}
      tableKey={"fund-adjustment-table"}
      pagination={pagination}
      {...rest}
    />
  );
};

export default FundAdjustmentTable;
