import React from "react";
import Label from "./Label";
import { CLASSNAME } from "@/shared/constants/ui";

interface InfoColProps {
  label?: string;
  value?: string | React.ReactNode;
  bold?: boolean;
  color?: string;
  className?: string;
}

const InfoCol: React.FC<InfoColProps> = ({ label, value, bold, color, className = "" }) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <div className="flex h-6 items-center">
          <Label title={label} bold={bold} />
        </div>
      )}
      <div
        className={`${CLASSNAME.inputHeight} flex items-center border rounded-md px-3`}
        style={{ color }}
      >
        <span className="truncate font-normal">{value || "--"}</span>
      </div>
    </div>
  );
};

export default InfoCol;
