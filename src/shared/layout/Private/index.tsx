import React, { useEffect, useRef, useState } from "react";
import { SideBarMenuItems } from "./sidebar/MenuItem";
import Sidebar from "./sidebar/Sidebar";
import DrawerMenu from "./drawer/drawer";
import AppHeader from "./header";
import { Button, Layout } from "antd";
import { ExcelTaskPanel } from "@/shared/components/ExcelTaskPanel";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const { Content } = Layout;

type PrivateLayoutProps = {
  children: React.ReactNode;
};

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => setShowScrollTop(content.scrollTop > 120);
    content.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => content.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Layout className={`h-screen w-screen flex overflow-hidden`}>
      <Sidebar items={SideBarMenuItems()} />
      <DrawerMenu items={SideBarMenuItems()} />
      <Layout className={`transition-all relative duration-200 h-full flex flex-col flex-grow`}>
        <AppHeader />
        <Content
          ref={contentRef}
          className="h-[calc(100%-56px)] w-full z-10 p-3 overflow-y-auto scrollbar-hide"
        >
          {children}
        </Content>
      </Layout>
      <ExcelTaskPanel />
      <Button
        htmlType="button"
        type="primary"
        className={`${showScrollTop ? "fixed" : "hidden"} transition-all ease-in-out bottom-8 right-4 z-50 h-8 w-8 rounded-full p-0`}
        onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Cuộn lên đầu trang"
      >
        <ChevronUpIcon className="h-6 w-6" />
      </Button>
    </Layout>
  );
};

export default PrivateLayout;
