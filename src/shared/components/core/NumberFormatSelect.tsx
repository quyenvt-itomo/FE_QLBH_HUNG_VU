import { number_format_options } from "../../constants/option/number_format";
import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CLASSNAME } from "@/shared/constants/ui";

const NumberFormatSelect: React.FC<SelectProps> = ({ value, onChange, ...rest }) => {
  return (
    <Select<string>
      options={number_format_options}
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

export { NumberFormatSelect };
