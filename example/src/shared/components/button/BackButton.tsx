import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Icon } from "@iconify/react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { CLASSNAME } from "@/shared/constants/ui";

export const BackButton: React.FC<{
  align?: "left" | "right";
  className?: string;
}> = ({ align = "left", className = "" }) => {
  const navigate = useNavigate();

  if (align === "right") {
    return (
      <Button
        htmlType="button"
        className={`${className} ${CLASSNAME.inputHeight} rounded w-32`}
        onClick={() => navigate(-1)}
      >
        <Icon icon="icon-park-outline:back" width="14" height="14" />
        Quay lại
      </Button>
    );
  }

  return (
    <button
      className={`${className} hover:text-primary transition-all ease-in-out`}
      onClick={() => navigate(-1)}
    >
      <div
        className="
        group rounded-full flex h-6 w-6 items-center justify-center bg-white 
        border border-gray-100
        hover:bg-primary/5
        transition-all duration-200 ease-out
        cursor-pointer active:scale-95
        text-gray-400 hover:text-primary"
      >
        <ChevronLeftIcon className="h-4" />
      </div>
    </button>
  );
};
