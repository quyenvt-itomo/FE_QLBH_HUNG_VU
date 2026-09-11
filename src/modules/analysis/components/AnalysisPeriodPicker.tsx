import React, { useEffect, useMemo, useState } from "react";
import { Popover } from "antd";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { AnalysisPeriod } from "../analysis.model";

dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

type PickerMode = "quick" | "week" | "month" | "quarter" | "year";

const MIN_DATE = dayjs("2026-01-01").startOf("day");
const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const today = () => dayjs().startOf("day");

const getMode = (period: AnalysisPeriod): PickerMode => {
  if (period.startsWith("week-")) return "week";
  if (period.startsWith("month-")) return "month";
  if (period.startsWith("quarter-") || period.startsWith("quater-")) return "quarter";
  if (period.startsWith("year-")) return "year";
  return "quick";
};

const clampRange = (start: Dayjs, end: Dayjs): [Dayjs, Dayjs] => {
  const currentDay = today();
  const nextStart = start.isBefore(MIN_DATE, "day") ? MIN_DATE : start.startOf("day");
  const nextEnd = end.isAfter(currentDay, "day") ? currentDay : end.startOf("day");
  return [nextStart, nextEnd.isBefore(nextStart, "day") ? nextStart : nextEnd];
};

const periodRange = (period: AnalysisPeriod): [Dayjs, Dayjs] => {
  if (period === "day-7" || period === "day-30") {
    const days = period === "day-7" ? 7 : 30;
    return clampRange(today().subtract(days - 1, "day"), today());
  }

  const parts = period.split("-");
  if (parts[0] === "week" && parts[1] && parts[2]) {
    const start = dayjs(`${today().year()}-${parts[2]}-${parts[1]}`);
    return clampRange(start, start.add(6, "day"));
  }
  if (parts[0] === "month" && parts[1] && parts[2]) {
    const start = dayjs(`${parts[2]}-${parts[1]}-01`);
    return clampRange(start, start.endOf("month"));
  }
  if ((parts[0] === "quarter" || parts[0] === "quater") && parts[1] && parts[2]) {
    const start = dayjs(`${parts[2]}-${parts[1]}-01`);
    return clampRange(start, start.add(2, "month").endOf("month"));
  }
  if (parts[0] === "year" && parts[1]) {
    const start = dayjs(`${parts[1]}-01-01`);
    return clampRange(start, start.endOf("year"));
  }
  return clampRange(today().subtract(6, "day"), today());
};

const formatPeriodRange = (period: AnalysisPeriod) => {
  const [start, end] = periodRange(period);
  return `${start.format("DD/MM/YYYY")} - ${end.format("DD/MM/YYYY")}`;
};

const isSameQuarter = (first: Dayjs, second: Dayjs) =>
  first.year() === second.year() && first.quarter() === second.quarter();

interface AnalysisPeriodPickerProps {
  value: AnalysisPeriod;
  onChange: (value: AnalysisPeriod) => void;
}

export const AnalysisPeriodPicker: React.FC<AnalysisPeriodPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PickerMode>(() => getMode(value));
  const [panelDate, setPanelDate] = useState<Dayjs>(() => periodRange(value)[0]);

  useEffect(() => {
    setMode(getMode(value));
    setPanelDate(periodRange(value)[0]);
  }, [value]);

  const selectedRange = useMemo(() => periodRange(value), [value]);

  const choose = (period: AnalysisPeriod) => {
    onChange(period);
    setOpen(false);
  };

  const renderQuickRange = () => (
    <div className="flex min-h-[260px] flex-1 items-center justify-center px-8 text-sm text-blue-600">
      {formatPeriodRange(value)}
    </div>
  );

  const renderWeek = () => {
    const firstDay = panelDate.startOf("month").startOf("isoWeek");
    const days = Array.from({ length: 42 }, (_, index) => firstDay.add(index, "day"));

    return (
      <div className="w-[310px]">
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
          <button
            type="button"
            className="p-1"
            onClick={() => setPanelDate((date) => date.subtract(1, "month"))}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium">Tháng {panelDate.format("M YYYY")}</span>
          <button
            type="button"
            className="p-1"
            onClick={() => setPanelDate((date) => date.add(1, "month"))}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 px-3 pt-3 text-center text-xs text-slate-500">
          {WEEKDAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1 p-3 pt-2">
          {days.map((date) => {
            const weekStart = date.startOf("isoWeek");
            const isSelected = selectedRange[0].isSame(weekStart, "day");
            const inSelectedRange =
              !date.isBefore(selectedRange[0], "day") && !date.isAfter(selectedRange[1], "day");
            const disabled = date.isBefore(MIN_DATE, "day") || date.isAfter(today(), "day");

            return (
              <button
                key={date.format("YYYY-MM-DD")}
                type="button"
                disabled={disabled}
                onClick={() => choose(`week-${weekStart.format("DD-MM")}`)}
                className={`h-9 rounded-md text-xs transition ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : inSelectedRange
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700"
                } ${!date.isSame(panelDate, "month") ? "text-slate-300" : ""} ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-blue-100"}`}
              >
                {date.date()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonth = () => (
    <div className="w-[310px]">
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
        <button
          type="button"
          className="p-1"
          onClick={() => setPanelDate((date) => date.subtract(1, "year"))}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">{panelDate.format("YYYY")}</span>
        <button
          type="button"
          className="p-1"
          onClick={() => setPanelDate((date) => date.add(1, "year"))}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 p-5">
        {Array.from({ length: 12 }, (_, index) => {
          const month = panelDate.startOf("year").add(index, "month");
          const disabled = month.isBefore(MIN_DATE, "month") || month.isAfter(today(), "month");
          const selected = getMode(value) === "month" && selectedRange[0].isSame(month, "month");

          return (
            <button
              key={month.format("YYYY-MM")}
              type="button"
              disabled={disabled}
              onClick={() => choose(`month-${month.format("MM-YYYY")}`)}
              className={`h-12 rounded-md text-sm ${selected ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"} ${disabled ? "cursor-not-allowed text-slate-300" : ""}`}
            >
              Tháng {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderQuarter = () => (
    <div className="w-[310px]">
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
        <button
          type="button"
          className="p-1"
          onClick={() => setPanelDate((date) => date.subtract(1, "year"))}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">{panelDate.format("YYYY")}</span>
        <button
          type="button"
          className="p-1"
          onClick={() => setPanelDate((date) => date.add(1, "year"))}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 p-5">
        {Array.from({ length: 12 }, (_, index) => {
          const month = panelDate.startOf("year").add(index, "month");
          const quarterStart = month.startOf("quarter");
          const quarterEnd = quarterStart.add(2, "month").endOf("month");
          const disabled =
            quarterStart.isBefore(MIN_DATE, "month") || quarterStart.isAfter(today(), "month");
          const selected =
            getMode(value) === "quarter" && isSameQuarter(selectedRange[0], quarterStart);

          return (
            <button
              key={month.format("YYYY-MM")}
              type="button"
              disabled={disabled}
              onClick={() => choose(`quarter-${quarterStart.format("MM-YYYY")}`)}
              className={`h-12 rounded-md text-sm ${selected ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"} ${disabled ? "cursor-not-allowed text-slate-300" : ""}`}
              title={`${quarterStart.format("MM/YYYY")} - ${quarterEnd.format("MM/YYYY")}`}
            >
              Tháng {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderYear = () => {
    const decadeStart = Math.floor(panelDate.year() / 10) * 10;
    return (
      <div className="w-[310px]">
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
          <button
            type="button"
            className="p-1"
            onClick={() => setPanelDate((date) => date.subtract(10, "year"))}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium">
            {decadeStart} - {decadeStart + 9}
          </span>
          <button
            type="button"
            className="p-1"
            onClick={() => setPanelDate((date) => date.add(10, "year"))}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 p-5">
          {Array.from({ length: 10 }, (_, index) => {
            const year = decadeStart + index;
            const yearDate = dayjs(`${year}-01-01`);
            const disabled =
              yearDate.isBefore(MIN_DATE, "year") || yearDate.isAfter(today(), "year");
            const selected = getMode(value) === "year" && selectedRange[0].year() === year;

            return (
              <button
                key={year}
                type="button"
                disabled={disabled}
                onClick={() => choose(`year-${year}`)}
                className={`h-12 rounded-md text-sm ${selected ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"} ${disabled ? "cursor-not-allowed text-slate-300" : ""}`}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const modeContent =
    mode === "week"
      ? renderWeek()
      : mode === "month"
        ? renderMonth()
        : mode === "quarter"
          ? renderQuarter()
          : mode === "year"
            ? renderYear()
            : renderQuickRange();

  const menuItem = (
    label: string,
    itemMode: PickerMode,
    onClick: () => void,
    active = mode === itemMode,
  ) => (
    <button
      type="button"
      className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm ${active ? "bg-blue-50 text-blue-600" : "text-slate-800 hover:bg-slate-50"}`}
      onClick={onClick}
    >
      <span>{label}</span>
      {itemMode !== "quick" && <ChevronRightIcon className="h-4 w-4" />}
    </button>
  );

  const content = (
    <div className="flex min-h-[260px] w-[510px] overflow-hidden rounded-xl bg-white">
      <div className="w-[200px] shrink-0 border-r border-slate-200 p-2">
        {menuItem("Trong 7 ngày qua", "quick", () => choose("day-7"), value === "day-7")}
        {menuItem("Trong 30 ngày qua", "quick", () => choose("day-30"), value === "day-30")}
        <div className="my-2 border-t border-slate-200" />
        {menuItem("Theo tuần", "week", () => {
          setMode("week");
          setPanelDate(periodRange(value)[0]);
        })}
        {menuItem("Theo tháng", "month", () => {
          setMode("month");
          setPanelDate(periodRange(value)[0]);
        })}
        {menuItem("Theo quý", "quarter", () => {
          setMode("quarter");
          setPanelDate(periodRange(value)[0]);
        })}
        {menuItem("Theo năm", "year", () => {
          setMode("year");
          setPanelDate(periodRange(value)[0]);
        })}
      </div>
      {modeContent}
    </div>
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomRight"
      content={content}
      styles={{ body: { padding: 0 } }}
    >
      <button
        type="button"
        className="flex h-8 min-w-[250px] items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm hover:border-blue-500 focus:border-blue-500"
      >
        <CalendarDaysIcon className="h-4 w-4 text-slate-500" />
        <span className="flex-1 text-left">{formatPeriodRange(value)}</span>
        <ChevronDownIcon className="h-4 w-4 text-slate-500" />
      </button>
    </Popover>
  );
};
