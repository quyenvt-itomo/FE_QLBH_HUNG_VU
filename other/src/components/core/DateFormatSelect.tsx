import { date_format_options } from "../../constants/option/date_format";
import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { IconArrowDown } from "../icon/ArrowDown";

const DateFormatSelect: React.FC<SelectProps> = ({ value, onChange, ...rest }) => {
  return (
    <Select<string>
      options={date_format_options}
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

export default DateFormatSelect;
