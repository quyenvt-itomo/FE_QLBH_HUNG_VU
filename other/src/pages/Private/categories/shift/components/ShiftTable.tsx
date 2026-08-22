import { InfoCircleOutlined } from "@ant-design/icons";
import ContentTooltip from "../../../../../components/table/ContentTooltip";
import TableColumnConfig, {
  ObjectTableProps,
} from "../../../../../components/table/TableColumnConfig";
import { IShift } from "../../../../../models/store/shift";
import { formatMoney, formatQuantity } from "../../../../../utils/formatNumber";
import { formatDateTimeDDMMYYYY } from "../../../../../utils/dateUtils";
import UserImage from "../../../../../components/image/UserImage";
import { getMainImage } from "../../../../../utils/fileUtil";
import {
  generateCashTooltipContent,
  generateChecklistTooltipContent,
} from "../../../../../utils/common";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { ShiftStatusEnum } from "../../../../../constants/enum";

export const ShiftTable: React.FC<ObjectTableProps> = ({ dataSource, summaryData, ...rest }) => {
  const { currentStore } = useClientData();

  const summaryRow = {
    id: "summary",
    code: "Tổng",
    totalSaleOrder: summaryData?.totalSaleOrder || 0,
    totalSaleReturnOrder: summaryData?.totalSaleReturnOrder || 0,
    totalRevenue: summaryData?.totalRevenue || 0,
    totalDebtAmount: summaryData?.totalDebtAmount || 0,
    totalCashInFromOrders: summaryData?.totalCashInFromOrders || 0,
    totalCashIn: summaryData?.totalCashIn || 0,
    totalCashOut: summaryData?.totalCashOut || 0,
    isSummary: true,
  };

  const columns: any = [
    {
      title: "Mã ca làm",
      key: "code",
      width: 120,
      fixed: "left",
      render: (record: IShift) => (
        <div className="flex flex-col">
          <span className="font-medium font-mono">{record.code}</span>
          <span className="text-xs text-slate-400">{formatDateTimeDDMMYYYY(record.startAt)}</span>
        </div>
      ),
    },
    {
      title: "Tên nhân sự",
      dataIndex: "createdBySnapshot",
      key: "createdBySnapshot",
      width: 250,
      render: (value: IShift["createdBySnapshot"]) =>
        !!value && (
          <div className="flex items-center gap-2">
            <UserImage size={36} image={getMainImage(value?.avatar || [])} />
            <div className="flex flex-col">
              <span className="block truncate">{value?.name}</span>
              <span className="text-xs font-mono text-slate-400">
                {value?.code} {value?.phone ? " - " + value.phone : ""}
              </span>
            </div>
          </div>
        ),
    },
    {
      title: "Kiểm tiền đầu ca",
      dataIndex: "openingCash",
      key: "openingCash",
      width: 180,
      align: "right",
      render: (value: number, record: IShift) =>
        !!value &&
        !!record.openingCashSnapshot && (
          <div className="flex items-center justify-between">
            <InfoCircleOutlined
              className="cursor-pointer text-gray-400 hover:text-blue-500"
              title={generateCashTooltipContent(record.openingCashSnapshot)}
            />
            <span>{formatMoney(value) || 0}</span>
          </div>
        ),
    },
    {
      title: "Checklist đầu ca",
      dataIndex: "openingChecklist",
      key: "openingChecklist",
      width: 150,
      render: (value: IShift["openingChecklist"]) =>
        !!value && <ContentTooltip content={generateChecklistTooltipContent(value)} width={150} />,
    },

    {
      title: "Kết thúc",
      dataIndex: "endAt",
      key: "endAt",
      width: 120,
      align: "center",
      render: (endAt: string) => formatDateTimeDDMMYYYY(endAt),
    },
    {
      title: "Kiểm tiền cuối ca",
      dataIndex: "closingCash",
      key: "closingCash",
      width: 180,
      align: "right",
      render: (value: number, record: IShift) =>
        record.endAt ? (
          <div className="flex items-center justify-between">
            <InfoCircleOutlined
              className="cursor-pointer text-gray-400 hover:text-blue-500"
              title={generateCashTooltipContent(record.closingCashSnapshot)}
            />
            <span>{formatMoney(value) || 0}</span>
          </div>
        ) : (
          "--"
        ),
    },
    {
      title: "Tiền mặt thực tế",
      dataIndex: "expectedCash",
      key: "expectedCash",
      width: 150,
      align: "right",
      render: (value: number, record: IShift) =>
        record.endAt ? <span>{formatMoney(value) || 0}</span> : "--",
    },
    {
      title: "Chênh lệch",
      dataIndex: "difference",
      key: "difference",
      width: 150,
      align: "right",
      render: (value: number, record: IShift) =>
        record.endAt ? (
          <span className={value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : ""}>
            {formatMoney(value) || 0}
          </span>
        ) : (
          "--"
        ),
    },

    {
      title: "Checklist cuối ca",
      dataIndex: "closingChecklist",
      key: "closingChecklist",
      width: 150,
      render: (value: IShift["closingChecklist"], record: IShift) =>
        record.endAt ? (
          <ContentTooltip content={generateChecklistTooltipContent(value)} width={150} />
        ) : (
          "--"
        ),
    },

    {
      title: "Tổng đơn bán",
      dataIndex: "totalSaleOrder",
      key: "totalSaleOrder",
      width: 120,
      align: "right",
      render: (value: number) => formatQuantity(value) || 0,
    },
    {
      title: "Tổng đơn hoàn",
      dataIndex: "totalSaleReturnOrder",
      key: "totalSaleReturnOrder",
      width: 120,
      align: "right",
      render: (value: number) => formatQuantity(value) || 0,
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value) || 0,
    },
    {
      title: "Khách chưa TT",
      dataIndex: "totalDebtAmount",
      key: "totalDebtAmount",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value) || 0,
    },
    {
      title: "TM từ ĐH",
      dataIndex: "totalCashInFromOrders",
      key: "totalCashInFromOrders",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value) || 0,
    },
    {
      title: "TM thu khác",
      dataIndex: "totalCashIn",
      key: "totalCashIn",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value) || 0,
    },
    {
      title: "TM chi khác",
      dataIndex: "totalCashOut",
      key: "totalCashOut",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value) || 0,
    },

    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 300,
      render: (note: string) => <ContentTooltip width={300} content={note} />,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 80,
      align: "center",
      fixed: "right",
      render: (status: string) =>
        !!status && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === ShiftStatusEnum.ACTIVE
                ? "bg-green-100 text-green-800"
                : status === ShiftStatusEnum.CLOSED
                  ? "bg-gray-100 text-gray-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status === ShiftStatusEnum.ACTIVE
              ? "Đang mở"
              : status === ShiftStatusEnum.CLOSED
                ? "Đã đóng"
                : "Khác"}
          </span>
        ),
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

  const finalDataSource = dataSource?.length ? [summaryRow, ...dataSource] : dataSource;

  return (
    <TableColumnConfig
      columns={columns}
      dataSource={finalDataSource}
      itemName={"ca làm"}
      hasSummary
      tableKey={"shift-table"}
      {...rest}
    />
  );
};
