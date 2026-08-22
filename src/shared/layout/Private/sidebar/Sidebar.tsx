import React, { useEffect } from "react";
import { Layout, MenuProps } from "antd";
import CustomMenu from "./Menu";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { CompanySpace } from "./CompanySpace";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

export type SideBarProps = {
  items: MenuItem[];
};

const Sidebar: React.FC<SideBarProps> = ({ items }) => {
  const { collapsed } = useGlobalData();

  useEffect(() => {
    setTimeout(() => {
      const activeItem = document.querySelector(".ant-menu-item-selected") as HTMLElement | null;
      activeItem?.scrollIntoView({
        block: "center",
        behavior: "smooth", // hoặc bỏ luôn behavior
      });
    }, 200);
  }, []);

  return (
    <Sider
      theme="dark"
      collapsed={collapsed}
      style={{ background: "#0B2B1C" }}
      // layout horizontal

      width={220}
      className="
        border-r border-black/5
        shadow-[2px_0_8px_rgba(0,0,0,0.04)]
        dark:border-gray-700/50
        dark:shadow-[2px_0_8px_rgba(0,0,0,0.16)]
        z-20
      "
    >
      <div className="flex flex-col w-full">
        <div className="flex h-14 px-2">
          <CompanySpace />
        </div>
        <div className="flex flex-col h-[calc(100dvh-56px)] overflow-y-auto scrollbar-dark pb-6">
          <CustomMenu items={items} />
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
