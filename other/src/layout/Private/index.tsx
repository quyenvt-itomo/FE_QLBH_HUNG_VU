import React from "react";
import { sideBarMenuItem } from "./sidebar/components/MenuItem";
import Sidebar from "./sidebar/Sidebar";
import DrawerMenu from "./drawer/drawer";
import AppHeader from "./header";
import { Layout } from "antd";
import UserBar from "./header/components/UserBar";
import Notification from "./header/components/Notification";
import { useDispatch } from "react-redux";
import { useClientData } from "../../hooks/core/useClientData";
import Store from "./header/components/Store";

const { Content } = Layout;

type PrivateLayoutProps = {
  children: React.ReactNode;
};

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { horizontal } = useClientData();

  return (
    <Layout className={`h-screen overflow-hidden !p-0 ${horizontal ? "flex !flex-col" : ""}`}>
      <div className="fixed flex z-50 gap-4 h-[48px] md:h-[76px] items-center w-fit max-w-[504px] right-4 px-3">
        <div className="w-56 hidden xl:flex">
          <Store />
        </div>
        <Notification />
        <UserBar />
      </div>
      <Sidebar items={sideBarMenuItem()} />
      <DrawerMenu items={sideBarMenuItem()} />
      <Layout
        className={`transition-all relative duration-200 pt-0 p-3 flex-grow flex flex-col ${
          horizontal ? "!w-full" : "xl:pl-0"
        }`}
      >
        <div className={`${horizontal ? "xl:hidden" : ""}  `}>
          <AppHeader />
        </div>
        <Content className="flex-grow z-10">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default PrivateLayout;
