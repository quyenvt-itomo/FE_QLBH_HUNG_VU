import { GenericFilter } from "./GenericFilter";
import { CustomerSelect } from "../../multiple_selects";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PartialFilterProps } from "../../../models/base/interface";
import UserImage from "../../image/UserImage";
import { getMainImage } from "../../../utils/fileUtil";
import { IPartner } from "../../../models/partner";

const CustomerFilter: React.FC<PartialFilterProps<IPartner>> = ({ data, setData }) => {
  const value = data.map((d) => d.id);

  const handleRemove = (id: string) => {
    const newValue = data.filter((v) => v.id !== id);
    setData?.(newValue);
  };

  return (
    <GenericFilter<IPartner>
      data={data}
      selectComponent={
        <CustomerSelect
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
          <UserImage image={getMainImage(item.avatar)} size={28} />
          <div className="flex flex-col w-[calc(100%-76px)]">
            <span className="truncate">{item.name}</span>
            <span className="text-xs text-[#909090] group-hover:text-primary">
              {item.code || item.phone || item.email || "--"}
            </span>
          </div>
        </>
      )}
      onRemove={handleRemove}
    />
  );
};

export default CustomerFilter;
