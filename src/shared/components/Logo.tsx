import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalData, privateRoutesName, StoreImage, getMainFile, APP_NAME } from "@/shared";

const logoStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const Logo: React.FC = () => {
  const navigate = useNavigate();
  const { currentStore, horizontal, collapsed } = useGlobalData();
  const currentLogo = getMainFile(currentStore?.logo);

  return (
    <div className={`h-14 ${horizontal ? "pr-8" : ""}`} style={logoStyle}>
      <div
        className={`flex ${
          collapsed ? "px-[25px]" : "px-2"
        } gap-2 items-center relative h-full w-full select-none transition-all ease-in-out`}
      >
        <div
          className={`
          flex h-full cursor-pointer w-full gap-2 items-center select-none transition-all ease-in-out flex-shrink-0
          `}
          onClick={() => navigate(privateRoutesName.dashboard)}
        >
          {currentLogo ? (
            <StoreImage size={28} image={currentLogo} shape="square" />
          ) : (
            <img src="/logo.png" alt="Logo" className="w-7" />
          )}
          {!collapsed && (
            <span
              className={`font-mono font-bold text-white text-wrap ${currentStore?.name ? "text-xs" : ""}`}
              title={currentStore?.name || APP_NAME}
            >
              {currentStore?.name || APP_NAME}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export { Logo };
