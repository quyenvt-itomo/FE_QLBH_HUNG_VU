import { Button } from "antd";
import { useState } from "react";
import { IconRemove } from "../icon/Remove";
import { Icon } from "@iconify/react";
import DrawerFilter, { DrawerFilterProps } from "./DrawerFilter";
import "./index.css";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface CustomFilterProps extends Omit<DrawerFilterProps, "open" | "onClose"> {
  filterActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CustomFilter: React.FC<CustomFilterProps> = ({
  filterActive,
  className = "",
  style,
  onClearFilter,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        htmlType="button"
        className={`
        flex flex-shrink-0 gap-2 min-w-[82px] font-light text-sm !px-3 h-8 rounded ${className}
        ${filterActive ? "text-primary" : "text-gray-400"}
        `}
        style={style}
        onClick={() => setOpen(true)}
      >
        <Icon
          icon="material-symbols:filter-alt-outline"
          width="24"
          height="24"
          // className="slide-left"
        />
        {filterActive ? (
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              width: "fit-content",
              alignItems: "center",
            }}
          >
            Đang lọc
            <button
              type="button"
              className="ml-2 hover:text-red-500 transition-all ease-in-out h-6 w-6 p-px"
              onClick={(e) => {
                e.stopPropagation();
                onClearFilter?.();
              }}
            >
              <XMarkIcon />
            </button>
          </span>
        ) : (
          <span>Lọc</span>
        )}
      </Button>
      <DrawerFilter
        open={open}
        onClose={() => setOpen(false)}
        onClearFilter={filterActive ? onClearFilter : undefined}
        {...rest}
      />
    </>
  );
};

export default CustomFilter;
