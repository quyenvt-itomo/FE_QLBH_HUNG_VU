import { MapPinIcon } from "@heroicons/react/24/outline";
import { IAddress } from "../../models/base/interface";
import ActionButtons from "../button/ActionButtons";

interface AddressCardProps {
  item: IAddress;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (item: IAddress) => void;
  onEdit?: (item: IAddress) => void;
  onDelete?: (item: IAddress) => void;
}

export const AddressCardBase: React.FC<AddressCardProps> = ({
  item,
  className = "",
  style,
  onClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onClick?.(item)}
      className={`
      flex bg-white rounded-xl px-[26px] py-[22px] gap-6
      transition-all duration-200 ease-in-out cursor-pointer
      shadow-md hover:shadow-lg group relative items-center
      ${className}
      `}
      style={style}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-3 items-center">
          <MapPinIcon className="w-10 h-8 text-gray-400" />
          <div>
            <div>{[item.ward, item.state].filter(Boolean).join(", ")}</div>
            <div className="">{item.detail}</div>
          </div>
        </div>
      </div>
      <ActionButtons
        onEdit={() => {
          onEdit?.(item);
        }}
        onDelete={() => {
          onDelete?.(item);
        }}
      />
    </div>
  );
};
