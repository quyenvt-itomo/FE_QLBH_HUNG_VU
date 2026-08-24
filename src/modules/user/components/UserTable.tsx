import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { User } from "../user.model";
import { UserImage } from "@/shared";
import { getMainFile } from "@/shared/utils/file.util";
import { ContentTooltip } from "@/shared";

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
      width: 150,
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
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 100,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Vai trò hệ thống",
      dataIndex: ["role", "name"],
      key: "roleName",
      width: 150,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 150,
      render: (note: string) => <ContentTooltip width={150} content={note} />,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      fixed: "right",
      render: (isActive: boolean) => (isActive ? "Hoạt động" : "Ngưng hoạt động"),
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
