import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { User } from "@/shared/base/entity";
import { UserMultipleSelect } from "@/modules/user/components/Select";
import { PartialFilterProps } from "@/shared/interfaces/common";
import { UserImage } from "../../image";
import { getMainFile } from "@/shared/utils/file.util";
import { GenericFilter } from "./GenericFilter";

export const UserFilter: React.FC<PartialFilterProps<User>> = ({ data, setData }) => {
  const value = data.map((item) => item.id);

  return (
    <GenericFilter<User>
      data={data}
      selectComponent={
        <UserMultipleSelect
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
          <UserImage image={getMainFile(item.avatar)} size={28} />
          <div className="flex min-w-0 flex-col w-[calc(100%-76px)]">
            <span className="truncate">{item.name}</span>
            <span className="truncate text-xs text-[#909090]">{item.phone || item.code || "--"}</span>
          </div>
        </>
      )}
      onRemove={(id) => setData(data.filter((item) => item.id !== id))}
    />
  );
};
