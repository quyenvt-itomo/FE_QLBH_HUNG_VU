import { Select } from "antd";
import { SelectProps } from "antd/lib";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { removeVietnameseTones } from "@/shared/utils/search.util";
import { CLASSNAME } from "@/shared/constants/ui";
import { bankOptions } from "@/shared/constants/option/bank";

export const BankSelect: React.FC<SelectProps> = ({ ...rest }) => {
  return (
    <Select
      showSearch
      allowClear
      placeholder="Chọn ngân hàng"
      suffixIcon={<ChevronDownIcon className="h-3.5" />}
      className={`${CLASSNAME.inputHeight} w-full`}
      options={bankOptions}
      filterOption={(input, option) =>
        removeVietnameseTones(option?.label as string).includes(removeVietnameseTones(input))
      }
      {...rest}
    />
  );
};
