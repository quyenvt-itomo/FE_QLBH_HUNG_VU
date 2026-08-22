import React from "react";
import AppHeader from "./header";
import { Layout } from "antd";
import TabMenu from "./menu/TabMenu";

const { Content } = Layout;

type MobileLayoutProps = {
  children: React.ReactNode;
};

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <Layout
      className="
      h-screen overflow-hidden !p-0 flex !flex-col
      transition-all relative duration-200 px-6 py-3 flex-grow !w-full"
    >
      <AppHeader />
      <Content className="flex-grow">{children}</Content>
      <TabMenu />
    </Layout>
  );
};

export default MobileLayout;
