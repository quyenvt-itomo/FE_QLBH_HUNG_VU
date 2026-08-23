import { IPartner } from "../../../../../../models/partner";
import {
  LoyaltyPointRefTypeEnum,
  LoyaltyPointTransactionType,
} from "../../../../../../constants/enum";
import { usePageState } from "../../../../../../hooks/core/usePageState";
import { Table, TableProps } from "antd";
import { formatDateTimeDDMMYYYY } from "../../../../../../utils/dateUtils";
import { formatMoney } from "../../../../../../utils/formatNumber";
import DateRangeFilter from "../../../../../../components/button/DateRangeFilter";
import { CLASSNAME } from "../../../../../../constants/UI";
import { useLoyaltyPointData } from "../../../../../../hooks/loyaltyPoint/useLoyaltyPointData";
import { StatsCard } from "./StatsCard";
import { CreditCardIcon, StarIcon } from "@heroicons/react/24/outline";

export const LoyaltyPointReport: React.FC<{ customer: IPartner }> = ({ customer }) => {
  const { startAt, endAt, pageAction } = usePageState();
  const { loyaltyPointTransactions, loading, transactionSummary } = useLoyaltyPointData({
    startAt,
    endAt,
    partnerId: customer?.id,
  });

  function formatData() {
    const formattedData: any[] = [];
    let currentBalancePoints = transactionSummary?.openingPoints || 0;

    formattedData.push({
      index: "",
      key: "summary-beginning-balance",
      refCode: "Đầu kỳ",
      closingPoints: currentBalancePoints,
      isSummary: true,
    });
    loyaltyPointTransactions.forEach((item, index) => {
      const isIncrease = item.type === LoyaltyPointTransactionType.INCREASE;
      currentBalancePoints += isIncrease ? item.points : -item.points;

      formattedData.push({
        ...item,
        index: index + 1,
        increasePoints: isIncrease ? item.points : 0,
        decreasePoints: !isIncrease ? item.points : 0,
        content:
          item.refType === LoyaltyPointRefTypeEnum.ADJUSTMENT
            ? "Điều chỉnh điểm tích lũy"
            : item.type === LoyaltyPointTransactionType.INCREASE
              ? "Mua hàng"
              : "Thanh toán bằng điểm",
        key: item.id,
        closingPoints: currentBalancePoints,
      });
    });
    formattedData.push({
      index: "",
      key: "summary-in-out",
      isSummary: true,
      refCode: "Tổng phát sinh",
      increasePoints: transactionSummary?.increasePoints || 0,
      decreasePoints: transactionSummary?.decreasePoints || 0,
    });

    formattedData.push({
      index: "",
      key: "summary-ending-balance",
      isSummary: true,
      refCode: "Cuối kỳ",
      closingPoints: transactionSummary?.closingPoints || 0,
    });

    return formattedData;
  }

  const formattedData = formatData();

  const columns: TableProps["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 40,
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
    { title: "Nội dung", dataIndex: "content", key: "content", width: 150, ellipsis: true },
    {
      title: "Tăng",
      dataIndex: "increasePoints",
      key: "increasePoints",
      width: 150,
      align: "right",
      ellipsis: true,
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Giảm",
      dataIndex: "decreasePoints",
      key: "decreasePoints",
      width: 150,
      align: "right",
      ellipsis: true,
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Điểm còn lại",
      dataIndex: "closingPoints",
      key: "closingPoints",
      width: 150,
      align: "right",
      ellipsis: true,
      render: (value: number) => formatMoney(value),
    },
  ];

  return (
    <div className="flex flex-col h-full w-full gap-3">
      <div className="flex items-center justify-between gap-3">
        <DateRangeFilter
          startDate={startAt}
          endDate={endAt}
          onRangeChange={(startAt, endAt) => pageAction.handleDateRangerChange?.(startAt, endAt)}
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        <StatsCard
          label="Tích lũy hiện tại"
          value={customer?.loyaltyPoints || 0}
          icon={
            <div className="relative">
              <CreditCardIcon className="h-7 w-7 text-slate-400" />
              <div className="bg-white rounded-full p-px absolute top-0 -right-1">
                <StarIcon className="h-3 w-3 text-yellow-400" />
              </div>
            </div>
          }
        />
        <StatsCard
          label="Doanh thu trong kỳ"
          type="money"
          value={transactionSummary?.revenueEarned || 0}
        />
        <StatsCard label="Điểm tích lũy trong kỳ" value={transactionSummary?.pointsEarned || 0} />
        <StatsCard
          label="Điểm sử dụng trong kỳ"
          value={transactionSummary?.pointsRedeemed || 0}
          warning
        />
      </div>
      <div className="flex flex-col h-[calc(100%-44px)] bg-white border rounded-lg px-4 py-2">
        <Table
          loading={loading}
          columns={columns}
          dataSource={formattedData}
          pagination={false}
          className={CLASSNAME.table}
          tableLayout="fixed"
          scroll={{
            x: "max-content",
            y: "max-content",
          }}
          rowClassName={(record: any) =>
            record.isSummary ? "summary-row font-semibold" : "cursor-pointer"
          }
        />
      </div>
    </div>
  );
};
