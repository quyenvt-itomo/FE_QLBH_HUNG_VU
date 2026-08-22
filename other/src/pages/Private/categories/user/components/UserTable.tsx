import UserImage from "../../../../../components/image/UserImage";
import ContentTooltip from "../../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { IUser } from "../../../../../models/user";
import { getMainImage } from "../../../../../utils/fileUtil";

const UserTable: React.FC<ObjectTableProps> = ({ ...rest }) => {
  const { currentStore } = useClientData();

  const columns: any = [
    {
      title: "Mã người dùng",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (name: string, record: IUser) => (
        <div className="flex items-center gap-2">
          <UserImage size={24} image={getMainImage(record.avatar || [])} />
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
      width: 150,
    },
    {
      title: "Nhân viên",
      dataIndex: ["employee", "name"],
      key: "employeeName",
      width: 150,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    currentStore
      ? {
          title: "Vai trò cửa hàng",
          dataIndex: "storeUsers",
          key: "storeUsers",
          width: 150,
          render: (storeUsers: IUser["storeUsers"]) => {
            const storeUser = storeUsers?.find((su) => su.storeId === currentStore.id);
            return storeUser ? storeUser.role?.name : "-";
          },
        }
      : {
          title: "Vai trò hệ thống",
          dataIndex: ["systemRole", "name"],
          key: "systemRoleName",
          width: 150,
        },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 300,
      render: (note: string) => <ContentTooltip width={300} content={note} />,
    },
  ];
  return (
    <TableColumnConfig
      columns={columns}
      itemName={"người dùng"}
      tableKey={"user-table" + (currentStore ? `-store` : "")}
      {...rest}
    />
  );
};

export default UserTable;
