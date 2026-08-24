import { PartialFilterProps } from "@/shared/interfaces/common";
import { GenericFilter } from "./GenericFilter";
import { Attribute } from "@/modules/attribute/attribute.model";
import { AttributeType } from "@/modules/attribute/attribute.enum";
import { AttributeMultipleSelect } from "@/modules/attribute/components/Select";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const UnitFilter: React.FC<PartialFilterProps<Attribute>> = ({ data, setData }) => {
  const value = data.map((d) => d.id);

  const handleRemove = (id: string) => {
    const newValue = data.filter((v) => v.id !== id);
    setData?.(newValue);
  };

  return (
    <GenericFilter<Attribute>
      data={data}
      selectComponent={
        <AttributeMultipleSelect
          type={AttributeType.UNIT}
          value={value}
          placeholder=""
          prefix={<MagnifyingGlassIcon className="h-4" />}
          defaultData={data}
          onChangeData={setData}
          suffixIcon={null}
        />
      }
      renderItem={(item) => (
        <>
          <div className="flex flex-col w-[calc(100%-76px)]">
            <span className="truncate">{item.name}</span>
          </div>
        </>
      )}
      onRemove={handleRemove}
    />
  );
};
