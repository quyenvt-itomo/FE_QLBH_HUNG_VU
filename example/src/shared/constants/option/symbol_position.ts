import { SymbolPosition } from "@/shared/interfaces/format";

export const symbol_position_options: {
  value: SymbolPosition;
  label: string;
}[] = [
  { value: "none", label: "Không có" },
  { value: "before", label: "Trước số tiền" },
  { value: "after", label: "Sau số tiền" },
];
