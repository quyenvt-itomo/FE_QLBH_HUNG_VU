import { partnerTypeMap } from "../../constants/enum";
import { useClientData } from "../../hooks/core/useClientData";
import { IPartner } from "../../models/partner";
import { getMainImage } from "../../utils/fileUtil";
import ActionButtons from "../button/ActionButtons";
import UserImage from "../image/UserImage";

interface PartnerCardProps {
  item: IPartner;
  className?: string;
  style?: React.CSSProperties;

  selected?: boolean;

  onClick?: (item: IPartner, event?: React.MouseEvent) => void;

  onEdit?: (item: IPartner) => void;
  onDelete?: (item: IPartner) => void;
}

export const PartnerCardBase: React.FC<PartnerCardProps> = ({
  item,
  className = "",
  style,
  selected,
  onClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onClick?.(item)}
      className={`
        flex flex-col gap-1 px-3 py-2 rounded-lg border cursor-pointer text-sm min-h-16
        transition-all duration-300 hover:shadow-md group relative
        ${className}
        ${
          selected ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200 hover:border-blue-200"
        }`}
      style={style}
    >
      <span className="bg-primary/20 w-fit px-2 py-px text-primary rounded-md">{item.code}</span>
      <span
        className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors ease-in-out line-clamp-1"
        title={item.name}
      >
        {item.name}
      </span>
      <ActionButtons
        onEdit={onEdit ? () => onEdit(item) : undefined}
        onDelete={onDelete ? () => onDelete(item) : undefined}
      />
    </div>
  );
};

export const PartnerCardLite: React.FC<PartnerCardProps> = ({
  item,
  className = "",
  style,
  selected,
  onClick,
  onEdit,
  onDelete,
}) => {
  const { format } = useClientData();
  return (
    <div
      onClick={() => onClick?.(item)}
      className={`
        flex gap-1 justify-between w-full px-3 py-2 rounded-lg border cursor-pointer text-sm min-h-16
        transition-all duration-300 hover:shadow-md group relative
        ${className}
        ${
          selected ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200 hover:border-blue-200"
        }`}
      style={style}
    >
      <div className="flex items-center gap-4">
        <UserImage image={getMainImage(item.avatar)} />
        <div className="flex flex-col">
          <span className="bg-primary/20 w-fit px-2 py-px text-primary rounded-md">
            {item.code}
          </span>
          <span
            className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors ease-in-out line-clamp-1"
            title={item.name}
          >
            {item.name}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-xs text-gray-500">{partnerTypeMap[item.type]}</div>
        <div className="text-xs text-gray-500">Nhóm: {item.group?.name || ""}</div>
      </div>
    </div>
  );
};
