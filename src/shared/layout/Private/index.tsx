import React from "react";
import { SideBarMenuItems } from "./sidebar/MenuItem";
import Sidebar from "./sidebar/Sidebar";
import DrawerMenu from "./drawer/drawer";
import AppHeader from "./header";
import { Layout } from "antd";

const { Content } = Layout;

type PrivateLayoutProps = {
  children: React.ReactNode;
};

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  return (
    <Layout className={`h-screen w-screen flex overflow-hidden`}>
      <Sidebar items={SideBarMenuItems()} />
      <DrawerMenu items={SideBarMenuItems()} />
      <Layout className={`transition-all relative duration-200 h-full flex flex-col flex-grow`}>
        <AppHeader />
        <Content className="h-[calc(100%-56px)] w-full z-10 p-3 overflow-y-auto scrollbar-hide">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PrivateLayout;
