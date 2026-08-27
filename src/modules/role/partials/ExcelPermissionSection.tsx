import { Switch, Tabs } from "antd";
import { moduleMap } from "@/shared/constants/permission";
import {
  EXCEL_PERMISSION_MODULES,
  ExcelModule,
} from "@/modules/excel/excel.permission.model";
import { Role } from "../role.model";

interface ExcelPermissionSectionProps {
  selectedRow: Role;
  onUpdateRolePermission?: (record: Role) => void;
  disabled?: boolean;
}

export const ExcelPermissionSection: React.FC<
  ExcelPermissionSectionProps
> = ({ selectedRow, onUpdateRolePermission, disabled }) => {
  const toggle = (
    field: "importExcel" | "exportExcel",
    module: ExcelModule,
  ) => {
    const list = selectedRow[field] || [];
    onUpdateRolePermission?.({
      ...selectedRow,
      [field]: list.includes(module)
        ? list.filter((item) => item !== module)
        : [...list, module],
    });
  };

  const render = (field: "importExcel" | "exportExcel") => (
    <div className="grid grid-cols-2 gap-3">
      {EXCEL_PERMISSION_MODULES.map((module) => (
        <div
          key={module}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <span className="text-sm">{moduleMap[module]}</span>
          <Switch
            size="small"
            checked={(selectedRow[field] || []).includes(module)}
            disabled={disabled}
            onChange={() => toggle(field, module)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="px-6 mt-3">
      <Tabs
        items={[
          { key: "import", label: "Quyền nhập Excel", children: render("importExcel") },
          { key: "export", label: "Quyền xuất Excel", children: render("exportExcel") },
        ]}
      />
    </div>
  );
};
