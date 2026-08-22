/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Layout, Button } from "antd";
import CustomTitle from "./components/Title";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import UserBar from "./components/UserBar";
import { useNavigate } from "react-router-dom";
import { SideBarMenuItems } from "@/shared/layout/Private/sidebar/MenuItem";
import { privateRoutesName } from "@/shared/constants/routerName";

const { Header } = Layout;

const isMainRoute = (path: string): boolean => {
  const menuItems = SideBarMenuItems();

  if (path === "/" || path === privateRoutesName.dashboard) return true;

  const collectKeys = (items: any[]): string[] => {
    let keys: string[] = [];
    items.forEach((item) => {
      if (item?.key) keys.push(item.key);
      if (item?.children) keys = keys.concat(collectKeys(item.children));
    });
    return keys;
  };

  const allKeys = collectKeys(menuItems);

  return allKeys.includes(path);
};

const AppHeader: React.FC = () => {
  const navigate = useNavigate();

  const showBackButton = !isMainRoute(location.pathname);

  return (
    <Header
      className="
      bg-panel m-0 h-12 md:my-3 md:h-16 flex flex-row justify-between items-center
      p-3 md:p-0 border-b select-none"
    >
      <div className="h-8 w-8">
        <Button
          onClick={() => navigate(-1)}
          className={`
            items-center justify-center p-0
            h-8 w-8 rounded-full border-[#F2F2F5] ${showBackButton ? "flex" : "hidden"}
          `}
        >
          <ChevronLeftIcon className="h-3" />
        </Button>
      </div>
      <CustomTitle />
      <div className="h-8 w-8">
        <div className={`${showBackButton ? "hidden" : "w-8 h-8"}`}>
          <UserBar />
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
