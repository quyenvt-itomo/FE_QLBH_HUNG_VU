import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { icons } from "@/shared/assets/icons";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { privateRoutesName } from "@/shared/constants/routerName";
import { APP_NAME } from "../constants/enum";
import { getMainFile } from "../utils/file.util";
import CompanyImage from "./image/CompanyImage";

const logoStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const Logo: React.FC = () => {
  const navigate = useNavigate();
  const { currentCompany, horizontal, collapsed } = useGlobalData();
  const currentLogo = getMainFile(currentCompany?.logo);

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
            <CompanyImage size={28} image={currentLogo} shape="square" />
          ) : (
            <img src="/logo.png" alt="Logo" className="w-7" />
          )}
          {!collapsed && (
            <span
              className={`font-mono font-bold text-white text-wrap ${currentCompany?.name ? "text-xs" : ""}`}
              title={currentCompany?.name || APP_NAME}
            >
              {currentCompany?.name || APP_NAME}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logo;
