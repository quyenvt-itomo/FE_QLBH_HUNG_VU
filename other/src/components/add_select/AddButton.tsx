import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, ButtonProps } from "antd";

const ManagerButton: React.FC<ButtonProps> = ({ onClick, ...rest }) => {
  return (
    <Button
      className="!w-9 flex-shrink-0 !h-8 z-0 hover:z-10 manager-btn bg-[#FAFAFA] p-0 translate-x-[-1px] rounded-s-none flex items-center justify-center"
      onClick={onClick}
      {...rest}
    >
      <PlusIcon className="w-5 h-5" />
    </Button>
  );
};

export default ManagerButton;
