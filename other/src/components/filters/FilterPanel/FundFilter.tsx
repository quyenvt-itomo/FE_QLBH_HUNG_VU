import { GenericFilter } from "./GenericFilter";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PartialFilterProps } from "../../../models/base/interface";
import { FundSelect } from "../../multiple_selects/FundSelect";
import { fundTypeMap } from "../../../constants/enum";
import { IFund } from "../../../models/fund";

const FundFilter: React.FC<PartialFilterProps<IFund>> = ({ data, setData }) => {
  const value = data.map((d) => d.id);

  const handleRemove = (id: string | number) => {
    const newValue = data.filter((v) => v.id !== id);
    setData?.(newValue);
  };

  return (
    <GenericFilter<IFund>
      data={data}
      selectComponent={
        <FundSelect
          value={value}
          placeholder=""
          prefix={<MagnifyingGlassIcon className="h-4" />}
          defaultData={data}
          onChangeData={setData}
          suffixIcon={null}
        />
      }
      renderItem={(item) => (
        <div className="flex flex-col w-[calc(100%-76px)] pb-1">
          <span className="truncate">{item.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary bg-primary/10 px-2 rounded-lg">{item.code}</span>
            <span className="text-xs text-gray-400">{fundTypeMap[item.type]}</span>
          </div>
        </div>
      )}
      onRemove={handleRemove}
    />
  );
};

export default FundFilter;
