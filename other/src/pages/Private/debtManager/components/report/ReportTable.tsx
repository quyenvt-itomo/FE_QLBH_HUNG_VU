import UserImage from "../../../../../components/image/UserImage";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { PartnerTypeEnum, partnerTypeMap } from "../../../../../constants/enum";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { IDebtReport } from "../../../../../models/store/debt";
import { getMainImage } from "../../../../../utils/fileUtil";
import { formatMoney } from "../../../../../utils/formatNumber";

const ReportTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { format } = useClientData();

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
      title: "Mã đối tác",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "Tên đối tác",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (name: string, record: IDebtReport) =>
        name ? (
          <div className="flex items-center gap-2">
            <UserImage size={24} image={getMainImage(record.avatar)} />
            <span className="block truncate">{name}</span>
          </div>
        ) : (
          <></>
        ),
    },
    {
      title: "Tồn đầu kỳ",
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
      title: "Tồn cuối kỳ",
      dataIndex: "closingAmount",
      key: "closingAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value, format),
    },
    {
      title: "Phân loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: PartnerTypeEnum) => partnerTypeMap[type],
    },
    {
      title: "Nhóm",
      dataIndex: ["group", "name"],
      key: "groupName",
      width: 120,
    },
  ];
  return (
    <TableColumnConfig
      columns={columns}
      dataSource={finalDataSource}
      itemName={"đối tác"}
      tableKey="debt-report-table"
      pagination={pagination}
      hasSummary
      {...rest}
    />
  );
};

export default ReportTable;
