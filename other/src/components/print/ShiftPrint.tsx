import React from "react";
import { FE_BASE_URL } from "../../constants/ApiEndpoint";
import { CASH_KEYS, checklistKeyMap } from "../../constants/enum";
import { CashKey, IShift } from "../../models/store/shift";
import { getFullAddress } from "../../utils/common";
import { formatVietNamDate, formatDateTimeDDMMYYYY } from "../../utils/dateUtils";
import { formatMoney } from "../../utils/formatNumber";

interface Props {
  data: IShift;
}

const ShiftPrint: React.FC<Props> = ({ data }) => {
  const hasClosing = !!data.closingCash && data.closingCash > 0;
  const totalCashIn = (data.totalCashInFromOrders || 0) + (data.totalCashIn || 0);
  const difference = data.difference || 0;

  const renderCashTable = (snapshot: Record<CashKey, number> | undefined | null) => (
    <table className="w-full border-collapse table-fixed mt-2">
      <colgroup>
        <col style={{ width: "35%" }} />
        <col style={{ width: "25%" }} />
        <col style={{ width: "40%" }} />
      </colgroup>
      <thead>
        <tr>
          <th className="text-left font-semibold border-t border-b border-[#323832] px-1 py-0.5">
            Mệnh giá
          </th>
          <th className="text-center font-semibold border-t border-b border-[#323832] px-1 py-0.5">
            SL
          </th>
          <th className="text-right font-semibold border-t border-b border-[#323832] px-1 py-0.5">
            Thành tiền
          </th>
        </tr>
      </thead>
      <tbody>
        {CASH_KEYS.map((key) => {
          const qty = snapshot?.[key] || 0;
          if (qty === 0) return null;
          return (
            <tr key={key}>
              <td className="text-left border-b border-dashed border-[#323832] px-1 py-0.5">
                {formatMoney(Number(key))} đ
              </td>
              <td className="text-center border-b border-dashed border-[#323832] px-1 py-0.5">
                {qty}
              </td>
              <td className="text-right border-b border-dashed border-[#323832] px-1 py-0.5">
                {formatMoney(qty * Number(key))} đ
              </td>
            </tr>
          );
        }).filter(Boolean)}
      </tbody>
    </table>
  );

  const checklistData = hasClosing ? data.closingChecklist : data.openingChecklist;
  const hasChecklist = checklistData && Object.keys(checklistData).length > 0;

  const sectionTitle = "font-semibold border-b border-[#323832] pb-0.5 mt-3 mb-1.5";
  const summaryRow = "flex justify-between py-[3px]";
  const bold = "font-bold";

  return (
    <div style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
      <style>{`@page { size: 57mm auto; margin: 2mm; }`}</style>
      <div className="text-[9px] leading-[1.4] w-[57mm] max-w-[57mm] overflow-x-hidden p-[2mm] [&_*]:text-[9px] [&_*]:leading-[1.4]">
        <header>
          <div className="flex flex-col items-center">
            <img src={`${FE_BASE_URL}logo.svg`} alt="Logo" style={{ height: 40 }} />
            <span className="font-semibold">{data.store?.name || ""}</span>
            <span className="text-center">
              Địa chỉ: {getFullAddress(data.store?.address) || "--"}
            </span>
            <span>SĐT: {data.store?.phone || "--"}</span>
            <span className="font-semibold mt-2">PHIẾU CA LÀM VIỆC</span>
            <span className="mt-1">Mã ca: {data.code}</span>
          </div>
          <div className="flex flex-col mt-2">
            <span>Nhân viên: {data.createdBySnapshot?.name || "--"}</span>
            <span>Bắt đầu: {formatDateTimeDDMMYYYY(data.startAt)}</span>
            {data.endAt && <span>Kết thúc: {formatDateTimeDDMMYYYY(data.endAt)}</span>}
          </div>
        </header>

        <main>
          <div className={sectionTitle}>TỔNG QUAN CA LÀM VIỆC</div>
          <div className={summaryRow}>
            <span>Tổng đơn hàng:</span>
            <span className={bold}>{data.totalSaleOrder || 0}</span>
          </div>
          <div className={summaryRow}>
            <span>Tổng đơn hoàn:</span>
            <span className={bold}>{data.totalSaleReturnOrder || 0}</span>
          </div>
          <div className={summaryRow}>
            <span>Doanh thu:</span>
            <span className={bold}>{formatMoney(data.totalCashInFromOrders) || "0"} đ</span>
          </div>
          <div className={summaryRow}>
            <span>Khách chưa thanh toán:</span>
            <span className={bold}>{formatMoney(data.totalDebtAmount) || "0"} đ</span>
          </div>

          <div className={sectionTitle}>THU CHI TIỀN MẶT</div>
          <div className={summaryRow}>
            <span>Thu từ đơn hàng:</span>
            <span className={bold}>+{formatMoney(data.totalCashInFromOrders) || "0"} đ</span>
          </div>
          <div className={summaryRow}>
            <span>Thu vào khác:</span>
            <span className={bold}>+{formatMoney(data.totalCashIn) || "0"} đ</span>
          </div>
          <div className={summaryRow}>
            <span>Chi ra:</span>
            <span className={bold}>-{formatMoney(data.totalCashOut) || "0"} đ</span>
          </div>
          <div className={`${summaryRow} bg-gray-100 px-1 py-1 -mx-1 rounded-sm font-semibold`}>
            <span>Tổng thu vào:</span>
            <span>+{formatMoney(totalCashIn) || "0"} đ</span>
          </div>

          <div className={sectionTitle}>KIỂM KÊ TIỀN ĐẦU CA</div>
          {renderCashTable(data.openingCashSnapshot)}
          <div
            className={`${summaryRow} bg-gray-100 px-1 py-1 -mx-1 rounded-sm font-semibold mt-1`}
          >
            <span>Tổng tiền đầu ca:</span>
            <span>{formatMoney(data.openingCash) || "0"} đ</span>
          </div>

          {hasClosing && (
            <>
              <div className={sectionTitle}>KIỂM KÊ TIỀN CUỐI CA</div>
              {renderCashTable(data.closingCashSnapshot)}
              <div
                className={`${summaryRow} bg-gray-100 px-1 py-1 -mx-1 rounded-sm font-semibold mt-1`}
              >
                <span>Tổng tiền cuối ca:</span>
                <span>{formatMoney(data.closingCash) || "0"} đ</span>
              </div>

              <div className={sectionTitle}>CÔNG THỨC TÍNH TIỀN CUỐI CA</div>
              <div className={summaryRow}>
                <span>
                  <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full text-white text-[8px] font-bold mr-1 bg-blue-500">
                    1
                  </span>
                  Tiền đầu ca:
                </span>
                <span className={bold}>{formatMoney(data.openingCash) || "0"} đ</span>
              </div>
              <div className={summaryRow}>
                <span>
                  <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full text-white text-[8px] font-bold mr-1 bg-emerald-500">
                    2
                  </span>
                  Thu từ đơn hàng:
                </span>
                <span className={bold}>+{formatMoney(data.totalCashInFromOrders) || "0"} đ</span>
              </div>
              <div className={summaryRow}>
                <span>
                  <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full text-white text-[8px] font-bold mr-1 bg-emerald-500">
                    3
                  </span>
                  Thu vào khác:
                </span>
                <span className={bold}>+{formatMoney(data.totalCashIn) || "0"} đ</span>
              </div>
              <div className={summaryRow}>
                <span>
                  <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full text-white text-[8px] font-bold mr-1 bg-red-500">
                    4
                  </span>
                  Chi ra:
                </span>
                <span className={bold}>-{formatMoney(data.totalCashOut) || "0"} đ</span>
              </div>
              <div className={`${summaryRow} bg-amber-50 px-1 py-1 -mx-1 rounded-sm font-bold`}>
                <span>Dự kiến (1+2+3-4):</span>
                <span>{formatMoney(data.expectedCash) || "0"} đ</span>
              </div>
              <div className={`${summaryRow} bg-emerald-50 px-1 py-1 -mx-1 rounded-sm`}>
                <span>Thực tế đếm được:</span>
                <span>{formatMoney(data.closingCash) || "0"} đ</span>
              </div>
              <div
                className={`${summaryRow} px-1 py-1 -mx-1 rounded-sm font-bold ${difference < 0 ? "bg-emerald-50" : "bg-red-50"}`}
              >
                <span>
                  Chênh lệch {difference < 0 ? "(Thiếu)" : difference > 0 ? "(Thừa)" : ""}:
                </span>
                <span>{formatMoney(Math.abs(difference)) || "0"} đ</span>
              </div>
            </>
          )}

          {hasChecklist && (
            <>
              <div className={sectionTitle}>CHECKLIST {hasClosing ? "CUỐI CA" : "ĐẦU CA"}</div>
              {Object.entries(checklistData!).map(([key, value]) => (
                <div key={key} className={summaryRow}>
                  <span>{checklistKeyMap[key as keyof typeof checklistKeyMap] || key}:</span>
                  <span className={bold}>{value ? "✓ Đã kiểm tra" : "✗ Chưa"}</span>
                </div>
              ))}
            </>
          )}

          {data.note && (
            <>
              <div className={sectionTitle}>GHI CHÚ</div>
              <div className="py-1">
                <span>{data.note}</span>
              </div>
            </>
          )}
        </main>

        <footer className="mt-4 flex flex-col items-center">
          <span className="!text-[8px] mt-1">
            In lúc: {formatVietNamDate(new Date().toISOString())}
          </span>
          <div className="mt-4 flex w-full">
            <div className="flex flex-col items-center flex-1">
              <span className="font-semibold !text-[8px]">NV giao ca</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="font-semibold !text-[8px]">NV nhận ca</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ShiftPrint;
