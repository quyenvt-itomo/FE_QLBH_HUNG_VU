import { StarIcon } from "@heroicons/react/24/outline";
import { FundTypeEnum, fundTypeMap } from "../../constants/enum";
import { useClientData } from "../../hooks/core/useClientData";
import { IFund } from "../../models/fund";
import { formatMoney } from "../../utils/formatNumber";
import ActionButtons from "../button/ActionButtons";
import DropdownAction from "../dropdown/ActionMenu";

interface FundCardProps {
  item: IFund;
  className?: string;
  style?: React.CSSProperties;

  selected?: boolean;

  onClick?: (item: IFund, event?: React.MouseEvent) => void;

  onEdit?: (item: IFund) => void;
  onDelete?: (item: IFund) => void;
  onSetDefault?: (item: IFund) => void;
}

export const FundCardBase: React.FC<FundCardProps> = ({
  item,
  className = "",
  style,
  selected,
  onClick,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const { format } = useClientData();
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
      <div className="flex gap-2">
        <span className="bg-primary/20 w-fit px-2 py-px text-primary rounded-md">{item.code}</span>
        {item.isDefault && (
          <div
            className="z-10 bg-yellow-400 rounded-full flex items-center justify-center h-5 w-5"
            title="Quỹ mặc định"
          >
            <StarIcon className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <span
        className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors ease-in-out line-clamp-1"
        title={item.name}
      >
        {item.name}
      </span>
      <div className="absolute top-1 right-0.5">
        <DropdownAction
          type="horizontal"
          onEdit={onEdit ? () => onEdit(item) : undefined}
          onDelete={onDelete ? () => onDelete(item) : undefined}
          onSetDefault={onSetDefault ? () => onSetDefault(item) : undefined}
        />
      </div>
      {/* <ActionButtons
        onEdit={onEdit ? () => onEdit(item) : undefined}
        onDelete={onDelete ? () => onDelete(item) : undefined}
      /> */}

      {item.type === FundTypeEnum.BANK && (
        <div className="flex flex-col gap-1 text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded">
          <div className="flex gap-1">
            <span className="font-medium">Ngân hàng:</span>
            <span>{item.bank || "Chưa cập nhật"}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-medium">Tên TK:</span>
            <span>{item.accountHolderName || "Chưa cập nhật"}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-medium">Số TK:</span>
            <span>{item.accountNumber || "Chưa cập nhật"}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-medium">Chi nhánh:</span>
            <span>{item.branch || "Chưa cập nhật"}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-1">
        <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
          Số dư: {formatMoney(item.currentBalance, format) || "0"}
        </div>
      </div>
    </div>
  );
};

export const FundCardLite: React.FC<FundCardProps> = ({
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
      <div className="flex flex-col">
        <span className="bg-primary/20 w-fit px-2 py-px text-primary rounded-md">{item.code}</span>
        <span
          className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors ease-in-out line-clamp-1"
          title={item.name}
        >
          {item.name}
        </span>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-xs text-gray-500">Phân loại: {fundTypeMap[item.type]}</div>
        <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
          Số dư: {formatMoney(item.currentBalance, format) || "0"}
        </div>
      </div>
    </div>
  );
};
