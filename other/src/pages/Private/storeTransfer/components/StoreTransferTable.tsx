import ContentTooltip from "../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../hooks/core/useClientData";
import { formatDateTimeDDMMYYYY } from "../../../../utils/dateUtils";

const StoreTransferTable: React.FC<ObjectTableProps> = ({
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
      width: 200,
      render: (date: string) => formatDateTimeDDMMYYYY(date),
    },
    {
      title: "Số phiếu",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Kho xuất",
      dataIndex: ["fromStore", "name"],
      key: "fromStoreName",
      width: 200,
    },
    {
      title: "Kho nhập",
      dataIndex: ["toStore", "name"],
      key: "toStoreName",
      width: 200,
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
      dataSource={dataSource}
      itemName={"phiếu"}
      tableKey="store-transfer-table"
      pagination={pagination}
      {...rest}
    />
  );
};

export default StoreTransferTable;
