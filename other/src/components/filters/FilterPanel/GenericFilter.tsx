import { XMarkIcon } from "@heroicons/react/24/outline";

type GenericFilterProps<T extends { id: string; name: string }> = {
  data: T[];
  selectComponent?: React.ReactNode;
  valueKey?: "id" | "name";
  renderItem?: (item: T) => React.ReactNode;
  onRemove?: (data: string) => void;
};

export function GenericFilter<T extends { id: string; name: string }>({
  data,
  valueKey = "id",
  selectComponent,
  renderItem,
  onRemove,
}: GenericFilterProps<T>) {
  return (
    <div className="card flex flex-col !gap-1 generic-filter">
      {selectComponent}

      {data.map((item) => (
        <div
          key={item.id}
          className="flex items-center w-full gap-4 cursor-pointer hover:text-primary hover:bg-gray-50 rounded group scale-up-ver-top px-2"
          onClick={() => onRemove?.(item[valueKey])}
        >
          {renderItem ? renderItem(item) : <span>{item.name}</span>}
          <button className="text-red-400 hover:text-red-500 transition-all ease-in-out ml-auto">
            <XMarkIcon className="h-5 " />
          </button>
        </div>
      ))}
    </div>
  );
}
