import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export const getDatePresets = () => [
  { label: "Hôm nay", start: dayjs().startOf("day"), end: dayjs().endOf("day") },
  {
    label: "Hôm qua",
    start: dayjs().subtract(1, "day").startOf("day"),
    end: dayjs().subtract(1, "day").endOf("day"),
  },
  { label: "Tuần này", start: dayjs().startOf("isoWeek"), end: dayjs().endOf("isoWeek") },
  {
    label: "Tuần trước",
    start: dayjs().subtract(1, "week").startOf("isoWeek"),
    end: dayjs().subtract(1, "week").endOf("isoWeek"),
  },
  { label: "Tháng này", start: dayjs().startOf("month"), end: dayjs().endOf("month") },
  {
    label: "Tháng trước",
    start: dayjs().subtract(1, "month").startOf("month"),
    end: dayjs().subtract(1, "month").endOf("month"),
  },
];

export const getActiveDatePresetLabel = (startAt?: string | null, endAt?: string | null) => {
  if (!startAt || !endAt) return null;
  return (
    getDatePresets().find(
      (preset) =>
        dayjs(startAt).isSame(preset.start, "day") && dayjs(endAt).isSame(preset.end, "day"),
    )?.label ?? null
  );
};

