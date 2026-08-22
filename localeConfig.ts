import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/ja";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.updateLocale("vi", {
  monthsShort: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  weekStart: 1,
});

export default dayjs;
