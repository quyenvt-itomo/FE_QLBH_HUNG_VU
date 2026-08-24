import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import { TimeRangePickerProps } from "antd/lib";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { getSessionEndDate, getSessionStartDate } from "@/shared/utils/date.util";
import { CLASSNAME } from "@/shared/constants/ui";

dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek); // Đảm bảo tuần bắt đầu từ Thứ Hai
dayjs.locale("vi");

const { RangePicker } = DatePicker;

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Hôm nay", value: [dayjs().startOf("day"), dayjs().endOf("day")] },
  {
    label: "Hôm qua",
    value: [dayjs().subtract(1, "day").startOf("day"), dayjs().subtract(1, "day").endOf("day")],
  },
  {
    label: "Tuần này",
    value: [
      dayjs().startOf("isoWeek"), // Bắt đầu từ Thứ Hai
      dayjs().endOf("isoWeek"), // Kết thúc vào Chủ Nhật
    ],
  },
  {
    label: "Tuần trước",
    value: [
      dayjs().subtract(1, "week").startOf("isoWeek"),
      dayjs().subtract(1, "week").endOf("isoWeek"),
    ],
  },
  {
    label: "Tháng này",
    value: [dayjs().startOf("month"), dayjs().endOf("month")],
  },
  {
    label: "Tháng trước",
    value: [
      dayjs().subtract(1, "month").startOf("month"),
      dayjs().subtract(1, "month").endOf("month"),
    ],
  },
];

interface DateRangeFilterProps {
  onRangeChange: (start_date: string | undefined, end_date: string | undefined) => void;
  className?: string;
  style?: React.CSSProperties;
  startDate?: string | null;
  endDate?: string | null;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onRangeChange,
  className = "",
  style,
  startDate,
  endDate,
}) => {
  const defaultStartDate = dayjs(getSessionStartDate());
  const defaultEndDate = dayjs(getSessionEndDate());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Gọi onRangeChange ngay khi component mount
  useEffect(() => {
    onRangeChange(defaultStartDate.format("YYYY-MM-DD"), defaultEndDate.format("YYYY-MM-DD"));
  }, []);

  const handleChange = (dates: null | (Dayjs | null)[]) => {
    if (dates && dates[0] && dates[1]) {
      onRangeChange(dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD"));
    } else {
      onRangeChange(undefined, undefined);
    }
  };

  return (
    <div style={{ width: 238 }} className="flex-shrink-0">
      <RangePicker
        prefix={<CalendarDaysIcon className="w-4 h-4 mr-1" />}
        style={style}
        format={"DD/MM/YYYY"}
        placeholder={["Từ ngày", "Đến ngày"]}
        suffixIcon={null}
        className={`custom-range-picker ${CLASSNAME.inputHeight} ${className}`}
        allowClear={false}
        showTime={false}
        presets={isMobile ? undefined : rangePresets}
        value={[dayjs(startDate || defaultStartDate), dayjs(endDate || defaultEndDate)]}
        onChange={handleChange}
        defaultValue={[defaultStartDate, defaultEndDate]}
        popupStyle={{ userSelect: "none" }}
        dropdownClassName={isMobile ? "custom-range-picker" : ""}
      />
    </div>
  );
};

export { DateRangeFilter };
