import { Select, SelectProps } from "antd";
import "./SortSelect.css";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const SortSelect: React.FC<SelectProps> = ({ ...rest }) => {
  return (
    <Select
      className="sort-select md:w-36 h-8 md:h-8"
      options={[
        {
          label: "Mới nhất",
          value: "DESC",
        },
        {
          label: "Cũ nhất",
          value: "ASC",
        },
      ]}
      style={{
        borderRadius: 8,
        boxShadow: "0 2px 0 rgba(200, 200, 200, 0.31)",
      }}
      suffixIcon={<ChevronDownIcon className="h-3" />}
      {...rest}
    />
  );
};

export default SortSelect;
