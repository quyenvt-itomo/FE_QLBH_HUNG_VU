import { Switch } from "antd";
import { FileSpreadsheet } from "lucide-react";
import {
  EXCEL_MODULES,
} from "@/modules/excel/excel.permission.model";
import { moduleMap } from "@/shared/constants/permission";
import type { Module } from "@/shared/constants/permission";

interface ExcelModuleSwitchGroupProps {
  value?: Module[];
  onChange?: (value: Module[]) => void;
  disabled?: boolean;
  mode?: "import" | "export";
}

export const ExcelModuleSwitchGroup: React.FC<
  ExcelModuleSwitchGroupProps
> = ({ value = [], onChange, disabled, mode = "export" }) => {
  const isImport = mode === "import";
  const accentColor = isImport ? "emerald" : "blue";
  const label = isImport ? "Nhập Excel" : "Xuất Excel";
  const subtitle = isImport
    ? "Quyền nhập dữ liệu theo từng module"
    : "Quyền xuất dữ liệu theo từng module";

  const handleToggle = (module: Module, checked: boolean) => {
    const next = checked
      ? Array.from(new Set([...value, module]))
      : value.filter((item) => item !== module);
    onChange?.(next);
  };

  return (
    <div
      className={
        "flex flex-col p-4 border border-" +
        accentColor +
        "-200 dark:border-" +
        accentColor +
        "-900/60 rounded-lg bg-" +
        accentColor +
        "-50/40 dark:bg-" +
        accentColor +
        "-950/20"
      }
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className={
            "flex items-center justify-center w-8 h-8 rounded-md bg-" +
            accentColor +
            "-100 dark:bg-" +
            accentColor +
            "-900/50"
          }
        >
          <FileSpreadsheet
            size={17}
            className={"text-" + accentColor + "-600 dark:text-" + accentColor + "-400"}
          />
        </div>
        <div>
          <div className="text-[14px] font-medium text-slate-800 dark:text-gray-100">
            {label}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-1">
        {EXCEL_MODULES.map((module) => (
          <div
            key={module}
            className="flex items-center justify-between min-h-11 px-3 rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/50"
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileSpreadsheet
                size={15}
                className={
                  "shrink-0 text-" +
                  accentColor +
                  "-600 dark:text-" +
                  accentColor +
                  "-400"
                }
              />
              <span className="text-sm text-slate-700 dark:text-slate-200 truncate">
                {moduleMap[module]}
              </span>
            </div>
            <Switch
              size="small"
              checked={value.includes(module)}
              disabled={disabled}
              onChange={(checked) => handleToggle(module, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
