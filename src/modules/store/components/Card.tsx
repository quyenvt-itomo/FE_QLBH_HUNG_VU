import { EnvelopeIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline";
import { Card } from "antd";
import { ActionButtons } from "@/shared/components";
import { Store } from "@/shared/base/entity";
import { DropdownAction, EmailButton, StoreImage } from "@/shared/components";
import { checkSelection, getFullAddress, getMainImage } from "@/shared/utils";
import { PhoneButton } from "@/shared/components";

interface StoreCardProps {
  item: Store;
  className?: string;
  style?: React.CSSProperties;

  selected?: boolean;

  onClick?: (item: Store, event?: React.MouseEvent) => void;

  onEdit?: (item: Store) => void;
  onDelete?: (item: Store) => void;
}

export const StoreCardBase: React.FC<StoreCardProps> = ({
  item,
  className = "",
  style,
  selected,
  onClick,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      onClick={() => {
        if (checkSelection()) return;
        onClick?.(item);
      }}
      className={`
        rounded-xl border-b-primary/70 border-b-4 cursor-pointer
        shadow-md hover:shadow-lg transition-all ease-in-out
        bg-white dark:bg-gray-900
        ${className}
      `}
      style={style}
      cover={
        <div className="flex flex-col relative items-center pt-4 w-full">
          {/* STATUS */}
          <div className="absolute top-4 left-3">
            <div
              className={`
                flex items-center gap-2 px-2 py-1 rounded-xl
                ${
                  item.isActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                    : "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400"
                }
              `}
            >
              <div
                className={`
                  h-2 w-2 rounded-full
                  ${item.isActive ? "bg-primary" : "bg-red-500"}
                `}
              />
              {item.isActive ? "Active" : "Inactive"}
            </div>
          </div>

          {/* ACTION */}
          <div className="absolute top-2 right-2">
            <DropdownAction
              type="horizontal"
              onEdit={onEdit ? () => onEdit(item) : undefined}
              onDelete={onDelete ? () => onDelete(item) : undefined}
            />
          </div>

          {/* IMAGE */}
          <div className="flex items-center justify-center w-full">
            <StoreImage shape="circle" image={getMainImage(item.image)} size={96} />
          </div>

          {/* NAME */}
          <h3 className="mt-3 font-semibold text-center line-clamp-1 text-gray-900 dark:text-gray-100">
            {item.name}
          </h3>

          {/* ADDRESS */}
          <p className="text-sm text-center line-clamp-2 px-6 text-gray-500 dark:text-gray-400">
            {getFullAddress(item.address)}
          </p>
        </div>
      }
    >
      {/* BODY */}
      <div
        className="
          space-y-3 text-sm px-3 py-2 rounded-md
          bg-slate-50 border border-slate-200
          dark:bg-gray-800 dark:border-gray-700
        "
      >
        {/* CODE */}
        <div className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
          <span className="font-mono">{item.code}</span>
          <span className="font-light pl-2 border-l border-slate-400 dark:border-gray-600">
            Cửa hàng
          </span>
        </div>

        <div className="flex items-center gap-2">
          <PhoneIcon className="h-4 w-4" />
          <PhoneButton phone={item.phone} />
        </div>
        <div className="flex items-center gap-2">
          <EnvelopeIcon className="h-4 w-4" />
          <EmailButton email={item.email} />
        </div>
        <div className="flex items-center gap-3 font-light">
          <div className="flex items-center gap-2" title="Người dùng">
            <UserIcon className="h-4 w-4" />
            <span className="truncate pb-px">{item.userCount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface StoreCardProps {
  item: Store;
  className?: string;
  style?: React.CSSProperties;

  selected?: boolean;

  onClick?: (item: Store, event?: React.MouseEvent) => void;

  onEdit?: (item: Store) => void;
  onDelete?: (item: Store) => void;
}

export const StoreCardLite: React.FC<StoreCardProps> = ({
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
            ? "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-700"
            : "bg-white border-gray-200 hover:border-blue-200 dark:bg-gray-800 dark:border-gray-700"
        }
      `}
      style={style}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <StoreImage shape="circle" image={getMainImage(item.image)} size={32} />

        <div className="flex flex-col">
          <span className="bg-primary/20 w-fit px-2 text-primary rounded-md font-mono">
            {item.code}
          </span>

          <span
            className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary line-clamp-2 transition-all duration-300 ease-in-out"
            title={item.name}
          >
            {item.name}
          </span>

          <span className="text-xs text-gray-500 line-clamp-1">{getFullAddress(item.address)}</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end justify-between absolute top-2 right-3">
        <div className={`text-xs font-medium ${item.isActive ? "text-green-500" : "text-red-500"}`}>
          {item.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
        </div>
      </div>

      <ActionButtons
        onEdit={onEdit ? () => onEdit(item) : undefined}
        onDelete={onDelete ? () => onDelete(item) : undefined}
      />
    </div>
  );
};
