/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Layout, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import CustomTitle from "./components/Title";
import { useDispatch } from "react-redux";
import { setDrawerOpen } from "../../../stores/client/slice";
import { useClientData } from "../../../hooks/core/useClientData";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const dispatch = useDispatch();

  const { drawerOpen } = useClientData();

  return (
    <Header className="bg-white m-0 h-12 md:my-3 md:h-16 flex flex-row justify-between items-center p-3 md:p-0 border-none select-none rounded-md md:rounded-lg">
      <div className="flex items-center h-full pl-4">
        <Button
          icon={<MenuOutlined />}
          onClick={() => dispatch(setDrawerOpen(!drawerOpen))}
          className="mr-4 hidden md:flex lg:hidden"
        />
        <CustomTitle />
      </div>
      <div className="flex items-center h-full gap-4"></div>
    </Header>
  );
};

export default AppHeader;
