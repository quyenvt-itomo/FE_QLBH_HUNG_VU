import { ActionButtons } from "@/shared";
import { Partner } from "../partner.model";
import { checkSelection } from "@/shared/utils/common.util";
import { PartnerTypeTag } from "./Tag";

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
        onEdit={onEdit ? () => onEdit(item) : undefined}
        onDelete={onDelete ? () => onDelete(item) : undefined}
      />
    </div>
  );
};
