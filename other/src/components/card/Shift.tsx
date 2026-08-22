import React from "react";
import dayjs from "dayjs";
import { CashKey, IShift } from "../../models/store/shift";
import { formatQuantity } from "../../utils/formatNumber";
import { ChecklistKey, checklistKeyMap } from "../../constants/enum";

interface ShiftCardProps {
  item: IShift;
  onClick?: (item: IShift) => void;
  onEdit?: (item: IShift) => void;
  onDelete?: (item: IShift) => void;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({ item, onClick, onEdit, onDelete }) => {
  const isClosed = !!item.endAt;

  // Logic kiểm tra cùng ngày để hiển thị thời gian thông minh
  const isSameDay = item.endAt ? dayjs(item.startAt).isSame(dayjs(item.endAt), "day") : true;

  return (
    <div
      onClick={() => onClick?.(item)}
      className="group relative bg-white  border border-slate-200  rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
    >
      {/* STATUS */}
      <div className="absolute top-0 right-0 z-10">
        <div
          className={`text-xs uppercase font-medium px-3 py-2 rounded-bl-xl border-l border-b flex items-center gap-2 backdrop-blur-md ${
            isClosed
              ? "bg-slate-100/80 text-slate-600 border-slate-200 /80  "
              : "bg-green-50/90 text-green-700 border-green-200 /10  /20"
          }`}
        >
          {!isClosed && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
          )}

          <span className="font-mono opacity-80">#{item.code}</span>
          <span className="w-[1px] h-3 bg-current opacity-20"></span>
          <span>{isClosed ? "Đã đóng" : "Đang mở"}</span>
        </div>
      </div>

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6 pr-28">
        <div className="w-12 h-12 rounded-full border-2 border-slate-50  shadow-sm overflow-hidden flex-shrink-0 bg-slate-100  flex items-center justify-center">
          <span className="text-base font-semibold text-slate-500">
            {item?.createdBySnapshot?.name?.charAt(0)}
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-base font-semibold text-slate-800  truncate">
            {item?.createdBySnapshot?.name}
          </span>

          <span className="text-xs font-mono text-slate-500  truncate mt-0.5">
            {item?.createdBySnapshot?.code}
            {/* {item?.createdBySnapshot?.phone && ` • ${item?.createdBySnapshot.phone}`} */}
          </span>
        </div>
      </div>

      {/* TIME */}
      <div className="mb-6 bg-slate-50  rounded-xl border border-slate-100 overflow-hidden">
        {isSameDay && (
          <div className="text-center py-1.5 bg-slate-200/30 /30 text-[11px] font-medium text-slate-500  uppercase tracking-wide">
            {dayjs(item.startAt).format("DD MMMM, YYYY")}
          </div>
        )}

        <div className="grid grid-cols-2 divide-x divide-slate-200">
          <div className="flex flex-col p-3 items-center">
            <span className="text-[10px] uppercase text-slate-400 font-medium mb-1">Bắt đầu</span>
            <span className="text-sm font-semibold text-slate-700 ">
              {isSameDay
                ? dayjs(item.startAt).format("HH:mm")
                : dayjs(item.startAt).format("HH:mm DD/MM")}
            </span>
          </div>

          <div className="flex flex-col p-3 items-center">
            <span className="text-[10px] uppercase text-slate-400 font-medium mb-1">Kết thúc</span>
            <span className="text-sm font-semibold text-slate-700">
              {item.endAt
                ? isSameDay
                  ? dayjs(item.endAt).format("HH:mm")
                  : dayjs(item.endAt).format("HH:mm DD/MM")
                : "--:--"}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-6">
        {/* ĐẦU CA */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 ">
              Đầu ca
            </h4>
            <span className="text-base font-bold text-slate-800 ">
              {formatQuantity(item.openingCash) || 0}
            </span>
          </div>

          <CashSnapshotView snapshot={item.openingCashSnapshot} />

          <div className="mt-3 pt-3 border-t border-dashed border-slate-200 ">
            <ChecklistView checklist={item.openingChecklist} />
          </div>
        </section>

        {/* CUỐI CA */}
        <section
          className={`pt-5 border-t-2 ${isClosed ? "border-slate-100 " : "border-transparent"}`}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 ">
              Cuối ca
            </h4>

            <span
              className={`text-base font-bold ${
                isClosed ? "text-slate-800 " : "text-slate-300  italic"
              }`}
            >
              {isClosed ? formatQuantity(item.closingCash) || 0 : "Chưa kết ca"}
            </span>
          </div>

          {isClosed ? (
            <div className="space-y-5">
              <CashSnapshotView snapshot={item.closingCashSnapshot} />

              <div className="bg-slate-50 /60 rounded-xl p-4 border border-slate-100 /50">
                <div className="flex justify-between text-sm text-slate-500  mb-2">
                  <span>Hệ thống ghi nhận</span>
                  <span className="font-semibold text-slate-700 ">
                    {formatQuantity(item.expectedCash) || 0}
                  </span>
                </div>

                <div className="flex justify-between text-base pt-3 border-t border-slate-200  font-semibold">
                  <span className="text-slate-500 ">Chênh lệch</span>
                  <span
                    className={
                      (item.difference || 0) > 0
                        ? "text-blue-600 "
                        : (item.difference || 0) < 0
                          ? "text-red-600 "
                          : "text-slate-700 "
                    }
                  >
                    {(item.difference || 0) > 0 ? "+" : ""}
                    {formatQuantity(item.difference) || 0}
                  </span>
                </div>
              </div>

              <ChecklistView checklist={item.closingChecklist} />
            </div>
          ) : (
            <div className="h-16 flex items-center justify-center border-2 border-dashed border-slate-100  rounded-xl bg-slate-50/50 /20">
              <span className="text-sm text-slate-400  font-medium italic">
                Đang chờ đóng ca...
              </span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export const CashSnapshotView = ({ snapshot }: { snapshot?: Record<CashKey, number> | null }) => {
  if (!snapshot) return null;
  const denominations: CashKey[] = [
    "500000",
    "200000",
    "100000",
    "50000",
    "20000",
    "10000",
    "5000",
    "2000",
    "1000",
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {denominations.map((denom) => {
        const count = snapshot[denom] || 0;
        if (!count) return null;
        return (
          <div
            key={denom}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white  border border-slate-200  shadow-sm"
          >
            <span className="text-xs font-medium text-slate-400 ">{Number(denom) / 1000}k</span>
            <div className="flex h-full border-l"></div>
            <span className="font-semibold text-slate-700 ">{count}</span>
          </div>
        );
      })}
    </div>
  );
};

export const ChecklistView = ({
  checklist,
}: {
  checklist?: Record<ChecklistKey, boolean> | null;
}) => {
  if (!checklist) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {Object.entries(checklist).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${value ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,44,44,0.4)]"}`}
          />
          <span className="text-xs font-medium text-slate-600  uppercase tracking-tight">
            {checklistKeyMap[key as ChecklistKey]}
          </span>
        </div>
      ))}
    </div>
  );
};
