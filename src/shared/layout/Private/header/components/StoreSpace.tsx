import { Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { privateRoutesName } from "../../../../constants/routerName";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { StoreImage } from "@/shared/components";
import { CSS } from "@/shared/constants/ui";
import { getMainFile } from "@/shared/utils/file.util";
import { checkModule } from "@/shared/utils/permission.util";
import { CheckIcon, ServerStackIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CaretDownFilled } from "@ant-design/icons";

export const StoreSpace: React.FC = () => {
  const [showStores, setShowStores] = useState<boolean>(false);
  const StoreIconRef = useRef<HTMLDivElement>(null);
  const StoreTableRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    info,
    permissions,
    currentStore,
    isMobile,
    collapsed,
    horizontal,
    handleSetCurrentStore,
  } = useGlobalData();

  const showSpace = !collapsed || horizontal;
  const allStores = info?.allStores || [];

  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        StoreIconRef.current &&
        !StoreIconRef.current.contains(event.target as Node) &&
        StoreTableRef.current &&
        !StoreTableRef.current.contains(event.target as Node)
      ) {
        setShowStores(false);
      }
    };

    if (showStores) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStores, isMobile]);

  return (
    <div className="flex gap-2 items-center w-56">
      <div className="rounded-full flex h-7 w-7 justify-center items-center overflow-hidden bg-gray-100">
        {currentStore ? (
          <StoreImage image={getMainFile(currentStore.image)} size={28} shape="circle" />
        ) : (
          <ServerStackIcon className="h-4 w-4 text-gray-500" />
        )}
      </div>
      <section
        className={`flex items-center cursor-pointer relative select-none h-8 p-1 pr-3 rounded-lg ${
          horizontal ? "hover:bg-[#b9d1e4]" : "hover:bg-gray-100"
        } transition-all ease-in-out`}
        style={{
          width: "calc(100% - 40px)",
        }}
        ref={StoreIconRef}
        onClick={() => setShowStores((prev) => !prev)}
      >
        <Typography.Text className="flex w-full justify-between gap-2 font-medium text-sm text-[#333] truncate">
          <span
            className="truncate min-w-[56px] max-w-[140px]"
            title={currentStore ? currentStore.name : "Toàn hệ thống"}
          >
            {currentStore ? currentStore.name : "Toàn hệ thống"}
          </span>
          <CaretDownFilled className="text-[#666]" />
        </Typography.Text>

        {showStores && (
          <div
            className="
            absolute flex flex-col min-w-[342px] gap-4 -left-10 xl:left-auto xl:right-0 p-3
            top-14 sm:right-0 -mt-2 bg-white drop-shadow-2xl rounded-normal z-50 store__table w-28"
            ref={StoreTableRef}
            onClick={(e) => e.stopPropagation()}
            style={CSS.container}
          >
            <div className="flex justify-between items-center h-8 text-[#333]">
              <span className="font-medium">Chuyển cửa hàng</span>
              <button
                className="h-8 w-8 p-[6px] bg-slate-100 rounded text-gray-400 hover:text-gray-500"
                onClick={(e) => setShowStores(false)}
              >
                <XMarkIcon />
              </button>
            </div>
            <div className="flex flex-col gap-1 h-[200px] overflow-y-auto">
              {checkModule(permissions, "store") && (
                <div
                  className="flex gap-2 h-10 px-2 py-[6px] items-center transition-all ease-in-out hover:bg-gray-100 rounded-normal"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStores(false);
                    handleSetCurrentStore();
                  }}
                >
                  <div className="flex items-center justify-center h-6 w-6">
                    {currentStore === null && <CheckIcon className="text-gray-500 h-4 w-4" />}
                  </div>

                  <div className="flex items-center justify-center h-7 w-7">
                    <ServerStackIcon className="h-6 w-6 text-gray-500" />
                  </div>

                  <span className="w-[calc(100%-68px)] font-medium truncate">Toàn hệ thống</span>
                </div>
              )}
              {allStores.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className="flex gap-2 h-10 px-2 py-[6px] items-center transition-all ease-in-out hover:bg-gray-100 rounded-normal"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStores(false);
                      if (currentStore?.id === item.id) return;
                      handleSetCurrentStore(item);
                    }}
                  >
                    <div className="flex items-center justify-center h-6 w-6">
                      {currentStore?.id === item.id && (
                        <CheckIcon className="text-gray-500 h-4 w-4" />
                      )}
                    </div>
                    <div className="rounded-full flex gap-2 h-7 w-7 justify-center items-center overflow-hidden">
                      <StoreImage image={getMainFile(item?.image)} size={28} shape="circle" />
                    </div>
                    <span className="w-[calc(100%-68px)] truncate" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
            {checkModule(permissions, "store") && (
              <button
                className="flex h-10 justify-center items-center bg-gray-50 border hover:bg-gray-100 transition-all ease-in-out font-medium gap-2 rounded-md text-[#666]"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(privateRoutesName.setup.store);
                  setShowStores(false);
                  handleSetCurrentStore();
                }}
              >
                <ServerStackIcon className="h-6 w-6" /> Quản lý cửa hàng
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
