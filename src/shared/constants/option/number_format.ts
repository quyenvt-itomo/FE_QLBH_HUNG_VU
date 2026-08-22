import { NumberFormatType } from "@/shared/interfaces/format";

export const number_format_options: {
  value: NumberFormatType;
  label: string;
}[] = [
  { value: ".", label: "Dấu chấm hàng nghìn, dấu phẩy hàng thập phân" },
  { value: ",", label: "Dấu phẩy hàng nghìn, dấu chấm hàng thập phân" },
];
