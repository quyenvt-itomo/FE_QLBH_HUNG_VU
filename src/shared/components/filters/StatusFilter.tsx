import { formatQuantity } from "@/shared/utils/number.util";
import type { StatusItem } from "./filter.types";
import { CLASSNAME } from "@/shared/constants/ui";

interface StatusFilterProps {
  items?: StatusItem[];
  status?: string;
  onChangeStatus?: (status: string) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ items, status, onChangeStatus }) => {
  return (
    <div className="flex w-full overflow-x-auto scrollbar-hide gap-2">
      {items?.map((item, index) => (
        <div
          key={item.value}
          onClick={(e) => {
            e.stopPropagation();
            status !== item.value ? onChangeStatus?.(item.value) : undefined;
          }}
          className={`
          flex px-3 w-fit items-center gap-1 transition-all ease-in-out
          ${CLASSNAME.inputHeight} rounded-full relative ${
            status === item.value
              ? "bg-blue-100 text-blue-500 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
              : "bg-panel border border-slate-200 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400"
          }
          `}
        >
          <div className="flex gap-1">
            {item.icon}
            <span className="whitespace-nowrap">{item.label}</span>
          </div>
          {item.total ? (
            <span
              className={`
              absolute -top-3 -right-[13px] h-6 w-6
              flex items-center justify-center rounded-full
              ${status === item.value ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}
            >
              {formatQuantity(item.total)}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
};
