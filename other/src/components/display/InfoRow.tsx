import React from "react";
import Label from "./Label";

interface InfoRowProps {
  label: string;
  value?: string | React.ReactNode;
  bold?: boolean;
  width?: number;
  color?: string;
  className?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  bold,
  width = 144,
  color,
  className = "",
}) => {
  return (
    <div className={`flex flex-row items-center w-full ${className}`}>
      <div className="flex items-center">
        <Label title={label} bold={bold} width={width} />:
      </div>
      <div
        className="h-8 flex items-center rounded-[3px] p-3 ml-2"
        style={{
          width: `calc(100% - ${width + 8}px)`,
          color,
        }}
      >
        <span className="truncate font-normal">{value || "--"}</span>
      </div>
    </div>
  );
};

export default InfoRow;
