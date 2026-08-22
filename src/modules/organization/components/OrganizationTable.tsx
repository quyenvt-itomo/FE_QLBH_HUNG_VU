import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { Organization } from "../organization.model";
import CompanyImage from "@/shared/components/image/CompanyImage";
import { getMainFile } from "@/shared/utils/file.util";
import { getFullAddress } from "@/shared/utils/common.util";
import ContentTooltip from "@/shared/components/table/ContentTooltip";
import { OrganizationTypeTag } from "./Tag";

export const OrganizationTable: React.FC<ObjectTableProps> = ({ ...rest }) => {
  const columns: any = [
    {
      title: "Tên đơn vị",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (name: string, record: Organization) => (
        <div className="w-64 flex items-center gap-2">
          <CompanyImage size={24} image={getMainFile(record.logo)} />
          <span className="block truncate">{name}</span>
        </div>
      ),
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 100,
      align: "center",
      render: (v: string) => (
        <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
          {v}
        </span>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 80,
      align: "center",
      render: (value: Organization["type"]) => <OrganizationTypeTag value={value} size="sm" />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (v: string | null) => v || <span className="text-gray-300">—</span>,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 140,
      align: "center",
      render: (v: string | null) => v || <span className="text-gray-300">—</span>,
    },
    {
      title: "Mã số thuế",
      dataIndex: "taxCode",
      key: "taxCode",
      width: 130,
      align: "center",
      render: (v: string | null) => v || <span className="text-gray-300">—</span>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 250,
      render: (address: Organization["address"]) => getFullAddress(address),
    },
    {
      title: "Chuyên ngành",
      dataIndex: "industry",
      key: "industry",
      width: 160,
      render: (v: string | null) => v || <span className="text-gray-300">—</span>,
    },
    {
      title: "Chức năng",
      dataIndex: "responsibility",
      key: "responsibility",
      width: 180,
      render: (v: string | null) =>
        v ? <ContentTooltip content={v} width={160} /> : <span className="text-gray-300">—</span>,
    },
    {
      title: "Cơ sở thành lập",
      dataIndex: "establishment",
      key: "establishment",
      width: 160,
      render: (v: string | null) => v || <span className="text-gray-300">—</span>,
    },
    {
      title: "Trưởng đơn vị",
      dataIndex: ["manager", "name"],
      key: "manager",
      width: 180,
      render: (v: string | null) => v || <span className="text-gray-300">—</span>,
    },
    {
      title: "Trực thuộc",
      dataIndex: ["parent", "name"],
      key: "parent",
      width: 180,
      render: (v: string | null) => v || <span className="text-gray-300">—</span>,
    },
  ];
  return (
    <TableColumnConfig
      columns={columns}
      itemName={"đơn vị"}
      tableKey="organization-table"
      {...rest}
    />
  );
};
