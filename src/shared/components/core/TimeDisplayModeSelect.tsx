import { time_display_mode_options } from "../../constants/option/time_display_mode";
import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CLASSNAME } from "@/shared/constants/ui";

const TimeDisplayModeSelect: React.FC<SelectProps> = ({ value, onChange, ...rest }) => {
  return (
    <Select<string>
      options={time_display_mode_options}
      value={value}
      showSearch
      onChange={onChange}
      className={`${CLASSNAME.inputHeight} w-full`}
      suffixIcon={<ChevronDownIcon className="h-3.5" />}
      filterOption={(input, option) =>
        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
      }
      {...rest}
    />
  );
};

export default TimeDisplayModeSelect;
