import { Switch } from "antd";
import { FileSpreadsheet } from "lucide-react";
import { Module, moduleMap } from "@/shared/constants/permission";
import { ExcelEntityType, ENTITY_SUPPORTS_IMPORT } from "@/modules/excel/excel.enum";
import { mapEntityTypeToModule } from "@/modules/excel/excel.util";

// Reverse map: Module → { entityType, supportsImport }
const moduleToEntityType = new Map<
  Module,
  { entityType: ExcelEntityType; supportsImport: boolean }
>();
for (const et of Object.values(ExcelEntityType)) {
  const mod = mapEntityTypeToModule(et);
  if (mod) {
    moduleToEntityType.set(mod, { entityType: et, supportsImport: ENTITY_SUPPORTS_IMPORT[et] });
  }
}
const excelModules = Array.from(moduleToEntityType.entries());

interface ExcelModuleSwitchGroupProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  /** "import" | "export" — import mode sẽ disable các module không hỗ trợ import */
  mode?: "import" | "export";
}

export const ExcelModuleSwitchGroup: React.FC<ExcelModuleSwitchGroupProps> = ({
  value = [],
  onChange,
  disabled,
  mode = "export",
}) => {
  const isImport = mode === "import";
  const accentColor = isImport ? "emerald" : "blue";
  const label = isImport ? "Nhập Excel" : "Xuất Excel";
  const subtitle = isImport
    ? "Quyền nhập dữ liệu theo từng module"
    : "Quyền xuất dữ liệu theo từng module";

  const handleToggle = (module: Module, checked: boolean) => {
    const newValue = checked ? [...value, module] : value.filter((m) => m !== module);
    onChange?.(newValue);
  };

  return (
    <div
      className={`flex flex-col p-4 border border-${accentColor}-200 dark:border-${accentColor}-900/60 rounded-lg bg-${accentColor}-50/40 dark:bg-${accentColor}-950/20`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-md bg-${accentColor}-100 dark:bg-${accentColor}-900/50`}
          >
            <FileSpreadsheet
              size={17}
              className={`text-${accentColor}-600 dark:text-${accentColor}-400`}
            />
          </div>
          <div>
            <div className="text-[14px] font-medium text-slate-800 dark:text-gray-100">{label}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 px-1">
        {excelModules.map(([module, { supportsImport }]) => {
          const checked = value.includes(module);
          const itemDisabled = disabled || (isImport && !supportsImport);

          return (
            <div
              key={`${mode}-${module}`}
              className={`
                flex items-center justify-between
                min-h-11 px-3 rounded-md
                border border-slate-200
                bg-white
                hover:border-${accentColor}-300 hover:bg-${accentColor}-50/50
                transition-colors
                dark:border-slate-700 dark:bg-slate-900/50
                dark:hover:border-${accentColor}-700 dark:hover:bg-${accentColor}-950/30
                ${itemDisabled ? "opacity-40" : ""}
              `}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileSpreadsheet
                  size={15}
                  className={`shrink-0 text-${accentColor}-600 dark:text-${accentColor}-400`}
                />
                <span
                  className="text-sm text-slate-700 dark:text-slate-200 truncate"
                  title={moduleMap[module]}
                >
                  {moduleMap[module]}
                </span>
              </div>
              <Switch
                size="small"
                checked={checked}
                disabled={itemDisabled}
                onChange={(v) => handleToggle(module, v)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
