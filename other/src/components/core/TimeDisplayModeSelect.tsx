import { time_display_mode_options } from "../../constants/option/time_display_mode";
import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { IconArrowDown } from "../icon/ArrowDown";

const TimeDisplayModeSelect: React.FC<SelectProps> = ({ value, onChange, ...rest }) => {
  return (
    <Select<string>
      options={time_display_mode_options}
      value={value}
      showSearch
      onChange={onChange}
      className="h-8 w-full"
      suffixIcon={<IconArrowDown />}
      filterOption={(input, option) =>
        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
      }
      {...rest}
    />
  );
};

export default TimeDisplayModeSelect;
