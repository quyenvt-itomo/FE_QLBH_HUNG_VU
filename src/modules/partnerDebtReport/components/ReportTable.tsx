import { ObjectTableProps, TableColumnConfig, ColumnsConfigType } from "@/shared/components";
import { PartnerDebtReport } from "../partnerDebtReport.model";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { useMemo } from "react";

interface DataType extends Partial<PartnerDebtReport> {
  children?: Partial<DataType>[];
  index?: string;
  key: string;
}

export const ReportTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const summaryRow = {
    id: "summary",
    code: "Tổng",
    openingAmount: summaryData?.openingAmount || 0,
    inAmount: summaryData?.inAmount || 0,
    outAmount: summaryData?.outAmount || 0,
    closingAmount: summaryData?.closingAmount || 0,
    isSummary: true,
  };

  const formatData = (dataSource: PartnerDebtReport[]) => {
    const formattedData: DataType[] = [];

    dataSource.forEach((item) => {
      const children: Partial<DataType>[] = [];

      formattedData.push({
        ...item,
        key: item.id,
        children: children.length > 0 ? children : undefined,
      });
    });

    return formattedData;
  };

  const formattedData = formatData(dataSource);

  const finalDataSource = dataSource?.length ? [summaryRow, ...formattedData] : formattedData;

  const columns: ColumnsConfigType<PartnerDebtReport> = useMemo(
    () => [
      {
        title: "Mã đối tác",
        dataIndex: "code",
        key: "code",
        width: 100,
        fixed: "left",
      },
      {
        title: "Tên đối tác",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        width: 180,
      },
      {
        title: "Nhóm",
        dataIndex: ["group", "name"],
        key: "group",
        width: 120,
      },
      {
        title: "Nợ đầu kỳ",
        dataIndex: "openingAmount",
        key: "openingAmount",
        width: 150,
        align: "right",
        render: (value: number) => formatMoney(value),
      },
      {
        title: "Tăng trong kỳ",
        dataIndex: "inAmount",
        key: "inAmount",
        width: 150,
        align: "right",
        render: (value: number) => formatMoney(value),
      },
      {
        title: "Giảm trong kỳ",
        dataIndex: "outAmount",
        key: "outAmount",
        width: 150,
        align: "right",
        render: (value: number) => formatMoney(value),
      },
      {
        title: "Nợ cuối kỳ",
        dataIndex: "closingAmount",
        key: "closingAmount",
        width: 150,
        align: "right",
        render: (value: number) => formatMoney(value),
      },
    ],
    [],
  );
  return (
    <TableColumnConfig
      columns={columns}
      dataSource={finalDataSource}
      itemName={"đối tác"}
      tableKey="partner-debt-report-table"
      pagination={pagination}
      hasSummary
      showCreator={false}
      showUpdater={false}
      {...rest}
    />
  );
};
