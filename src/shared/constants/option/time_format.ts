import { TimeFormatData } from "@/shared/interfaces/format";

export const time_format_options: { value: TimeFormatData; label: string }[] = [
  { value: "hh:mm A", label: "12h" },
  { value: "HH:mm", label: "24h" },
];
