import { TimeDisplayModeData } from "../../models/base/format";

export const time_display_mode_options: {
  value: TimeDisplayModeData;
  label: string;
}[] = [
  { value: "none", label: "Không hiển thị" },
  { value: "form_only", label: "Chỉ hiển thị trên Form" },
  { value: "table_only", label: "Chỉ hiển thị trên bảng" },
  { value: "both", label: "Hiển thị cả hai" },
];
