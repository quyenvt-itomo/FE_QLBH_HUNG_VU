import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { IconArrowDown } from "../icon/ArrowDown";

interface ProvinceSelectProps extends SelectProps {
  onClearWard?: () => void;
}

const ProvinceSelect: React.FC<ProvinceSelectProps> = ({ onClearWard, onChange, ...rest }) => {
  return (
    <Select
      showSearch
      allowClear
      placeholder="Chọn tỉnh/thành phố"
      className="h-8"
      suffixIcon={<IconArrowDown />}
      filterOption={(input, option) => {
        const keyword = input.toLowerCase();
        const label = (option?.label as string).toLowerCase();

        const numberKeyword = Number(keyword);

        // Mặc định: khớp theo label
        return option?.plates?.includes(numberKeyword) || label?.includes(keyword);
      }}
      onChange={
        onChange
          ? (val, opt) => {
              onChange?.(val, opt);
              onClearWard?.();
            }
          : undefined
      }
      {...rest}
    />
  );
};

export default ProvinceSelect;
