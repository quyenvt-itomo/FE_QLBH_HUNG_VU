import { symbol_position_options } from "../../constants/option/symbol_position";
import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CLASSNAME } from "@/shared/constants/ui";

const SymbolPositionSelect: React.FC<SelectProps> = ({ value, onChange, ...rest }) => {
  return (
    <Select<string>
      options={symbol_position_options}
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

export default SymbolPositionSelect;
