import { Menu, MenuProps, Drawer } from "antd";
import React, { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import "../sidebar/sidebar.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { setDrawerOpen } from "../../../stores/client/slice";
import { privateRoutesName } from "../../../constants/routerName";
import { icons } from "../../../assets/icons";
import { useNavigate } from "react-router-dom";
import { TouchToClose } from "../../../hooks/core/useTouchToClose";

type MenuItem = Required<MenuProps>["items"][number];

interface DrawerMenuProps {
  items: MenuItem[];
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ items }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState("/");

  const { drawerOpen } = useSelector((state: RootState) => state.Client, shallowEqual);

  const defaultOpenKeys = ["personnel", "settings"];

  useEffect(() => {
    const pathName = location.pathname;

    handleClose();

    setSelectedKeys(pathName);
  }, [location.pathname]);

  const handleClose = () => {
    dispatch(setDrawerOpen(false));
  };

  return (
    <Drawer
      open={drawerOpen}
      placement="left"
      closable={false}
      onClose={handleClose}
      className="drawer-menu w-full xl:w-80"
      width="100%"
      styles={{
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
    >
      <TouchToClose onSwipeClose={handleClose} />
      <div className="flex flex-row justify-between items-center p-4">
        <div className="flex gap-3 items-center">
          <img src={icons.logo} className="cursor-pointer" onClick={() => navigate("/")} />
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => dispatch(setDrawerOpen(false))}
            className="text-gray-500 transition-all ease-in-out rounded-md bg-slate-50 hover:bg-slate-100 p-2"
          >
            <CloseOutlined style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto pb-4">
        <Menu
          theme="light"
          mode="inline"
          className="h-full bg-white sidebar-menu select-none border-none my-2"
          items={items}
          defaultOpenKeys={defaultOpenKeys}
          selectedKeys={[selectedKeys]}
        />
      </div>
    </Drawer>
  );
};

export default DrawerMenu;
