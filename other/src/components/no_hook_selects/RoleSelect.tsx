import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { IconArrowDown } from "../icon/ArrowDown";
import { removeVietnameseTones } from "../../utils/searchUtils";
import { IRole } from "../../models/store/role";

interface RoleSelectProps extends SelectProps {
  hasAllOption?: boolean;
  options?: IRole[];
}

const RoleSelect: React.FC<RoleSelectProps> = ({ hasAllOption = false, options = [], ...rest }) => {
  const finalOptions = hasAllOption
    ? [
        { label: "Tất cả", value: "all" },
        ...options.map((role) => ({
          label: role.name,
          value: role.id,
        })),
      ]
    : options.map((role) => ({
        label: role.name,
        value: role.id,
      }));

  return (
    <Select
      showSearch
      placeholder="Chọn vai trò cửa hàng"
      className="h-8 w-full"
      suffixIcon={<IconArrowDown />}
      options={finalOptions}
      filterOption={(input, option) =>
        removeVietnameseTones(option?.label as string).includes(removeVietnameseTones(input))
      }
      {...rest}
    />
  );
};

export default RoleSelect;
