import { Tag } from "antd";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../components/table/TableColumnConfig";
import { IncomeExpenseTypeEnum, incomeExpenseTypeMap } from "../../../../constants/enum";
import { useClientData } from "../../../../hooks/core/useClientData";
import { IIncomeExpense } from "../../../../models/store/incomeExpense";
import { formatDateTimeDDMMYYYY } from "../../../../utils/dateUtils";
import { formatMoney } from "../../../../utils/formatNumber";

const IncomeExpenseTable: React.FC<ObjectTableProps> = ({ ...rest }) => {
  const { format, currentStore } = useClientData();

  const columns: any = [
    {
      title: "Ngày",
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 100,
      align: "center",
      render: (date: string) => formatDateTimeDDMMYYYY(date),
    },
    {
      title: "Số phiếu",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "Diễn giải",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      width: 120,
      render: (value: number, record: IIncomeExpense) => (
        <span
          className={`font-medium ${record.type === IncomeExpenseTypeEnum.EXPENSE ? "text-red-500" : "text-blue-500"}`}
        >
          {formatMoney(value)}
        </span>
      ),
    },
    {
      title: "Quỹ",
      dataIndex: ["fund", "name"],
      key: "fund",
      width: 150,
    },
    {
      title: "Hạng mục",
      dataIndex: ["category", "name"],
      key: "categoryName",
      width: 150,
    },
    {
      title: "Đối tác",
      dataIndex: ["partner", "name"],
      key: "partnerName",
      width: 200,
    },
    {
      title: "Người xử lý",
      dataIndex: ["creator", "name"],
      key: "creatorName",
      width: 150,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
    },
    !currentStore && {
      title: "Cửa hàng",
      dataIndex: ["store", "name"],
      key: "storeName",
      width: 200,
      fixed: "right",
    },
  ].filter(Boolean);

  return (
    <TableColumnConfig
      columns={columns}
      itemName="giao dịch"
      tableKey={currentStore ? "income-expense-by-store" : "income-expense-all-store"}
      {...rest}
    />
  );
};

export default IncomeExpenseTable;
