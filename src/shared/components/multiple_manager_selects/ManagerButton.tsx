import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Button, ButtonProps } from "antd";
import { CLASSNAME } from "@/shared/constants/ui";

const ManagerButton: React.FC<ButtonProps> = ({ onClick, ...rest }) => {
  return (
    <Button
      className={`!w-9 ${CLASSNAME.inputHeight} z-0 hover:z-10 manager-btn bg-[#FAFAFA] p-0 translate-x-[-1px] rounded-s-none flex items-center justify-center`}
      onClick={onClick}
      {...rest}
    >
      <EllipsisHorizontalIcon className="w-5 h-5" />
    </Button>
  );
};

export { ManagerButton };
