import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import {
  Attribute,
  AttributeMultipleSelect,
  AttributeType,
  ProductGroupMultipleSelect,
} from "@/modules/attribute";
import { PartialFilterProps } from "@/shared/interfaces/common";
import { GenericFilter } from "./GenericFilter";

export interface AttributeFilterProps extends PartialFilterProps<Attribute> {
  type: AttributeType;
}

export const AttributeFilter: React.FC<AttributeFilterProps> = ({ data, setData, type }) => {
  const value = data.map((item) => item.id);

  return (
    <GenericFilter<Attribute>
      data={data}
      selectComponent={
        <AttributeMultipleSelect
          type={type}
          value={value}
          defaultData={data}
          prefix={<MagnifyingGlassIcon className="h-4" />}
          suffixIcon={null}
          placeholder=""
          onChangeData={setData}
        />
      }
      onRemove={(id) => setData(data.filter((item) => item.id !== id))}
    />
  );
};

export const CategoryFilter: React.FC<PartialFilterProps<Attribute>> = (props) => (
  <GenericFilter<Attribute>
    data={props.data}
    selectComponent={
      <ProductGroupMultipleSelect
        value={props.data.map((item) => item.id)}
        defaultData={props.data}
        prefix={<MagnifyingGlassIcon className="h-4" />}
        suffixIcon={null}
        placeholder=""
        onChangeData={props.setData}
      />
    }
    onRemove={(id) => props.setData(props.data.filter((item) => item.id !== id))}
  />
);

export const CustomerGroupFilter: React.FC<PartialFilterProps<Attribute>> = (props) => (
  <AttributeFilter {...props} type={AttributeType.CUSTOMER_GROUP} />
);

export const SupplierGroupFilter: React.FC<PartialFilterProps<Attribute>> = (props) => (
  <AttributeFilter {...props} type={AttributeType.SUPPLIER_GROUP} />
);

export const ShipperGroupFilter: React.FC<PartialFilterProps<Attribute>> = (props) => (
  <AttributeFilter {...props} type={AttributeType.SHIPPER_GROUP} />
);
