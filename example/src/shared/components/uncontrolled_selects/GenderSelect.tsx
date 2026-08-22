import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { removeVietnameseTones } from "@/shared/utils/search.util";
import { CLASSNAME } from "@/shared/constants/ui";
import { genderOptions } from "@/shared/constants/enum";

const GenderSelect: React.FC<SelectProps> = ({ className, ...rest }) => {
  return (
    <Select
      showSearch
      allowClear
      placeholder="Giới tính"
      suffixIcon={<ChevronDownIcon className="h-3.5" />}
      options={genderOptions}
      filterOption={(input, option) =>
        removeVietnameseTones(option?.label as string).includes(removeVietnameseTones(input))
      }
      className={`w-full ${CLASSNAME.inputHeight} ${className}`}
      {...rest}
    />
  );
};

export default GenderSelect;
