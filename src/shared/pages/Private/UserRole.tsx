import { UserPage } from "@/modules/user";
import { RolePage } from "@/modules/role";
import { Tabs } from "antd";
import { useState, useMemo } from "react";
import { checkModule } from "@/shared/utils/permission.util";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

export const UserRolePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("user");

  const { permissions } = useGlobalData();

  const contentMap: Record<string, React.ReactNode> = {
    user: <UserPage />,
    role: <RolePage />,
  };

  const items = useMemo(() => {
    const result: { label: string; key: string }[] = [];
    if (checkModule(permissions, "user")) {
      result.push({ label: "Người dùng", key: "user" });
    }
    if (checkModule(permissions, "role")) {
      result.push({ label: "Vai trò", key: "role" });
    }
    return result;
  }, [permissions]);

  return (
    <div className="h-full">
      <Tabs
        className="custom-tabs"
        activeKey={activeTab}
        onChange={(key: string) => setActiveTab(key)}
        items={items}
      />
      <div className="h-[calc(100%-48px)] mt-2">{contentMap[activeTab]}</div>
    </div>
  );
};
