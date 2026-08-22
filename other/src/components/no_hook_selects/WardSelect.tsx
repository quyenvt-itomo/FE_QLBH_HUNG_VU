import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { IconArrowDown } from "../icon/ArrowDown";

const WardSelect: React.FC<SelectProps> = ({ ...rest }) => {
  return (
    <Select
      showSearch
      allowClear
      placeholder="Chọn phường/xã"
      className="h-8"
      suffixIcon={<IconArrowDown />}
      {...rest}
    />
  );
};

export default WardSelect;
