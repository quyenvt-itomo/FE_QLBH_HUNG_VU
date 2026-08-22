import { Drawer, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { privateRoutesName } from "../../../constants/routerName";
import { CaretDownFilled } from "@ant-design/icons";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import CompanyImage from "@/shared/components/image/CompanyImage";
import { getMainFile } from "@/shared/utils/file.util";
import { checkModule } from "@/shared/utils/permission.util";
import { CheckIcon, ServerStackIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CSS } from "@/shared/constants/ui";

export const CompanySpace: React.FC = () => {
  const [showCompanys, setShowCompanys] = useState<boolean>(false);
  const CompanyIconRef = useRef<HTMLDivElement>(null);
  const CompanyTableRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    info,
    permissions,
    currentCompany,
    isMobile,
    collapsed,
    horizontal,
    handleSetCurrentCompany,
  } = useGlobalData();

  const showSpace = !collapsed || horizontal;

  const allCompanys = info?.allCompanys || [];

  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        CompanyIconRef.current &&
        !CompanyIconRef.current.contains(event.target as Node) &&
        CompanyTableRef.current &&
        !CompanyTableRef.current.contains(event.target as Node)
      ) {
        setShowCompanys(false);
      }
    };

    if (showCompanys) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCompanys, isMobile]);

  return (
    <div
      className={`flex gap-1 items-center w-full ${showSpace ? "justify-between" : "justify-center"} relative`}
    >
      {/* Avatar */}
      <div className="h-8 w-8 justify-center items-center">
        <CompanyImage image={getMainFile(currentCompany?.logo)} size={32} shape="square" />
      </div>

      {/* Dropdown trigger */}
      {showSpace && (
        <section
          className="
          flex items-center cursor-pointer relative select-none
          h-10 py-1 px-2 rounded-lg slide-left
          md:hover:bg-gray-100/10 md:dark:hover:bg-gray-700
          transition-all ease-in-out z-50
        "
          style={{ width: "calc(100% - 40px)" }}
          ref={CompanyIconRef}
          onClick={() => setShowCompanys((prev) => !prev)}
        >
          <Typography.Text
            className="
            flex w-full justify-between gap-2
            font-medium text-xs text-white line-clamp-2
          "
          >
            {currentCompany?.name || ""}
          </Typography.Text>
          {/* Dropdown */}
          {showCompanys && (
            <div
              className="
                absolute flex flex-col min-w-[342px] gap-4
                left-0 p-3 top-12 sm:right-0 -mt-2 border
                bg-white dark:bg-gray-800
                drop-shadow-2xl rounded-xl z-50 w-28
              "
              ref={CompanyTableRef}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center h-8 text-gray-800 dark:text-gray-200">
                <span className="font-medium">Danh sách công ty</span>
                <button
                  className="
                    h-8 w-8 p-[6px]
                    bg-slate-100 dark:bg-gray-700
                    rounded
                    text-gray-400 hover:text-gray-500 dark:hover:text-gray-300
                  "
                  onClick={() => setShowCompanys(false)}
                >
                  <XMarkIcon />
                </button>
              </div>

              {/* List */}
              <div className="flex flex-col gap-1 h-[200px] overflow-y-auto">
                {allCompanys.map((item) => {
                  const selected = currentCompany?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`
                        flex gap-2 h-10 px-2 py-[6px] items-center
                        transition-all ease-in-out rounded-md
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        ${selected ? "bg-gray-100 dark:bg-gray-700" : ""}
                        `}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCompanys(false);
                        if (selected) return;
                        handleSetCurrentCompany?.(item);
                      }}
                    >
                      <CompanyImage image={getMainFile(item?.logo)} size={28} shape="square" />

                      <span
                        className={`w-[calc(100%-36px)] truncate text-gray-800 dark:text-gray-200 ${selected ? "font-medium" : ""}`}
                        title={item.name}
                      >
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              {checkModule(permissions, "organization") && (
                <button
                  className="
                    flex h-10 justify-center items-center
                    bg-gray-50 dark:bg-gray-700
                    border dark:border-gray-600
                    hover:bg-gray-100 dark:hover:bg-gray-600
                    transition-all ease-in-out
                    font-medium gap-2 rounded-md
                    text-gray-600 dark:text-gray-200
                  "
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(privateRoutesName.establish.organization);
                    setShowCompanys(false);
                  }}
                >
                  <ServerStackIcon className="h-6 w-6" />
                  Quản lý cơ cấu tổ chức
                </button>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
