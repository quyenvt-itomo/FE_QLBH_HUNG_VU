import dayjs from "dayjs";

export const getDefaultAnalysisPeriod = (): string => `month-${dayjs().format("MM-YYYY")}`;
