import React from "react";
import { Modal, Table, TableProps } from "antd";
import { IFundBalanceReport, IFundBalanceTransaction } from "../../../../../models/fundBalance";
import { FundCardLite } from "../../../../../components/card/Fund";
import { CLASSNAME } from "../../../../../constants/UI";
import DateRangeFilter from "../../../../../components/button/DateRangeFilter";
import { formatDateTimeDDMMYYYY } from "../../../../../utils/dateUtils";
import { formatMoney } from "../../../../../utils/formatNumber";
import { fundRefTypeMap, FundTransactionType } from "../../../../../constants/enum";
import NoData from "../../../../../components/display/NoData";

interface Props {
  fund?: IFundBalanceReport;
  data: IFundBalanceTransaction[];
  open: boolean;
  startAt?: string;
  endAt?: string;
  onDateRangerChange?: (startAt?: string, endAt?: string) => void;
  onClose: () => void;
}

const DetailModal: React.FC<Props> = ({
  data,
  fund,
  endAt,
  startAt,
  onDateRangerChange,
  open,
  onClose,
}) => {
  function formatData() {
    const formattedData: any[] = [];
    let currentBalanceAmount = fund?.openingAmount || 0;

    formattedData.push({
      index: "",
      key: "summary-beginning-balance",
      refCode: "Đầu kỳ",
      closingAmount: currentBalanceAmount,
      isSummary: true,
    });
    data.forEach((item, index) => {
      const isIncrease = item.type === FundTransactionType.INCREASE;
      currentBalanceAmount += isIncrease ? item.amount : -item.amount;

      formattedData.push({
        ...item,
        index: index + 1,
        increaseAmount: isIncrease ? item.amount : 0,
        decreaseAmount: !isIncrease ? item.amount : 0,
        content: fundRefTypeMap[item.refType] || item.refType,
        key: item.id,
        closingAmount: currentBalanceAmount,
      });
    });
    formattedData.push({
      index: "",
      key: "summary-in-out",
      isSummary: true,
      refCode: "Tổng phát sinh",
      increaseAmount: fund?.increaseAmount || 0,
      decreaseAmount: fund?.decreaseAmount || 0,
    });

    formattedData.push({
      index: "",
      key: "summary-ending-balance",
      isSummary: true,
      refCode: "Cuối kỳ",
      closingAmount: fund?.closingAmount || 0,
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
      title: "Số dư",
      dataIndex: "closingAmount",
      key: "closingAmount",
      width: 150,
      align: "right",
      ellipsis: true,
      render: (value: number) => formatMoney(value),
    },
  ];

  if (!fund) return <></>;

  return (
    <Modal
      title={"Chi tiết giao dịch quỹ"}
      open={open}
      footer={null}
      destroyOnClose
      maskClosable={false}
      centered
      width={1080}
      height="calc(100vh - 20px)"
      className="full-screen-modal"
      onCancel={onClose}
    >
      <div className="flex flex-col mt-4 h-full gap-3">
        <div className="flex items-center justify-between">
          <div className="w-96">
            <FundCardLite item={fund} />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-primary">THỜI GIAN THỰC HIỆN</span>
            <DateRangeFilter
              startDate={startAt}
              endDate={endAt}
              onRangeChange={(startAt, endAt) => onDateRangerChange?.(startAt, endAt)}
            />
          </div>
        </div>

        <div className="flex flex-col h-[calc(100%-108px)] rounded-lg border overflow-hidden">
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
        </div>
      </div>
    </Modal>
  );
};

export default DetailModal;
