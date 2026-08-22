import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";

export const JobPositionTable: React.FC<ObjectTableProps> = ({ ...rest }) => {
  const columns: any = [
    {
      title: "Vị trí công việc",
      dataIndex: "name",
      key: "name",
      width: 350,
    },
    {
      title: "Chức danh",
      dataIndex: ["jobTitle", "name"],
      key: "jobTitleName",
      width: 180,
    },
    {
      title: "Cấp bậc",
      dataIndex: "level",
      key: "level",
      width: 180,
    },
    {
      title: "Mô tả công việc",
      dataIndex: "note",
      key: "note",
      width: 350,
    },
  ];
  return (
    <TableColumnConfig
      columns={columns}
      itemName={"vị trí công việc"}
      tableKey={"job-position-table"}
      {...rest}
    />
  );
};
