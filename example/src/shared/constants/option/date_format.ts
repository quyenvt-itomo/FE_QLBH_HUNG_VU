import { DateFormatData } from "@/shared/interfaces/format";

export const date_format_options: { value: DateFormatData; label: string }[] = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY/MM/DD", label: "YYYY/MM/DD" },
];
