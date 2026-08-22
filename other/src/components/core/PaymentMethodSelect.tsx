import { payment_method_options } from "../../constants/option/payment_method";
import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { IconArrowDown } from "../icon/ArrowDown";

const PaymentMethodSelect: React.FC<SelectProps> = ({ value, onChange, ...rest }) => {
  return (
    <Select<string>
      options={payment_method_options}
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

export default PaymentMethodSelect;
