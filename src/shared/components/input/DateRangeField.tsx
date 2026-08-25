import { useEffect, useState } from "react";
import { Button, DatePicker, Dropdown } from "antd";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Lunar, LunarMonth, Solar } from "lunar-javascript";
import { Ranger, RangerKey } from "@/shared/interfaces/common";

dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

type DateBoundary = "start" | "end";
type DateRangeMode =
  | "all"
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "last7Days"
  | "thisMonth"
  | "lastMonth"
  | "last30Days"
  | "thisLunarMonth"
  | "lastLunarMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "lastYear"
  | "thisLunarYear"
  | "lastLunarYear"
  | "custom";

type RangePreset = {
  key: Exclude<DateRangeMode, "all" | "custom">;
  label: string;
  value: [Dayjs, Dayjs];
};

type PresetGroup = {
  label: string;
  items: RangePreset[];
};

const solarToDayjs = (solar: { getYear(): number; getMonth(): number; getDay(): number }) =>
  dayjs(new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay()));

const getLunarMonthRange = (offset: number): [Dayjs, Dayjs] => {
  const currentLunar = Solar.fromDate(new Date()).getLunar();
  const currentMonth = LunarMonth.fromYm(currentLunar.getYear(), currentLunar.getMonth()).next(
    offset,
  );
  const nextMonth = currentMonth.next(1);

  const start = solarToDayjs(Solar.fromJulianDay(currentMonth.getFirstJulianDay())).startOf("day");
  const end = solarToDayjs(Solar.fromJulianDay(nextMonth.getFirstJulianDay()))
    .subtract(1, "day")
    .endOf("day");

  return [start, end];
};

const getLunarYearRange = (offset: number): [Dayjs, Dayjs] => {
  const currentLunar = Solar.fromDate(new Date()).getLunar();
  const lunarYear = currentLunar.getYear() + offset;
  const start = solarToDayjs(Lunar.fromYmd(lunarYear, 1, 1).getSolar()).startOf("day");
  const end = solarToDayjs(Lunar.fromYmd(lunarYear + 1, 1, 1).getSolar())
    .subtract(1, "day")
    .endOf("day");

  return [start, end];
};

const rangePresets: RangePreset[] = [
  { key: "today", label: "Hôm nay", value: [dayjs().startOf("day"), dayjs().endOf("day")] },
  {
    key: "yesterday",
    label: "Hôm qua",
    value: [dayjs().subtract(1, "day").startOf("day"), dayjs().subtract(1, "day").endOf("day")],
  },
  {
    key: "thisWeek",
    label: "Tuần này",
    value: [dayjs().startOf("isoWeek"), dayjs().endOf("isoWeek")],
  },
  {
    key: "lastWeek",
    label: "Tuần trước",
    value: [
      dayjs().subtract(1, "week").startOf("isoWeek"),
      dayjs().subtract(1, "week").endOf("isoWeek"),
    ],
  },
  {
    key: "last7Days",
    label: "7 ngày qua",
    value: [dayjs().subtract(6, "day").startOf("day"), dayjs().endOf("day")],
  },
  {
    key: "thisMonth",
    label: "Tháng này",
    value: [dayjs().startOf("month"), dayjs().endOf("month")],
  },
  {
    key: "lastMonth",
    label: "Tháng trước",
    value: [
      dayjs().subtract(1, "month").startOf("month"),
      dayjs().subtract(1, "month").endOf("month"),
    ],
  },
  {
    key: "last30Days",
    label: "30 ngày qua",
    value: [dayjs().subtract(29, "day").startOf("day"), dayjs().endOf("day")],
  },
  {
    key: "thisLunarMonth",
    label: "Tháng này (âm)",
    value: getLunarMonthRange(0),
  },
  {
    key: "lastLunarMonth",
    label: "Tháng trước (âm)",
    value: getLunarMonthRange(-1),
  },
  {
    key: "thisQuarter",
    label: "Quý này",
    value: [dayjs().startOf("quarter"), dayjs().endOf("quarter")],
  },
  {
    key: "lastQuarter",
    label: "Quý trước",
    value: [
      dayjs().subtract(1, "quarter").startOf("quarter"),
      dayjs().subtract(1, "quarter").endOf("quarter"),
    ],
  },
  {
    key: "thisYear",
    label: "Năm nay",
    value: [dayjs().startOf("year"), dayjs().endOf("year")],
  },
  {
    key: "lastYear",
    label: "Năm trước",
    value: [dayjs().subtract(1, "year").startOf("year"), dayjs().subtract(1, "year").endOf("year")],
  },
  {
    key: "thisLunarYear",
    label: "Năm nay (âm)",
    value: getLunarYearRange(0),
  },
  {
    key: "lastLunarYear",
    label: "Năm trước (âm)",
    value: getLunarYearRange(-1),
  },
];

const presetGroups: PresetGroup[] = [
  {
    label: "Theo ngày",
    items: rangePresets.filter(({ key }) => ["today", "yesterday"].includes(key)),
  },
  {
    label: "Theo tuần",
    items: rangePresets.filter(({ key }) => ["thisWeek", "lastWeek", "last7Days"].includes(key)),
  },
  {
    label: "Theo tháng",
    items: rangePresets.filter(({ key }) =>
      ["thisMonth", "lastMonth", "thisLunarMonth", "lastLunarMonth", "last30Days"].includes(key),
    ),
  },
  {
    label: "Theo quý",
    items: rangePresets.filter(({ key }) => ["thisQuarter", "lastQuarter"].includes(key)),
  },
  {
    label: "Theo năm",
    items: rangePresets.filter(({ key }) =>
      ["thisYear", "lastYear", "thisLunarYear", "lastLunarYear"].includes(key),
    ),
  },
];

interface DateRangeFieldProps {
  fieldKey: RangerKey;
  value?: Ranger;
  onChange: (value: Ranger) => void;
  disabled?: boolean;
}

const formatDate = (date: Dayjs | null, boundary: DateBoundary): string | undefined => {
  if (!date) return undefined;

  return (boundary === "start" ? date.startOf("day") : date.endOf("day")).toISOString();
};

const sameDateRange = (startValue: unknown, endValue: unknown, range: [Dayjs, Dayjs]) =>
  typeof startValue === "string" &&
  typeof endValue === "string" &&
  dayjs(startValue).valueOf() === range[0].startOf("day").valueOf() &&
  dayjs(endValue).valueOf() === range[1].endOf("day").valueOf();

export function DateRangeField({
  fieldKey,
  value,
  onChange,
  disabled = false,
}: DateRangeFieldProps) {
  const startKey = `${fieldKey}Gte` as keyof Ranger;
  const endKey = `${fieldKey}Lte` as keyof Ranger;
  const startValue = value?.[startKey];
  const endValue = value?.[endKey];
  const [open, setOpen] = useState(false);

  const detectedMode: DateRangeMode =
    !startValue && !endValue
      ? "all"
      : rangePresets.find((preset) => sameDateRange(startValue, endValue, preset.value))?.key ||
        "custom";

  const [customSelected, setCustomSelected] = useState(detectedMode === "custom");
  const selectedMode = customSelected ? "custom" : detectedMode;
  const selectedLabel =
    selectedMode === "all"
      ? "Toàn thời gian"
      : selectedMode === "custom"
        ? "Tùy chỉnh"
        : rangePresets.find(({ key }) => key === selectedMode)?.label || "Toàn thời gian";

  useEffect(() => {
    if (!startValue && !endValue) setCustomSelected(false);
  }, [value, startValue, endValue]);

  const clearDateRange = () => {
    const nextValue: Ranger = { ...value };
    ["Gte", "Gt", "Eq", "Lte", "Lt"].forEach((operator) => {
      delete nextValue[`${fieldKey}${operator}` as keyof Ranger];
    });
    onChange(nextValue);
  };

  const applyPreset = (mode: DateRangeMode) => {
    setOpen(false);

    if (mode === "all") {
      setCustomSelected(false);
      clearDateRange();
      return;
    }

    if (mode === "custom") {
      setCustomSelected(true);
      return;
    }

    const preset = rangePresets.find((item) => item.key === mode);
    if (!preset) return;

    const nextValue: Ranger = { ...value };
    nextValue[startKey] = formatDate(preset.value[0], "start");
    nextValue[endKey] = formatDate(preset.value[1], "end");
    setCustomSelected(false);
    onChange(nextValue);
  };

  const handleDateChange = (boundary: DateBoundary, date: Dayjs | null) => {
    const nextValue: Ranger = { ...value };
    const key = boundary === "start" ? startKey : endKey;
    const nextDate = formatDate(date, boundary);

    if (nextDate) nextValue[key] = nextDate;
    else delete nextValue[key];

    if (!nextValue[startKey] && !nextValue[endKey]) setCustomSelected(false);
    onChange(nextValue);
  };

  const dropdownContent = (
    <div className="w-[740px] max-w-[calc(100vw-24px)] rounded-xl border border-gray-100 bg-white p-5 shadow-xl">
      <div className="grid grid-cols-5 gap-5">
        {presetGroups.map((group) => (
          <div key={group.label} className="min-w-0">
            <div className="mb-3 text-sm font-semibold text-gray-800">{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((preset) => {
                const active = selectedMode === preset.key;
                return (
                  <button
                    key={preset.key}
                    type="button"
                    className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-sm transition ${
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 bg-white text-gray-600 hover:border-primary hover:text-primary"
                    }`}
                    onClick={() => applyPreset(preset.key)}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          className={`rounded-lg border px-3 py-1.5 text-sm transition ${
            selectedMode === "all"
              ? "border-primary bg-primary text-white"
              : "border-gray-300 bg-white text-gray-600 hover:border-primary hover:text-primary"
          }`}
          onClick={() => applyPreset("all")}
        >
          Toàn thời gian
        </button>
        <button
          type="button"
          className={`rounded-lg border px-3 py-1.5 text-sm transition ${
            selectedMode === "custom"
              ? "border-primary bg-primary text-white"
              : "border-gray-300 bg-white text-gray-600 hover:border-primary hover:text-primary"
          }`}
          onClick={() => applyPreset("custom")}
        >
          Tùy chỉnh
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <Dropdown
        trigger={["click"]}
        open={open}
        onOpenChange={setOpen}
        placement="bottomLeft"
        align={{
          points: ["tr", "tl"],
          offset: [-2, -2],
          overflow: { adjustX: 1, adjustY: 1 },
        }}
        dropdownRender={() => dropdownContent}
      >
        <Button disabled={disabled} className="w-full flex items-center justify-between">
          <span className="truncate">{selectedLabel}</span>
          <ChevronRightIcon className="ml-2 h-4 w-4 shrink-0 text-gray-500" />
        </Button>
      </Dropdown>

      {selectedMode === "custom" && (
        <div className="flex w-full items-center overflow-hidden rounded-lg border border-gray-300 bg-white transition hover:border-primary">
          <DatePicker
            variant="borderless"
            className="min-w-0 flex-1 !border-0 !shadow-none"
            format="DD/MM/YYYY"
            placeholder="Từ ngày"
            allowClear
            disabled={disabled}
            value={typeof startValue === "string" ? dayjs(startValue) : null}
            onChange={(date) => handleDateChange("start", date)}
          />

          <span className="shrink-0 text-gray-400">-</span>

          <DatePicker
            variant="borderless"
            className="min-w-0 flex-1 !border-0 !shadow-none"
            format="DD/MM/YYYY"
            placeholder="Đến ngày"
            allowClear
            disabled={disabled}
            value={typeof endValue === "string" ? dayjs(endValue) : null}
            onChange={(date) => handleDateChange("end", date)}
          />
        </div>
      )}
    </div>
  );
}
