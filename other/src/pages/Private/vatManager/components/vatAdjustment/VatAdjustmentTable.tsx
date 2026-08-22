import ContentTooltip from "../../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { formatDateTimeDDMMYYYY } from "../../../../../utils/dateUtils";
import { formatMoney } from "../../../../../utils/formatNumber";

const VatAdjustmentTable: React.FC<ObjectTableProps> = ({
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
    totalAdjustmentAmount: summaryData?.totalAdjustmentAmount,
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
      title: "Giá trị hệ thống",
      dataIndex: "countedAmount",
      key: "countedAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Giá trị thực tế",
      dataIndex: "expectedAmount",
      key: "expectedAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Chênh lệch",
      dataIndex: "totalAdjustmentAmount",
      key: "totalAdjustmentAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Người thực hiện",
      dataIndex: ["adjustedBySnapshot", "name"],
      key: "adjustedByName",
      width: 200,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 200,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      render: (note: string) => <ContentTooltip content={note} />,
    },
  ].filter(Boolean);

  return (
    <TableColumnConfig
      columns={columns}
      dataSource={finalDataSource}
      hasSummary
      itemName={"phiếu"}
      tableKey={`debt-adjustment-table-${currentStore ? `-store` : ""}`}
      pagination={pagination}
      {...rest}
    />
  );
};

export default VatAdjustmentTable;
