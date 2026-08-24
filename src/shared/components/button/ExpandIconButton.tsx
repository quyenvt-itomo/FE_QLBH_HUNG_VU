import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { COLORS } from "@/shared/constants/ui";

type ExpandIconButtonProps = {
  expanded: boolean;
  onExpand: (record: any, e: React.MouseEvent<HTMLElement>) => void;
  record: any;
};

const ExpandIconButton: React.FC<ExpandIconButtonProps> = ({ expanded, onExpand, record }) => {
  // if (!record.children?.length && !record.details?.length) return null;

  const color = expanded ? COLORS.PRIMARY : COLORS.BORDER;

  return (
    <button
      type="button"
      className={`
        bg-panel flex justify-center w-6 h-6 my-1 rounded-full
        items-center transition-all duration-200 ease-in-out ml-auto mr-auto
        ${expanded ? "text-primary" : "-rotate-90"}`}
      // style={{ border: `1px solid ${color}` }}
      onClick={(e) => {
        e.stopPropagation();
        onExpand(record, e);
      }}
      title={expanded ? "Thu gọn" : "Mở rộng"}
    >
      {/* <IconArrowDown color={color} /> */}
      <ChevronDownIcon className="h-4" />
    </button>
  );
};

export { ExpandIconButton };
