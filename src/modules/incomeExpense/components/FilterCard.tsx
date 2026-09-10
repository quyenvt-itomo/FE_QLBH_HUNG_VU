import { Radio } from "antd";
import clsx from "clsx";
import { FilterItem } from "@/shared/interfaces/api";
import { formatMoney } from "@/shared/utils/number.util";

interface FilterCardProps {
  items: FilterItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export const FilterCard: React.FC<FilterCardProps> = ({ items, selectedId, onSelect }) => (
  <div className="mt-1 flex flex-col gap-1">
    {items.map((item) => (
      <div
        key={item.id}
        className={clsx(
          "flex items-center justify-between rounded-md py-1 pl-7 hover:bg-gray-50",
          selectedId === item.id && "bg-primary/10",
        )}
      >
        <Radio checked={selectedId === item.id} onChange={() => onSelect?.(item.id)} className="m-0">
          <div className="flex w-[250px] justify-between gap-3">
            <span className="block truncate font-medium" title={item.name}>
              {item.name}
            </span>
            <span className="shrink-0 font-medium">{formatMoney(item.value) || 0}</span>
          </div>
        </Radio>
      </div>
    ))}
  </div>
);
