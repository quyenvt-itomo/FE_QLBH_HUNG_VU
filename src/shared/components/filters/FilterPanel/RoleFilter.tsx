import { PartialFilterProps } from "@/shared/interfaces/common";
import { GenericFilter } from "./GenericFilter";
import { Role } from "@/modules/role/role.model";
import { RoleMultipleSelect } from "@/modules/role/components/Select";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const RoleFilter: React.FC<PartialFilterProps<Role>> = ({ data, setData }) => {
  const value = data.map((d) => d.id);

  const handleRemove = (id: string) => {
    const newValue = data.filter((v) => v.id !== id);
    setData?.(newValue);
  };

  return (
    <GenericFilter<Role>
      data={data}
      selectComponent={
        <RoleMultipleSelect
          value={value}
          placeholder=""
          prefix={<MagnifyingGlassIcon className="h-4" />}
          defaultData={data}
          onChangeData={setData}
          suffixIcon={null}
        />
      }
      renderItem={(item) => (
        <div className="flex flex-col w-[calc(100%-76px)] py-1">
          <span className="truncate">{item.name}</span>
        </div>
      )}
      onRemove={handleRemove}
    />
  );
};
