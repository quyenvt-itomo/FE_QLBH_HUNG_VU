import React from "react";
import { Layout, MenuProps } from "antd";
import "./sidebar.css";
import CustomMenu from "./components/Menu";
import Logo from "../../../components/Logo";
import { useClientData } from "../../../hooks/core/useClientData";
import { COLORS } from "../../../constants/UI";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

export type SideBarProps = {
  items: MenuItem[];
};

const siderStyle: React.CSSProperties = {
  height: "100vh",
  insetInlineStart: 0,
  padding: "12px",
  paddingRight: "16px",
  top: 0,
  bottom: 0,
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  zIndex: 1,
};

const siderHorizontalStyle: React.CSSProperties = {
  height: "76px",
  maxHeight: "76px",
  insetInlineStart: 0,
  padding: "12px 12px 12px 12px",
  top: 0,
  bottom: 0,
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  zIndex: 1,
};

const sidebarStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  // backgroundColor: COLORS.SIDEBAR_BG,
  backgroundColor: "#fff",
  height: "100%",
  borderRadius: "8px",
};

const sidebarHorizontalStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: COLORS.SIDEBAR_BG,
  // backgroundColor: "#fff",
  height: "52px",
  maxHeight: "52px",
  borderRadius: "8px",
  paddingRight: "16px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15) ",
  // borderBottom: "0.5px solid #E8E8E8",
};

const Sidebar: React.FC<SideBarProps> = ({ items }) => {
  const { horizontal, collapsed } = useClientData();

  return (
    <Sider
      style={horizontal ? siderHorizontalStyle : siderStyle}
      width={horizontal ? "100vw" : 320}
      collapsedWidth={horizontal ? "100vw" : 152}
      collapsed={collapsed}
      theme="light"
      className={`inset-y-0 left-0 bg-blue-300-50 z-10 hidden xl:block`}
    >
      <div style={horizontal ? sidebarHorizontalStyle : sidebarStyle}>
        <Logo />
        <CustomMenu items={items} />
        {horizontal && <div className="flex w-[380px] flex-shrink-0"></div>}
      </div>
    </Sider>
  );
};

export default Sidebar;
