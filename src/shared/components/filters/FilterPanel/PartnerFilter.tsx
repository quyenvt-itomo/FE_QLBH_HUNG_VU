import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Partner, PartnerType } from "@/modules/partner/partner.model";
import { PartnerMultipleSelect } from "@/modules/partner/components/Select";
import { PartialFilterProps } from "@/shared/interfaces/common";
import { GenericFilter } from "./GenericFilter";

export interface PartnerFilterProps extends PartialFilterProps<Partner> {
  types?: PartnerType[];
}

export const PartnerFilter: React.FC<PartnerFilterProps> = ({ data, setData, types }) => {
  const value = data.map((item) => item.id);

  return (
    <GenericFilter<Partner>
      data={data}
      selectComponent={
        <PartnerMultipleSelect
          types={types}
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
          <span className="truncate text-xs text-[#909090]">{item.phone || item.code || "--"}</span>
        </div>
      )}
      onRemove={(id) => setData(data.filter((item) => item.id !== id))}
    />
  );
};

export const CustomerFilter: React.FC<PartialFilterProps<Partner>> = (props) => (
  <PartnerFilter {...props} types={[PartnerType.CUSTOMER]} />
);

export const SupplierFilter: React.FC<PartialFilterProps<Partner>> = (props) => (
  <PartnerFilter {...props} types={[PartnerType.SUPPLIER]} />
);

export const ShipperFilter: React.FC<PartialFilterProps<Partner>> = (props) => (
  <PartnerFilter {...props} types={[PartnerType.SHIPPER]} />
);

export const AllPartnerFilter: React.FC<PartialFilterProps<Partner>> = (props) => (
  <PartnerFilter {...props} />
);
