import { payment_method_options } from "../../constants/option/payment_method";
import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CLASSNAME } from "@/shared/constants/ui";

const PaymentMethodSelect: React.FC<SelectProps> = ({ value, onChange, ...rest }) => {
  return (
    <Select<string>
      options={payment_method_options}
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

export default PaymentMethodSelect;
