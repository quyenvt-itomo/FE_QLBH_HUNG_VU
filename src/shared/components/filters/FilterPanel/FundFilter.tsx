import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Fund } from "@/modules/fund/fund.model";
import { FundMultipleSelect } from "@/modules/fund/components/Select";
import { PartialFilterProps } from "@/shared/interfaces/common";
import { GenericFilter } from "./GenericFilter";

export const FundFilter: React.FC<PartialFilterProps<Fund>> = ({ data, setData }) => {
  const value = data.map((item) => item.id);

  return (
    <GenericFilter<Fund>
      data={data}
      selectComponent={
        <FundMultipleSelect
          value={value}
          defaultData={data}
          prefix={<MagnifyingGlassIcon className="h-4" />}
          suffixIcon={null}
          placeholder=""
          onChangeData={setData}
        />
      }
      renderItem={(item) => (
        <div className="flex min-w-0 flex-col w-[calc(100%-36px)]">
          <span className="truncate">{item.name}</span>
          <span className="truncate text-xs text-[#909090]">{item.code}</span>
        </div>
      )}
      onRemove={(id) => setData(data.filter((item) => item.id !== id))}
    />
  );
};
