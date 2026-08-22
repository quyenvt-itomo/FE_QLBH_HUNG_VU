import { symbol_position_options } from "../../constants/option/symbol_position";
import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { IconArrowDown } from "../icon/ArrowDown";

const SymbolPositionSelect: React.FC<SelectProps> = ({ value, onChange, ...rest }) => {
  return (
    <Select<string>
      options={symbol_position_options}
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

export default SymbolPositionSelect;
