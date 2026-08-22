import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return <div className="flex w-screen h-screen bg-white">{children}</div>;
};

export default PublicLayout;
