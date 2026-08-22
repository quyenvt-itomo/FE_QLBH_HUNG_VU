import UserImage from "../../../../../components/image/UserImage";
import ContentTooltip from "../../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { IPartner } from "../../../../../models/partner";
import { getMainImage } from "../../../../../utils/fileUtil";
import { formatMoney } from "../../../../../utils/formatNumber";

const SupplierTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { format } = useClientData();

  const columns: any = [
    {
      title: "Mã NCC",
      dataIndex: "code",
      key: "code",
      width: 200,
    },
    {
      title: "Tên NCC",
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
      title: "Nhóm NCC",
      dataIndex: ["group", "name"],
      key: "groupName",
      width: 150,
    },
    {
      title: "Nợ phải trả",
      dataIndex: "payableDebtAmount",
      key: "payableDebtAmount",
      width: 150,
      align: "right",
      render: (payableDebtAmount: number) => formatMoney(payableDebtAmount, format),
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
      itemName={"nhà cung cấp"}
      tableKey="supplier"
      pagination={pagination}
      {...rest}
    />
  );
};

export default SupplierTable;
