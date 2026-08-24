import { ActionButtons } from "@/shared";
import { Product } from "../product.model";
import { checkSelection } from "@/shared/utils/common.util";

interface ProductCardProps {
  item: Product;
  className?: string;
  style?: React.CSSProperties;

  selected?: boolean;

  showImportInput?: boolean;
  quantityValue?: number;
  onChangeQuantity?: (id: string, value: number) => void;

  onClick?: (item: Product, event?: React.MouseEvent) => void;

  onEdit?: (item: Product) => void;
  onDelete?: (item: Product) => void;
  onCopy?: (item: Product) => void;
}

export const ProductCardLite: React.FC<ProductCardProps> = ({
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

          <span
            className="text-gray-400 dark:text-gray-400 group-hover:text-blue-600 line-clamp-1"
            title={item.baseUnit?.name}
          >
            ĐVT: {item.baseUnit?.name}
          </span>
        </div>
      </div>

      <ActionButtons
        onEdit={onEdit ? () => onEdit(item) : undefined}
        onDelete={onDelete ? () => onDelete(item) : undefined}
      />
    </div>
  );
};
