import React, { useEffect, useState } from "react";
import { icons } from "../assets/icons";
import { useNavigate } from "react-router-dom";
import { privateRoutesName } from "../constants/routerName";
import { useClientData } from "../hooks/core/useClientData";
import { useDispatch } from "react-redux";

const logoStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const Logo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { horizontal, collapsed } = useClientData();
  const [showLogoText, setShowLogoText] = useState(!collapsed || horizontal);
  useEffect(() => {
    if (collapsed && !horizontal) {
      // Thu gọn → ẩn ngay
      setShowLogoText(false);
    } else {
      // Mở ra → đợi animation xong mới hiện
      const timer = setTimeout(() => {
        setShowLogoText(true);
      }, 300); // khớp với duration transition sidebar

      return () => clearTimeout(timer);
    }
  }, [collapsed, horizontal]);

  return (
    <div className={`h-16 ${horizontal ? "pr-8" : ""}`} style={logoStyle}>
      <div
        className={`flex ${
          horizontal ? "" : !collapsed ? "pr-[70px]" : "pr-[28px]"
        } pl-[28px] gap-2 items-center relative h-full w-full select-none `}
      >
        <div
          className={`
          flex h-full cursor-pointer w-full gap-2 items-center select-none transition-all ease-in-out flex-shrink-0
          ${showLogoText ? "" : "pl-[18px]"}  
          `}
          onClick={() => navigate(privateRoutesName.dashboard)}
        >
          <img src={icons.logo} alt="Logo" className="w-5" />
          {showLogoText && <img src={icons.logoText} alt="Logo" className="h-4 slide-left" />}
        </div>

        {/* Toggle horizontall container */}
        {/* <div
          className={`flex ${
            horizontal ? "fixed right-[500px]" : "absolute right-3"
          } gap-1 ${collapsed ? "hidden" : ""}`}
        >
          <button
            className={`p-2 rounded-md hover:bg-[#BAD4E9] ${horizontal ? "" : "bg-[#BAD4E9]"}`}
            onClick={() => {
              if (horizontal) dispatch(setHorizontal(false));
            }}
          >
            <IconLayout color={horizontal ? undefined : COLORS.PRIMARY} />
          </button>
          <button
            className={`p-2 rounded-md hover:bg-[#BAD4E9] rotate-90 ${
              !horizontal ? "" : "bg-[#BAD4E9]"
            }`}
            onClick={() => {
              if (!horizontal) dispatch(setHorizontal(true));
            }}
          >
            <IconLayout color={horizontal ? COLORS.PRIMARY : undefined} />
          </button>
        </div>
        {horizontal ? (
          <></>
        ) : (
          <div
            className={`absolute flex right-[14px] top-[90vh] bg-white w-7 h-7 cursor-pointer justify-center items-center rounded-[8px] ${
              collapsed ? "-rotate-90" : "rotate-90"
            } transition-all ease-in-out duration-400`}
            onClick={() => dispatch(setCollapsed(!collapsed))}
            style={{
              border: `0.5px solid #d3d3d3`,
            }}
          >
            <IconArrowDown color="blue" />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Logo;
