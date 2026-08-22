import { Table, TableProps } from "antd";
import { ObjectTableProps } from "../../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { formatMoney } from "../../../../../utils/formatNumber";
import { formatDateTimeDDMMYYYY } from "../../../../../utils/dateUtils";
import { CLASSNAME } from "../../../../../constants/UI";
import NoData from "../../../../../components/display/NoData";
import { IVatTransaction } from "../../../../../models/store/vat";
import { DebtDirectionEnum, debtRefTypeMap } from "../../../../../constants/enum";

const ReportTable: React.FC<ObjectTableProps> = ({ dataSource, summaryData }) => {
  const { currentStore } = useClientData();

  function formatData() {
    const formattedData: any[] = [];
    let currentBalanceAmount = summaryData?.openingAmount || 0;

    formattedData.push({
      index: "",
      key: "summary-beginning-balance",
      refCode: "Đầu kỳ",
      closingAmount: currentBalanceAmount,
      isSummary: true,
    });

    dataSource.forEach((item: IVatTransaction, index: number) => {
      const isIncrease = item.direction === DebtDirectionEnum.INCREASE;
      currentBalanceAmount += isIncrease ? item.amount : -item.amount;

      formattedData.push({
        ...item,
        index: index + 1,
        increaseAmount: isIncrease ? item.amount : 0,
        decreaseAmount: !isIncrease ? item.amount : 0,
        content: debtRefTypeMap[item.refType] || item.refType,
        key: item.id,
        closingAmount: currentBalanceAmount,
      });
    });
    formattedData.push({
      index: "",
      key: "summary-in-out",
      isSummary: true,
      refCode: "Tổng phát sinh",
      increaseAmount: summaryData?.totalIncreaseAmount || 0,
      decreaseAmount: summaryData?.totalDecreaseAmount || 0,
    });

    formattedData.push({
      index: "",
      key: "summary-ending-balance",
      isSummary: true,
      refCode: "Cuối kỳ",
      closingAmount: summaryData?.closingAmount || 0,
    });

    return formattedData;
  }

  const formattedData = formatData();

  const columns: TableProps["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center",
      ellipsis: true,
    },
    {
      title: "Ngày",
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 130,
      align: "center",
      ellipsis: true,
      render: (value: string) => formatDateTimeDDMMYYYY(value),
    },
    {
      title: "Số phiếu",
      dataIndex: "refCode",
      key: "refCode",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Có",
      dataIndex: "decreaseAmount",
      key: "decreaseAmount",
      width: 150,
      align: "right",
      ellipsis: true,
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Nợ",
      dataIndex: "increaseAmount",
      key: "increaseAmount",
      width: 150,
      align: "right",
      ellipsis: true,
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Còn nợ",
      dataIndex: "closingAmount",
      key: "closingAmount",
      width: 150,
      align: "right",
      ellipsis: true,
      render: (value: number) => formatMoney(value),
    },
    { title: "Nội dung", dataIndex: "content", key: "content", width: 150, ellipsis: true },
  ];

  if (!currentStore) {
    columns?.push({
      title: "Cửa hàng",
      dataIndex: ["store", "name"],
      key: "storeName",
      width: 200,
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={formattedData}
      pagination={false}
      className={CLASSNAME.table}
      tableLayout="fixed"
      locale={{
        emptyText: (
          <div className="h-[calc(100vh-28rem)] flex items-center justify-center">
            <NoData />
          </div>
        ),
      }}
      scroll={{
        x: "max-content",
        y: "max-content",
      }}
      rowClassName={(record: any) =>
        record.isSummary ? "summary-row font-semibold" : "cursor-pointer"
      }
    />
  );
};

export default ReportTable;
