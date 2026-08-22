import React from "react";
import { Tooltip } from "antd";

interface HeaderWrapProps {
  title: string;
  required?: boolean;
  tooltip?: string;
  className?: string;
}

const HeaderWrap: React.FC<HeaderWrapProps> = ({
  title,
  required = false,
  tooltip,
  className = "",
}) => {
  const content = (
    <span
      className={`break-words whitespace-pre-line inline-block leading-tight ${className}`}
      style={{
        wordWrap: "break-word",
        overflowWrap: "break-word",
        hyphens: "auto",
        lineHeight: "1",
        // textAlign: "center",
      }}
    >
      {title}
      {required && <span className="text-red-500 ml-1">*</span>}
    </span>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement="top">
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default HeaderWrap;
