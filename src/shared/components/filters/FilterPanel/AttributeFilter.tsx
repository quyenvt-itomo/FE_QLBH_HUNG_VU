import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PartialFilterProps } from "@/shared/interfaces";
import { GenericFilter } from "./GenericFilter";
import { Attribute } from "@/modules/attribute/attribute.model";
import { AttributeType } from "@/modules/attribute/attribute.enum";
import {
  AttributeMultipleSelect,
  ProductGroupMultipleSelect,
} from "@/modules/attribute/components/Select";
import { useGlobalData } from "@/shared/hooks";

export interface AttributeFilterProps extends PartialFilterProps<Attribute> {
  type: AttributeType;
  placeholder?: string;
}

export const AttributeFilter: React.FC<AttributeFilterProps> = ({
  data,
  setData,
  type,
  placeholder,
}) => {
  const value = data.map((item) => item.id);
  const { currentStore } = useGlobalData();

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
          placeholder={placeholder}
          onChangeData={setData}
        />
      }
      renderItem={(item) => (
        <div className="flex min-w-0 flex-col w-[calc(100%-36px)] py-1">
          <span className="truncate" title={item.name}>
            {item.name}
          </span>
          {!currentStore && type === AttributeType.LOCATION && (
            <span className="text-2xs text-muted-foreground">CN: {item.store?.name}</span>
          )}
        </div>
      )}
      onRemove={(id) => setData(data.filter((item) => item.id !== id))}
    />
  );
};

export const ProductGroupFilter: React.FC<PartialFilterProps<Attribute>> = (props) => (
  <GenericFilter<Attribute>
    data={props.data}
    selectComponent={
      <ProductGroupMultipleSelect
        value={props.data.map((item) => item.id)}
        defaultData={props.data}
        prefix={<MagnifyingGlassIcon className="h-4" />}
        suffixIcon={null}
        placeholder="Tìm nhóm hàng hóa..."
        onChangeData={props.setData}
      />
    }
    renderItem={(item) => (
      <div className="flex min-w-0 flex-col w-[calc(100%-36px)] py-1">
        <span className="truncate" title={item.name}>
          {item.name}
        </span>
      </div>
    )}
    onRemove={(id) => props.setData(props.data.filter((item) => item.id !== id))}
  />
);

export const CustomerGroupFilter: React.FC<PartialFilterProps<Attribute>> = (props) => (
  <AttributeFilter
    {...props}
    type={AttributeType.CUSTOMER_GROUP}
    placeholder="Tìm nhóm khách hàng..."
  />
);

export const SupplierGroupFilter: React.FC<PartialFilterProps<Attribute>> = (props) => (
  <AttributeFilter {...props} type={AttributeType.SUPPLIER_GROUP} placeholder="Tìm nhóm NCC..." />
);

export const ShipperGroupFilter: React.FC<PartialFilterProps<Attribute>> = (props) => (
  <AttributeFilter {...props} type={AttributeType.SHIPPER_GROUP} placeholder="Tìm nhóm ĐVVC..." />
);

export const UnitFilter: React.FC<PartialFilterProps<Attribute>> = (props) => (
  <AttributeFilter {...props} type={AttributeType.UNIT} placeholder="Tìm đơn vị..." />
);

export const BrandFilter: React.FC<PartialFilterProps<Attribute>> = (props) => (
  <AttributeFilter {...props} type={AttributeType.BRAND} placeholder="Tìm thương hiệu..." />
);

export const LocationFilter: React.FC<PartialFilterProps<Attribute>> = (props) => (
  <AttributeFilter {...props} type={AttributeType.LOCATION} placeholder="Tìm vị trí kho/kệ..." />
);
