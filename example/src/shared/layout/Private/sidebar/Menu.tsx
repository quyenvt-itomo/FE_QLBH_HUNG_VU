/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Menu, MenuProps } from "antd";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

type MenuItem = Required<MenuProps>["items"][number];

export type CustomeMenuProps = {
  items: MenuItem[];
};

const CustomMenu: React.FC<CustomeMenuProps> = ({ items }) => {
  const [selectedKeys, setSelectedKeys] = useState("/");
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { handleSetCustomTitle } = useGlobalData();

  useEffect(() => {
    const currentPath = window.location.pathname;
    handleSetCustomTitle(null);

    setSelectedKeys(currentPath);
  }, [location.pathname]);

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
    />
  );
};

export default CustomMenu;
