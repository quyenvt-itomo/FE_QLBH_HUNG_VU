import { ActionButtons, UserImage } from "@/shared/components";
import { Partner } from "../partner.model";
import { checkSelection } from "@/shared/utils/common.util";
import { checkCanPermission } from "@/shared/utils/permission.util";
import { getMainFile } from "@/shared/utils/file.util";
import { PartnerTypeTag } from "./Tag";
import { PhoneOutlined } from "@ant-design/icons";

interface PartnerCardProps {
  item: Partner;
  className?: string;
  style?: React.CSSProperties;

  selected?: boolean;

  showImportInput?: boolean;
  quantityValue?: number;
  onChangeQuantity?: (id: string, value: number) => void;

  onClick?: (item: Partner, event?: React.MouseEvent) => void;

  onEdit?: (item: Partner) => void;
  onDelete?: (item: Partner) => void;
  onCopy?: (item: Partner) => void;
}

export const PartnerCardLite: React.FC<PartnerCardProps> = ({
  item,
  className = "",
  style,
  selected,
  onClick,
  onEdit,
  onDelete,
}) => {
  const canEdit = !!onEdit && checkCanPermission(item, "update");
  const canDelete = !!onDelete && checkCanPermission(item, "delete");
  return (
    <div
      onClick={() => {
        if (checkSelection()) return;
        onClick?.(item);
      }}
      className={`
        flex justify-between gap-2 w-full px-3 py-2 rounded-lg border cursor-pointer text-sm min-h-16
        transition-all duration-300 hover:shadow-md group relative
        ${className}
        ${
          selected
            ? "bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-700"
            : "bg-panel border-gray-200 hover:border-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-700"
        }
      `}
      style={style}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="bg-primary/20 w-fit px-2 py-px text-primary rounded-md">
            {item.code}
          </span>

          <span
            className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 line-clamp-1"
            title={item.name}
          >
            {item.name}
          </span>

          <div className="flex gap-1">
            {item.types?.map((t) => (
              <PartnerTypeTag key={t} value={t} variant="solid" />
            ))}
          </div>
        </div>
      </div>

      <ActionButtons
        onEdit={canEdit ? () => onEdit(item) : undefined}
        onDelete={canDelete ? () => onDelete(item) : undefined}
      />
    </div>
  );
};

export const PartnerCardBase: React.FC<PartnerCardProps> = ({
  item,
  className = "",
  style,
  onClick,
  onEdit,
  onDelete,
}) => {
  const canEdit = !!onEdit && checkCanPermission(item, "update");
  const canDelete = !!onDelete && checkCanPermission(item, "delete");

  return (
    <div
      onClick={() => onClick?.(item)}
      className={`
        relative bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700
        shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-4
        ${className}
      `}
      style={style}
    >
      {/* Header: Avatar + Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <UserImage image={getMainFile(item.avatar)} size={40} name={item.name} />

          {/* Name + Phone */}
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
              {item.name}
            </h4>
            <span className="flex items-center gap-1 text-xs text-gray-500">{item.code}</span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <PhoneOutlined className="h-3 w-3" />
              <span>{item.phone || "--"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute top-1 right-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <ActionButtons
          onEdit={canEdit ? () => onEdit?.(item) : undefined}
          onDelete={canDelete ? () => onDelete?.(item) : undefined}
        />
      </div>
    </div>
  );
};
