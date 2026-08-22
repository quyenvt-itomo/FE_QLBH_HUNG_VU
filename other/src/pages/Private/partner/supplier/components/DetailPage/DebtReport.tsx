import { useState } from "react";
import { useDebtData } from "../../../../../../hooks/debt/useDebtData";
import { IPartner } from "../../../../../../models/partner";
import {
  DebtDirectionEnum,
  debtRefTypeMap,
  PartnerDebtSideEnum,
  partnerDebtSideMap,
} from "../../../../../../constants/enum";
import { usePageState } from "../../../../../../hooks/core/usePageState";
import { Radio, Table, TableProps } from "antd";
import { formatDateTimeDDMMYYYY } from "../../../../../../utils/dateUtils";
import { formatMoney } from "../../../../../../utils/formatNumber";
import DateRangeFilter from "../../../../../../components/button/DateRangeFilter";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import StoreSelect from "../../../../../../components/select/StoreSelect";
import { CLASSNAME } from "../../../../../../constants/UI";

export const DebtReport: React.FC<{ supplier: IPartner }> = ({ supplier }) => {
  const { startAt, endAt, storeId, pageAction } = usePageState();
  const { currentStore } = useClientData();
  const [side, setSide] = useState<PartnerDebtSideEnum>(PartnerDebtSideEnum.PAYABLE);
  const { debtTransactions, loading, transactionSummary } = useDebtData({
    startAt,
    endAt,
    storeId,
    partnerId: supplier?.id,
    side,
  });

  function formatData() {
    const formattedData: any[] = [];
    let currentBalanceAmount = transactionSummary?.openingAmount || 0;

    formattedData.push({
      index: "",
      key: "summary-beginning-balance",
      refCode: "Đầu kỳ",
      closingAmount: currentBalanceAmount,
      isSummary: true,
    });
    debtTransactions.forEach((item, index) => {
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
      increaseAmount: transactionSummary?.totalIncreaseAmount || 0,
      decreaseAmount: transactionSummary?.totalDecreaseAmount || 0,
    });

    formattedData.push({
      index: "",
      key: "summary-ending-balance",
      isSummary: true,
      refCode: "Cuối kỳ",
      closingAmount: transactionSummary?.closingAmount || 0,
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
      dataIndex: "increaseAmount",
      key: "increaseAmount",
      width: 150,
      align: "right",
      ellipsis: true,
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Giảm",
      dataIndex: "decreaseAmount",
      key: "decreaseAmount",
      width: 150,
      align: "right",
      ellipsis: true,
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Nợ còn lại",
      dataIndex: "closingAmount",
      key: "closingAmount",
      width: 150,
      align: "right",
      ellipsis: true,
      render: (value: number) => formatMoney(value),
    },
  ];

  return (
    <div className="flex flex-col h-full w-full gap-3">
      <div className="flex items-center justify-between gap-3">
        <Radio.Group
          value={side}
          onChange={(e) => setSide(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          className="flex w-52 mr-auto ml-0"
        >
          <Radio.Button
            value={PartnerDebtSideEnum.PAYABLE}
            className="flex items-center justify-center h-8 !rounded w-1/2 !rounded-e-none"
          >
            {partnerDebtSideMap[PartnerDebtSideEnum.PAYABLE]}
          </Radio.Button>
          <Radio.Button
            value={PartnerDebtSideEnum.RECEIVABLE}
            className="flex items-center justify-center h-8 !rounded w-1/2 !rounded-s-none"
          >
            {partnerDebtSideMap[PartnerDebtSideEnum.RECEIVABLE]}
          </Radio.Button>
        </Radio.Group>
        {!currentStore && (
          <div className="w-80 flex">
            <StoreSelect
              value={storeId}
              onChange={pageAction.handleStoreChange}
              placeholder="Lọc theo cửa hàng"
            />
          </div>
        )}

        <DateRangeFilter
          startDate={startAt}
          endDate={endAt}
          onRangeChange={(startAt, endAt) => pageAction.handleDateRangerChange?.(startAt, endAt)}
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
