import { useEffect, useState } from "react";
import { CSS } from "../../../../constants/UI";
import { ISystemRole } from "../../../../models/systemRole";
import "./index.css";
import { useSystemRoleData } from "../../../../hooks/useSystemRoleData";
import SystemRoleList from "./partials/SystemRoleList";
import SystemRolePermission from "./partials/SystemRolePermission";

const Page: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<ISystemRole | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const {
    loading,
    errors,
    systemRoleData,
    addSystemRole,
    updateSystemRole,
    updatePermissionSystemRole,
    deleteSystemRole,
  } = useSystemRoleData({});

  useEffect(() => {
    if (systemRoleData.length === 0) return;
    const newRow = systemRoleData.find((item) => item.id === selectedRow?.id);

    if (newRow) return;

    setSelectedRow(systemRoleData[0]);
  }, [systemRoleData, selectedRow]);

  return (
    <div className="flex flex-row h-full gap-3">
      <div
        className="hidden xl:flex"
        style={{
          width: 320,
          ...CSS.container,
        }}
      >
        <SystemRoleList
          dataSource={systemRoleData}
          loading={loading}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          onAdd={addSystemRole}
          onEdit={updateSystemRole}
          onDelete={deleteSystemRole}
        />
      </div>

      <div className="flex-1 flex flex-col" style={CSS.container}>
        <SystemRolePermission
          loading={loading}
          selectedRow={selectedRow}
          onUpdateSystemRolePermission={updatePermissionSystemRole}
          onToggleDrawer={() => setDrawerOpen(!drawerOpen)}
        />
      </div>
    </div>
  );
};

export default Page;
