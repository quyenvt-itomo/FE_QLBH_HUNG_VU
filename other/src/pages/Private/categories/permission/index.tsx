import { useEffect, useState } from "react";
import { CSS } from "../../../../constants/UI";
import RoleList from "./partials/RoleList";
import { useRoleData } from "../../../../hooks/core/useRoleData";
import RolePermission from "./partials/RolePermission";
import { IRole } from "../../../../models/store/role";
import "./index.css";
import { useClientData } from "../../../../hooks/core/useClientData";
import { usePageState } from "../../../../hooks/core/usePageState";

const Page: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<IRole | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { currentStore } = useClientData();
  const { storeId, setStoreId } = usePageState();

  const { loading, roleData, addRole, updateRole, updatePermissionRole, deleteRole } = useRoleData({
    storeId,
    isLockHook: !currentStore && !storeId,
  });

  useEffect(() => {
    if (roleData.length === 0) return;
    const newRow = roleData.find((item) => item.id === selectedRow?.id);

    if (newRow) return;

    setSelectedRow(roleData[0]);
  }, [roleData, selectedRow]);

  return (
    <div className="flex flex-row h-full gap-3">
      <div
        className="hidden xl:flex"
        style={{
          width: 320,
          ...CSS.container,
        }}
      >
        <RoleList
          storeId={storeId}
          setStoreId={setStoreId}
          dataSource={roleData}
          loading={loading}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          onAdd={addRole}
          onEdit={updateRole}
          onDelete={deleteRole}
        />
      </div>

      <div className="flex-1 flex flex-col" style={CSS.container}>
        <RolePermission
          loading={loading}
          selectedRow={selectedRow}
          onUpdateRolePermission={updatePermissionRole}
          onToggleDrawer={() => setDrawerOpen(!drawerOpen)}
        />
      </div>
    </div>
  );
};

export default Page;
