import { Icon } from "@iconify/react";
import React from "react";

interface PMiAIIconProps {
  className?: string;
  size?: number;
}

const PMiAIIcon: React.FC<PMiAIIconProps> = ({ className = "", size = 24 }) => {
  return (
    <Icon
      icon="fluent:bot-sparkle-28-filled"
      width={size}
      height={size}
      className={className}
    />
  );
};

export default PMiAIIcon;
