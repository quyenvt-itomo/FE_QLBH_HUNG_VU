/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Layout, Button, theme } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setDrawerOpen } from "@/shared/stores/global.slice";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { CustomTitle } from "@/shared/components";
import UserBar from "./components/UserBar";
import Notification from "./components/Notification";
import { StoreSpace } from "./components/StoreSpace";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { drawerOpen, collapsed, handleSetCollapsed } = useGlobalData();

  return (
    <Header
      className="flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700"
      style={{ height: 56, background: colorBgContainer }}
    >
      <div className="flex items-center h-full">
        <Button
          icon={<MenuOutlined />}
          onClick={() => dispatch(setDrawerOpen(!drawerOpen))}
          className="mr-4 flex lg:hidden"
        />
        <button
          className="w-5 h-5 rounded border-[1.2px] hover:border-primary transition-colors ease-in-out mr-4 hidden lg:flex relative overflow-hidden group"
          onClick={() => handleSetCollapsed(!collapsed)}
        >
          <div
            className={`
            h-full border-l absolute top-0 transition-all duration-300 ease-in-out
            group-hover:border-primary
            ${collapsed ? "left-1.5" : "right-1.5"}
            `}
          ></div>
        </button>
        <CustomTitle />
      </div>
      <div className="flex items-center h-full gap-4 flex-shrink-0">
        <div className="w-56 hidden xl:flex">
          <StoreSpace />
        </div>
        <Notification />
        <UserBar />
      </div>
    </Header>
  );
};

export default AppHeader;
