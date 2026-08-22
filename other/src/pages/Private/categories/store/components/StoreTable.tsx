import ContentTooltip from "../../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { getFullAddress } from "../../../../../utils/common";
import { IAddress } from "../../../../../models/base/interface";
import { IStore } from "../../../../../models/store";
import StoreImage from "../../../../../components/image/StoreImage";
import { getMainImage } from "../../../../../utils/fileUtil";

const StoreTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { format } = useClientData();

  const columns: any = [
    {
      title: "Mã CH",
      dataIndex: "code",
      key: "code",
      width: 80,
      align: "center",
    },
    {
      title: "Tên cửa hàng",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (name: string, record: IStore) => (
        <div className="w-64 flex items-center gap-2">
          <StoreImage size={24} image={getMainImage(record.image)} />
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
      title: "Mã số thuế",
      dataIndex: "taxCode",
      key: "taxCode",
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
  return (
    <TableColumnConfig
      columns={columns}
      dataSource={dataSource}
      itemName={"cửa hàng"}
      tableKey="store-table"
      pagination={pagination}
      {...rest}
    />
  );
};

export default StoreTable;
