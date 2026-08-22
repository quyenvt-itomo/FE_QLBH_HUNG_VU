import UserImage from "../../../../components/image/UserImage";
import ContentTooltip from "../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../hooks/core/useClientData";
import { getMainImage } from "../../../../utils/fileUtil";
import { getFullAddress } from "../../../../utils/common";
import { IAddress } from "../../../../models/base/interface";
import { IEmployee } from "../../../../models/store/employee";

const EmployeeTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { currentStore } = useClientData();

  const columns: any = [
    {
      title: "Mã NS",
      dataIndex: "code",
      key: "code",
      width: 80,
    },
    {
      title: "Tên nhân sự",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (name: string, record: IEmployee) => (
        <div className="flex items-center gap-2">
          <UserImage size={24} image={getMainImage(record.avatar)} />
          <span className="block truncate">{name}</span>
        </div>
      ),
    },
    {
      title: "Vị trí công việc",
      dataIndex: ["position", "name"],
      key: "position",
      width: 150,
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
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 300,
      render: (value: IAddress) => <ContentTooltip content={getFullAddress(value)} width={300} />,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 120,
      render: (note: string) => <ContentTooltip content={note} />,
    },
  ];
  if (!currentStore) {
    columns?.push({
      title: "Cửa hàng",
      dataIndex: ["store", "name"],
      key: "storeName",
      fixed: "right",
      width: 150,
    });
  }
  return (
    <TableColumnConfig
      columns={columns}
      dataSource={dataSource}
      itemName={"nhân sự"}
      tableKey={`employee-table${currentStore ? `-store` : ""}`}
      pagination={pagination}
      {...rest}
    />
  );
};

export default EmployeeTable;
