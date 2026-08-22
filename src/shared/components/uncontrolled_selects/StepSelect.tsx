import { AutoComplete } from "antd";
import type { AutoCompleteProps } from "antd";

const SkuStepSelect: React.FC<AutoCompleteProps> = ({ ...rest }) => {
  // từ 2 đến 10
  const options = Array.from({ length: 9 }, (_, i) => {
    const value = String(i + 2);
    return { value };
  });

  return <AutoComplete options={options} placeholder="" className="w-full" {...rest} />;
};

export default SkuStepSelect;
