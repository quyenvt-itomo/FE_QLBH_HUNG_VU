/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Menu, MenuProps } from "antd";
import { useLocation } from "react-router-dom";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

type MenuItem = Required<MenuProps>["items"][number];

const getParentKeys = (items: MenuItem[], path: string, parents: string[] = []): string[] => {
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const key = String(item.key);
    if (key === path) return parents;

    if ("children" in item && item.children) {
      const result = getParentKeys(item.children as MenuItem[], path, [...parents, key]);
      if (result.length) return result;
    }
  }

  return [];
};

export type CustomeMenuProps = {
  items: MenuItem[];
};

const CustomMenu: React.FC<CustomeMenuProps> = ({ items }) => {
  const { pathname } = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(pathname);
  const [openKeys, setOpenKeys] = useState<string[]>(() => getParentKeys(items, pathname));
  const { handleSetCustomTitle } = useGlobalData();

  useEffect(() => {
    handleSetCustomTitle(null);
    setSelectedKeys(pathname);
    setOpenKeys((current) => Array.from(new Set([...current, ...getParentKeys(items, pathname)])));
  }, [pathname]);

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Menu
      theme="dark"
      items={items}
      selectedKeys={[selectedKeys]}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      mode="inline"
      className="sidebar-menu"
      inlineIndent={0}
    />
  );
};

export default CustomMenu;
