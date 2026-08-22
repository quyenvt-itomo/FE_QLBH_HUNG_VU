import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dropdown, MenuProps } from "antd";
import { sideBarMenuItem } from "../../Private/sidebar/components/MenuItem";
import { privateRoutesName } from "../../../constants/routerName";
import { Icon } from "@iconify/react";

const isActivePath = (paths: string | string[]): boolean => {
  const currentPath = window.location.pathname;
  // console.log({ currentPath, paths });
  if (paths === privateRoutesName.dashboard) {
    return currentPath === privateRoutesName.dashboard;
  }

  // Nếu paths là mảng, kiểm tra tất cả các đường link trong mảng
  if (Array.isArray(paths)) {
    if (paths.includes(privateRoutesName.dashboard)) {
      return paths.includes(currentPath);
    }
    return paths.some((path) => currentPath.includes(path));
  }

  // Nếu paths chỉ là một chuỗi, kiểm tra trực tiếp
  return currentPath.includes(paths);
};

const MobileTabMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = sideBarMenuItem();
  const [indicatorLeft, setIndicatorLeft] = useState<number>(2);
  const [indicatorWidth, setIndicatorWidth] = useState<number>(
    window.innerWidth / 5 - 4,
  );

  // Tách tab phẳng
  const allFlatTabs = menuItems.filter((item: any) => !item.children);
  const flatTabs = allFlatTabs.slice(0, 4); // chỉ lấy 4 tab
  const overflowTabs = allFlatTabs.slice(4); // phần dư

  // Tìm tab có children (ví dụ: Thiết lập)
  const setupTab: any = menuItems.find((item: any) => item.children);

  // Gộp children gốc + overflow vào "Khác"
  const otherItems = [
    ...overflowTabs.map((tab: any) => ({
      key: tab.key,
      label: (tab.label as any)?.props?.children ?? tab.key,
    })),
    ...(setupTab?.children || []),
  ];

  const setupMenu: MenuProps = {
    items: otherItems,
    onClick: ({ key }) => navigate(key),
  };

  const isActivePathCategories = () =>
    otherItems.some((child: any) =>
      location.pathname.startsWith(child.key.toString()),
    );

  const handleTabClick = (index: number, path: string) => {
    setIndicatorLeft(index * (window.innerWidth / 5) + 2);
    navigate(path);
  };

  useEffect(() => {
    const handleResize = () => {
      setIndicatorWidth(window.innerWidth / 5 - 4);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const activeIndex = flatTabs.findIndex((tab: any) => {
      return isActivePath(tab.key);
    });
    if (activeIndex !== -1) {
      setIndicatorLeft(activeIndex * (window.innerWidth / 5) + 2);
    } else if (isActivePathCategories()) {
      setIndicatorLeft(flatTabs.length * (window.innerWidth / 5) + 2);
    }
  }, [location.pathname, indicatorWidth, flatTabs]);

  return (
    <div className="z-50 bg-white border-t border-gray-200 shadow-md md:hidden">
      <div className="flex justify-around pt-2 pb-4 relative">
        <div
          className="bg-gradient-to-r from-primary to-primary/85
          absolute rounded-lg transition-all ease-in-out duration-500 w-[70px] h-11 top-1 z-0"
          style={{ left: indicatorLeft, width: indicatorWidth }}
        />

        {flatTabs.map((tab: any, idx: number) => (
          <div
            key={tab.key}
            onClick={() => handleTabClick(idx, tab.key.toString())}
            className={`flex-1 flex flex-col items-center text-xs z-10 transition-all ease-in-out duration-500 ${
              isActivePath(tab.key) ? "text-white font-normal" : "text-gray-500"
            }`}
          >
            {tab.icon}
            <span className="h-[16px] leading-none">
              {(tab.label as any)?.props?.children ?? tab.key}
            </span>
          </div>
        ))}

        {otherItems.length > 0 && (
          <Dropdown menu={setupMenu} placement="topRight" trigger={["click"]}>
            <div
              className={`flex-1 flex flex-col items-center text-xs z-10 ${
                isActivePathCategories()
                  ? "text-white font-normal"
                  : "text-gray-500"
              } cursor-pointer`}
            >
              <Icon icon="bx:category" height="25" />
              <span className="h-[16px] leading-none">Khác</span>
            </div>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default MobileTabMenu;
