import { CLASSNAME } from "@/shared/constants/ui";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Select, SelectProps } from "antd";

export const CustomSelect: React.FC<SelectProps> = ({ className = "", ...props }) => {
  return (
    <Select
      allowClear
      showSearch
      className={`${CLASSNAME.inputHeight} w-full ${className}`}
      suffixIcon={<ChevronDownIcon className="h-3.5" />}
      // Lọc theo label chứ không lọc theo value
      filterOption={(input, option) =>
        String(option?.label).toLowerCase().includes(input.toLowerCase()) ||
        String(option?.value).toString().toLowerCase().includes(input.toLowerCase())
      }
      {...props}
    />
  );
};
