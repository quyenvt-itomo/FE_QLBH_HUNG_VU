import UserImage from "../../../../../components/image/UserImage";
import ContentTooltip from "../../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { IPartner } from "../../../../../models/partner";
import { formatDateTimeDDMMYYYY } from "../../../../../utils/dateUtils";
import { getMainImage } from "../../../../../utils/fileUtil";
import { formatMoney } from "../../../../../utils/formatNumber";

const DebtAdjustmentTable: React.FC<ObjectTableProps> = ({
  dataSource,
  summaryData,
  pagination,
  ...rest
}) => {
  const { currentStore } = useClientData();

  const summaryRow = {
    id: "summary",
    key: "Tổng",
    code: "Tổng",
    totalAdjustmentAmount: summaryData?.totalAdjustmentAmount,
    isSummary: true,
  };

  const finalDataSource = dataSource?.length ? [summaryRow, ...dataSource] : dataSource;

  const columns: any = [
    {
      title: "Ngày",
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 200,
      render: (date: string) => formatDateTimeDDMMYYYY(date),
    },
    {
      title: "Số phiếu",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    !currentStore && {
      title: "Cửa hàng",
      dataIndex: ["store", "name"],
      key: "storeName",
      width: 200,
    },
    {
      title: "Đối tác thực hiện",
      dataIndex: "partner",
      key: "partner",
      width: 150,
      render: (partner: IPartner) =>
        partner ? (
          <div className="flex items-center gap-2">
            <UserImage size={24} image={getMainImage(partner?.avatar)} />
            <div className="flex flex-col">
              <span className="h-4 flex items-center truncate">{partner.name}</span>
              <span className="h-3 flex items-center text-[10px] text-gray-500 truncate">
                {partner.code}
              </span>
            </div>
          </div>
        ) : (
          <></>
        ),
    },

    {
      title: "Nợ hệ thống",
      dataIndex: "countedAmount",
      key: "countedAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Nợ thực tế",
      dataIndex: "expectedAmount",
      key: "expectedAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Chênh lệch",
      dataIndex: "totalAdjustmentAmount",
      key: "totalAdjustmentAmount",
      width: 150,
      align: "right",
      render: (value: number) => (
        <span className={value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : ""}>
          {formatMoney(value)}
        </span>
      ),
    },
    {
      title: "Người thực hiện",
      dataIndex: ["adjustedBy", "name"],
      key: "adjustedByName",
      width: 200,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 100,
      render: (note: string) => <ContentTooltip content={note} width={100} />,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 100,
      render: (note: string) => <ContentTooltip content={note} width={100} />,
    },
  ].filter(Boolean);

  return (
    <TableColumnConfig
      columns={columns}
      dataSource={finalDataSource}
      hasSummary
      itemName={"phiếu"}
      tableKey={`debt-adjustment-table-${currentStore ? `-store` : ""}`}
      pagination={pagination}
      {...rest}
    />
  );
};

export default DebtAdjustmentTable;
