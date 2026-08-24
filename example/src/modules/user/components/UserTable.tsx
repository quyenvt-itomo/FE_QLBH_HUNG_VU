import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { User } from "../user.model";
import UserImage from "@/shared/components/image/UserImage";
import { getMainFile } from "@/shared/utils/file.util";
import { formatDate } from "@/shared/utils/date.util";
import { getFullAddress } from "@/shared/utils/common.util";
import ContentTooltip from "@/shared/components/table/ContentTooltip";
import { generateRoleContent } from "../user.util";

export const UserTable: React.FC<ObjectTableProps> = ({ ...rest }) => {
  const columns: any = [
    {
      title: "Mã ND",
      dataIndex: "code",
      className: "code-column",
      key: "code",
      width: 120,
    },
    {
      title: "Tên ND",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (name: string, record: User) => (
        <div className="flex items-center gap-2">
          <UserImage size={24} image={getMainFile(record.avatar || [])} />
          <span className="block truncate">{name}</span>
        </div>
      ),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (email: string) => <ContentTooltip content={email} width={200} />,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 130,
    },
    {
      title: "Vai trò hệ thống",
      key: "companyUsers",
      width: 450,
      render: (user: User) => <ContentTooltip content={generateRoleContent(user)} width={450} />,
    },
    {
      title: "Công ty quản lý",
      dataIndex: ["sourceStore", "name"],
      key: "sourceStore",
      width: 200,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 150,
      render: (note: string) => <ContentTooltip width={150} content={note} />,
    },
  ];
  return (
    <TableColumnConfig
      columns={columns}
      itemName={"tài khoản người dùng"}
      tableKey={"user-table"}
      {...rest}
    />
  );
};
