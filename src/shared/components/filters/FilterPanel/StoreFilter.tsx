import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Store } from "@/shared/base/entity";
import { StoreMultipleSelect } from "@/modules/store/components/Select";
import { PartialFilterProps } from "@/shared/interfaces/common";
import { GenericFilter } from "./GenericFilter";
import { StoreImage } from "../../image";
import { getMainFile } from "@/shared/utils";

export const StoreFilter: React.FC<PartialFilterProps<Store>> = ({ data, setData }) => {
  const value = data.map((item) => item.id);

  return (
    <GenericFilter<Store>
      data={data}
      selectComponent={
        <StoreMultipleSelect
          value={value}
          defaultData={data}
          prefix={<MagnifyingGlassIcon className="h-4" />}
          suffixIcon={null}
          placeholder=""
          onChangeData={setData}
        />
      }
      renderItem={(item) => (
        <>
          <StoreImage image={getMainFile(item.logo)} size={28} />
          <div className="flex min-w-0 flex-col w-[calc(100%-36px)]">
            <span className="truncate">{item.name}</span>
            <span className="truncate text-xs text-[#909090]">{item.code}</span>
          </div>
        </>
      )}
      onRemove={(id) => setData(data.filter((item) => item.id !== id))}
    />
  );
};
