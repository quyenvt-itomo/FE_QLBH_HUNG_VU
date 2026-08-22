import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { IconArrowDown } from "../icon/ArrowDown";
import { genderOptions } from "../../constants/option/gender";
import { removeVietnameseTones } from "../../utils/searchUtils";

const GenderSelect: React.FC<SelectProps> = ({ ...rest }) => {
  return (
    <Select
      showSearch
      allowClear
      placeholder="Giới tính"
      className="h-8"
      suffixIcon={<IconArrowDown />}
      options={genderOptions}
      filterOption={(input, option) =>
        removeVietnameseTones(option?.label as string).includes(removeVietnameseTones(input))
      }
      {...rest}
    />
  );
};

export default GenderSelect;
