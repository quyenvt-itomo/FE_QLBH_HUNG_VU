import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Partner, PartnerType } from "@/modules/partner/partner.model";
import { PartnerMultipleSelect } from "@/modules/partner/components/Select";
import { PartialFilterProps } from "@/shared/interfaces/common";
import { GenericFilter } from "./GenericFilter";

export interface PartnerFilterProps extends PartialFilterProps<Partner> {
  type?: PartnerType;
  /** @deprecated Use type. Kept temporarily for older callers. */
  types?: PartnerType[];
  placeholder?: string;
}

export const PartnerFilter: React.FC<PartnerFilterProps> = ({
  data,
  setData,
  type,
  types,
  placeholder,
}) => {
  const value = data.map((item) => item.id);

  return (
    <GenericFilter<Partner>
      data={data}
      selectComponent={
        <PartnerMultipleSelect
          type={type ?? types?.[0]}
          types={types}
          value={value}
          defaultData={data}
          prefix={<MagnifyingGlassIcon className="h-4" />}
          suffixIcon={null}
          placeholder={placeholder}
          onChangeData={setData}
        />
      }
      renderItem={(item) => (
        <div className="flex min-w-0 flex-col w-[calc(100%-36px)]">
          <span className="truncate">{item.name}</span>
          <span className="truncate text-xs text-[#909090]">{item.phone || item.code || "--"}</span>
        </div>
      )}
      onRemove={(id) => setData(data.filter((item) => item.id !== id))}
    />
  );
};

export const CustomerFilter: React.FC<PartialFilterProps<Partner>> = (props) => (
  <PartnerFilter {...props} type={PartnerType.CUSTOMER} placeholder="Tìm khách hàng..." />
);

export const SupplierFilter: React.FC<PartialFilterProps<Partner>> = (props) => (
  <PartnerFilter {...props} type={PartnerType.SUPPLIER} placeholder="Tìm nhà cung cấp..." />
);

export const ShipperFilter: React.FC<PartialFilterProps<Partner>> = (props) => (
  <PartnerFilter {...props} type={PartnerType.SHIPPER} placeholder="Tìm đơn vị vận chuyển..." />
);

export const AllPartnerFilter: React.FC<PartialFilterProps<Partner>> = (props) => (
  <PartnerFilter {...props} placeholder="Tìm đối tác..." />
);
