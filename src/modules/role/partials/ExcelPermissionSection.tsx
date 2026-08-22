import { Form, Switch, Tabs } from "antd";
import { Module, moduleMap } from "@/shared/constants/permission";
import { ExcelEntityType, ENTITY_SUPPORTS_IMPORT } from "@/modules/excel/excel.enum";
import { mapEntityTypeToModule } from "@/modules/excel/excel.util";
import { Role } from "../role.model";

const { TabPane } = Tabs;

// Build reverse map: Module → ExcelEntityType (if supported)
const moduleToEntityType = new Map<
  Module,
  { entityType: ExcelEntityType; supportsImport: boolean }
>();
for (const et of Object.values(ExcelEntityType)) {
  const mod = mapEntityTypeToModule(et);
  if (mod) {
    moduleToEntityType.set(mod, {
      entityType: et,
      supportsImport: ENTITY_SUPPORTS_IMPORT[et],
    });
  }
}

interface ExcelPermissionSectionProps {
  selectedRow: Role;
  onUpdateRolePermission?: (record: Role) => void;
  disabled?: boolean;
}

export const ExcelPermissionSection: React.FC<ExcelPermissionSectionProps> = ({
  selectedRow,
  onUpdateRolePermission,
  disabled,
}) => {
  const importModules: Module[] = selectedRow.importExcel || [];
  const exportModules: Module[] = selectedRow.exportExcel || [];

  const excelModules = Array.from(moduleToEntityType.entries());

  const toggleModule = (list: Module[], module: Module, field: "importExcel" | "exportExcel") => {
    const newList = list.includes(module) ? list.filter((m) => m !== module) : [...list, module];

    onUpdateRolePermission?.({
      ...selectedRow,
      [field]: newList,
    });
  };

  return (
    <div className="px-6 mt-3">
      <Tabs defaultActiveKey="import">
        <TabPane tab="Quyền Import" key="import">
          <div className="grid grid-cols-2 gap-3">
            {excelModules.map(([module, { entityType, supportsImport }]) => {
              const checked = importModules.includes(module);
              return (
                <div
                  key={module}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    !supportsImport ? "opacity-40" : ""
                  }`}
                >
                  <span className="text-sm">{moduleMap[module]}</span>
                  <Switch
                    size="small"
                    checked={checked}
                    disabled={disabled || !supportsImport}
                    onChange={() => toggleModule(importModules, module, "importExcel")}
                  />
                </div>
              );
            })}
          </div>
        </TabPane>

        <TabPane tab="Quyền Export" key="export">
          <div className="grid grid-cols-2 gap-3">
            {excelModules.map(([module]) => {
              const checked = exportModules.includes(module);
              return (
                <div
                  key={module}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span className="text-sm">{moduleMap[module]}</span>
                  <Switch
                    size="small"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleModule(exportModules, module, "exportExcel")}
                  />
                </div>
              );
            })}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
