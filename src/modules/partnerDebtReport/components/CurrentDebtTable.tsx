import { ObjectTableProps, TableColumnConfig, ColumnsConfigType } from "@/shared/components/table";
import { PartnerCurrentDebt } from "../partnerDebtReport.model";
import { formatMoney } from "@/shared/utils/number.util";
import { useMemo } from "react";
import { EntityInfo } from "@/shared/components/display/EntityInfo";

interface DataType extends Partial<PartnerCurrentDebt> {
  children?: Partial<DataType>[];
  key: string;
}

export const CurrentDebtTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  onViewDetail,
  ...rest
}) => {
  const summaryRow = {
    id: "summary",
    code: "Tổng",
    totalDebt: summaryData?.totalDebt || 0,
    totalNotDue: summaryData?.totalNotDue || 0,
    totalOverdue: summaryData?.totalOverdue || 0,
    under30Days: summaryData?.under30Days || 0,
    under60Days: summaryData?.under60Days || 0,
    under90Days: summaryData?.under90Days || 0,
    over90Days: summaryData?.over90Days || 0,
    isSummary: true,
  };

  const formattedData: DataType[] = (dataSource || []).map((item) => ({
    ...item,
    key: item.id,
  }));

  const finalDataSource = dataSource?.length > 0 ? [summaryRow, ...formattedData] : formattedData;

  const columns: ColumnsConfigType<PartnerCurrentDebt> = useMemo(
    () => [
      {
        title: "Đối tác",
        key: "name",
        fixed: "left",
        width: 180,
        render: (record: PartnerCurrentDebt) =>
          record.isSummary ? (
            <div className="flex items-center justify-center w-full">Tổng</div>
          ) : (
            <EntityInfo
              title={record.name}
              subTitle={`${record.code}${record.group?.name ? ` - Nhóm: ${record.group?.name}` : ""}`}
            />
          ),
      },
      {
        title: "Tình trạng nợ",
        key: "byMaxDebtSide",
        align: "center",
        children: [
          {
            title: "Chưa đến hạn",
            dataIndex: "totalNotDue",
            key: "totalNotDue",
            width: 120,
            align: "right",
            ellipsis: true,
            render: (value: number) => formatMoney(value),
          },
          {
            title: "Quá hạn",
            dataIndex: "totalOverdue",
            key: "totalOverdue",
            width: 120,
            align: "right",
            ellipsis: true,
            render: (value: number) => formatMoney(value),
          },
        ],
      },
      {
        title: "Tuổi nợ",
        key: "byDebtAge",
        align: "center",
        children: [
          {
            title: "< 30 ngày",
            dataIndex: "under30Days",
            key: "under30Days",
            width: 120,
            align: "right",
            ellipsis: true,
            render: (value: number) => formatMoney(value),
          },
          {
            title: "30 - 60 ngày",
            dataIndex: "under60Days",
            key: "under60Days",
            width: 120,
            align: "right",
            ellipsis: true,
            render: (value: number) => formatMoney(value),
          },
          {
            title: "60 - 90 ngày",
            dataIndex: "under90Days",
            key: "under90Days",
            width: 120,
            align: "right",
            ellipsis: true,
            render: (value: number) => formatMoney(value),
          },
          {
            title: "> 90 ngày",
            dataIndex: "over90Days",
            key: "over90Days",
            width: 120,
            align: "right",
            ellipsis: true,
            render: (value: number) => formatMoney(value),
          },
        ],
      },
      {
        title: "Tổng nợ",
        dataIndex: "totalDebt",
        key: "totalDebt",
        width: 150,
        align: "right",
        fixed: "right",
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
      tableKey="current-debt-report-table"
      pagination={pagination}
      hasSummary
      className="double-floor"
      showCreator={false}
      showUpdater={false}
      {...rest}
    />
  );
};
