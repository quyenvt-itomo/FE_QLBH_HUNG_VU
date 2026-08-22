import { usePageState } from "../../../../hooks/core/usePageState";
import { useEffect, useState } from "react";
import { useClientData } from "../../../../hooks/core/useClientData";
import { checkSelection, getLocationNotification } from "../../../../utils/common";
import { useNavigate } from "react-router-dom";
import ReportTable from "../components/report/ReportTable";
import { buildUrlWithId } from "../../../../utils/paramUtils";
import { privateRoutesName } from "../../../../constants/routerName";
import { useDebtData } from "../../../../hooks/debt/useDebtData";
import { SearchInput } from "../../../../components/input";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import StoreSelect from "../../../../components/select/StoreSelect";
import { IDebtReport } from "../../../../models/store/debt";
import DetailModal from "../components/report/DetailModal";
import { PartnerDebtSideEnum, partnerDebtSideMap } from "../../../../constants/enum";
import { Radio } from "antd";

export const Report: React.FC = () => {
  const notification = getLocationNotification();
  const navigate = useNavigate();
  const {
    keyword,
    page,
    size,
    startAt,
    endAt,
    filter,
    reload,
    storeId,
    setPage,
    setSize,

    open,
    setOpen,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<IDebtReport>();
  const [side, setSide] = useState<PartnerDebtSideEnum>(PartnerDebtSideEnum.RECEIVABLE);
  const { currentStore } = useClientData();

  const { debtReports, debtTransactions, loading, pagination, summary } = useDebtData({
    keyword,
    page,
    size,
    filter,
    reload,
    startAt,
    endAt,
    storeId,
    partnerId: rowData?.id,
    side,
  });

  useEffect(() => {
    if (!open || !rowData) return;
    const exists = debtReports.find((partner) => partner.id === rowData.id);
    if (!exists) {
      setOpen(false);
      setRowData(undefined);
    } else {
      setRowData(exists);
    }
  }, [debtReports]);

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <Radio.Group
          value={side}
          onChange={(e) => setSide(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          className="flex w-52 mr-auto ml-0"
        >
          <Radio.Button
            value={PartnerDebtSideEnum.RECEIVABLE}
            className="flex items-center justify-center h-8 !rounded w-1/2 !rounded-e-none"
          >
            {partnerDebtSideMap[PartnerDebtSideEnum.RECEIVABLE]}
          </Radio.Button>
          <Radio.Button
            value={PartnerDebtSideEnum.PAYABLE}
            className="flex items-center justify-center h-8 !rounded w-1/2 !rounded-s-none"
          >
            {partnerDebtSideMap[PartnerDebtSideEnum.PAYABLE]}
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
          onRangeChange={pageAction.handleDateRangerChange}
        />
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={230} />
      </div>
      <div className="flex flex-col h-[calc(100%-40px)] gap-4 bg-white px-6 py-2 rounded-lg border">
        <ReportTable
          dataSource={debtReports}
          loading={loading}
          pagination={pagination}
          summaryData={summary}
          setPage={setPage}
          setSize={setSize}
          onRow={(record: any) => {
            return {
              onClick: () => {
                if (record.isSummary || checkSelection()) return;
                setRowData(record);
                setOpen(true);
              },
              className: rowData?.id === record.id ? "selected-row" : "",
            };
          }}
          onViewDetails={(record) => {
            if (record.isSummary) return;
            setRowData(record);
            setOpen(true);
          }}
        />
      </div>

      <DetailModal
        side={side}
        partner={rowData}
        data={debtTransactions}
        open={open}
        startAt={startAt}
        endAt={endAt}
        onDateRangerChange={pageAction.handleDateRangerChange}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
