import UserImage from "../../../../../components/image/UserImage";
import ContentTooltip from "../../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { IPartner } from "../../../../../models/partner";
import { getMainImage } from "../../../../../utils/fileUtil";
import { formatMoney, formatQuantity } from "../../../../../utils/formatNumber";

const CustomerTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { format } = useClientData();

  const columns: any = [
    {
      title: "Mã khách hàng",
      dataIndex: "code",
      key: "code",
      width: 200,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (name: string, record: IPartner) => (
        <div className="flex items-center gap-2">
          <UserImage size={24} image={getMainImage(record.avatar)} />
          <span className="block truncate">{name}</span>
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 120,
    },
    {
      title: "Nhóm khách hàng",
      dataIndex: ["group", "name"],
      key: "groupName",
      width: 150,
    },
    {
      title: "Nợ phải thu",
      dataIndex: "receivableDebtAmount",
      key: "receivableDebtAmount",
      width: 150,
      align: "right",
      render: (receivableDebtAmount: number) => formatMoney(receivableDebtAmount, format),
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      width: 150,
      align: "right",
      render: (totalRevenue: number) => formatMoney(totalRevenue, format),
    },
    {
      title: "Điểm tích lũy",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
      width: 120,
      align: "right",
      render: (loyaltyPoints: number) => formatQuantity(loyaltyPoints, format),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 120,
      render: (note: string) => <ContentTooltip content={note} />,
    },
  ];
  return (
    <TableColumnConfig
      columns={columns}
      dataSource={dataSource}
      itemName={"khách hàng"}
      tableKey="customer"
      pagination={pagination}
      {...rest}
    />
  );
};

export default CustomerTable;
