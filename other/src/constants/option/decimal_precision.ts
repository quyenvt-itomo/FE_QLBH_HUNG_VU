import { DecimalPrecision } from "../../models/base/format";

export const decimal_precision_options: {
  value: DecimalPrecision;
  label: string;
}[] = [
  { value: 0, label: "Không có" },
  { value: 1, label: "1 chữ số" },
  { value: 2, label: "2 chữ số" },
];
