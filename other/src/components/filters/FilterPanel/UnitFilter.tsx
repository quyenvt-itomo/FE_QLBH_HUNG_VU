import { GenericFilter } from "./GenericFilter";
import { AttributeSelect } from "../../multiple_selects";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PartialFilterProps } from "../../../models/base/interface";
import { AttributeTypeEnum } from "../../../constants/enum";
import { IAttribute } from "../../../models/base/attribute";

const UnitFilter: React.FC<PartialFilterProps<IAttribute>> = ({ data, setData }) => {
  const value = data.map((d) => d.id);

  const handleRemove = (id: string) => {
    const newValue = data.filter((v) => v.id !== id);
    setData?.(newValue);
  };

  return (
    <GenericFilter<IAttribute>
      data={data}
      selectComponent={
        <AttributeSelect
          type={AttributeTypeEnum.PRODUCT_UNIT}
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

export default UnitFilter;
