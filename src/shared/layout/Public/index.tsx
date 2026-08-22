import { Layout } from "antd";
import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return <Layout className="w-screen h-screen">{children}</Layout>;
};

export default PublicLayout;
