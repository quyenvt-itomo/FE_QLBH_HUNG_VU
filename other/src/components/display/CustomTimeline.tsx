import React from "react";

export interface ItemProps {
  position?: "left" | "right";
  dot?: React.ReactNode;
  childrens?: React.ReactNode[];
  label?: React.ReactNode;
  leftWidth?: number | string;
}

export interface CustomTimelineProps {
  items?: ItemProps[];
  leftWidth?: number | "1/3" | "1/4" | "1/2" | "2/3" | "3/4" | string;
}

const TimelineItem: React.FC<ItemProps> = ({
  position = "right",
  dot,
  childrens = [],
  label,
  leftWidth,
}) => {
  const rightWidth =
    typeof leftWidth === "number"
      ? `calc(100% - ${leftWidth}px)`
      : typeof leftWidth === "string" && leftWidth.includes("/")
        ? `calc(100% - (${leftWidth} * 100%))`
        : typeof leftWidth === "string" && leftWidth.endsWith("%")
          ? `calc(100% - ${leftWidth})`
          : "50%";

  return (
    <div className="flex w-full items-center h-8">
      <div
        style={{
          width: leftWidth,
        }}
        className="h-full flex justify-end"
      >
        <div className="flex items-center h-2">{position === "left" && label}</div>
      </div>
      <div className="flex flex-col h-full w-8 items-center gap-0.5">
        {dot ? (
          <div className="h-2 flex items-center justify-center z-50">{dot}</div>
        ) : (
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
        )}

        {/* đường kẻ dọc */}
        <div className="w-0.5 bg-[#DDD] h-[calc(100%-8px)]"></div>
      </div>
      <div
        style={{
          width: rightWidth,
        }}
        className="h-full"
      >
        <div className="flex items-center h-2">{position === "right" && label}</div>
      </div>
    </div>
  );
};

const CustomTimeline: React.FC<CustomTimelineProps> = ({ items = [], leftWidth = "50%" }) => {
  return (
    <div className="flex flex-col">
      {items.map((item, idx) => (
        <TimelineItem key={idx} leftWidth={leftWidth} {...item} />
      ))}
    </div>
  );
};

export default CustomTimeline;
