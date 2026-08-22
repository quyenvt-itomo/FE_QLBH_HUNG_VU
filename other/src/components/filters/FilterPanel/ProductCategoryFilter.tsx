import { GenericFilter } from "./GenericFilter";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PartialFilterProps } from "../../../models/base/interface";
import { IAttribute } from "../../../models/base/attribute";
import { ProductCategorySelect } from "../../multiple_selects/ProductCategorySelect";

const ProductCategoryFilter: React.FC<PartialFilterProps<IAttribute>> = ({ data, setData }) => {
  const value = data.map((d) => d.id);

  const handleRemove = (id: string) => {
    const newValue = data.filter((v) => v.id !== id);
    setData?.(newValue);
  };

  return (
    <GenericFilter<IAttribute>
      data={data}
      selectComponent={
        <ProductCategorySelect
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

export default ProductCategoryFilter;
