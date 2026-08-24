import { Button } from "antd";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CLASSNAME } from "@/shared/constants/ui";
import { DrawerFilter, DrawerFilterProps } from "./DrawerFilter";
import "./ButtonFilter.css";

export interface ButtonFilterProps extends Omit<DrawerFilterProps, "open" | "onClose"> {
  filterActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ButtonFilter: React.FC<ButtonFilterProps> = ({
  filterActive,
  className = "",
  style,
  onClearFilter,
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        htmlType="button"
        className={`flex flex-shrink-0 min-w-[82px] items-center gap-2 font-light text-sm !px-3 ${CLASSNAME.inputHeight} ${filterActive ? "text-primary" : "text-gray-400"} ${className}`}
        style={style}
        onClick={() => setOpen(true)}
      >
        <Icon icon="material-symbols:filter-alt-outline" width="24" height="24" />
        {filterActive ? (
          <span className="flex w-fit flex-row items-center">
            Đang lọc
            <span
              role="button"
              tabIndex={0}
              className="ml-2 h-6 w-6 p-px transition-all hover:text-red-500"
              onClick={(event) => {
                event.stopPropagation();
                onClearFilter?.();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onClearFilter?.();
                }
              }}
            >
              <XMarkIcon />
            </span>
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
