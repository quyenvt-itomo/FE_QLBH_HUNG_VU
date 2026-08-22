import { removeVietnameseTones } from "@/shared/utils/search.util";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Select, SelectProps } from "antd";

export const AppSelect: React.FC<SelectProps> = ({ className = "", ...props }) => {
  return (
    <Select
      allowClear
      showSearch
      className={`w-full hover:z-10 ${className}`}
      suffixIcon={<ChevronDownIcon className="h-3.5" />}
      filterOption={(input, option) =>
        removeVietnameseTones(String(option?.label)).includes(removeVietnameseTones(input)) ||
        removeVietnameseTones(String(option?.value)).includes(removeVietnameseTones(input))
      }
      {...props}
    />
  );
};
