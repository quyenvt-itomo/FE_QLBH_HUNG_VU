import { Select } from "antd";
import { SortOrder } from "../../constants/enum";
import { useEffect } from "react";
import { SortItem } from "@/shared/interfaces/common";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CLASSNAME } from "@/shared/constants/ui";

interface SortSelectProps {
  sortItems: SortItem[];
  value?: {
    sortBy?: string;
    sortOrder?: SortOrder;
  };
  size?: "default" | "small";
  onChange?: (value: { sortBy?: string; sortOrder?: SortOrder }) => void;
}

export const SortSelect: React.FC<SortSelectProps> = ({
  sortItems,
  value,
  size = "default",
  onChange,
}) => {
  const defaultItem = sortItems[0];

  const selectedItem = sortItems.find((x) => x.value === value?.sortBy) ?? defaultItem;

  // ✅ AUTO SET DEFAULT KHI MỚI VÀO
  useEffect(() => {
    if (!value?.sortBy && defaultItem) {
      onChange?.({
        sortBy: defaultItem.value,
        sortOrder: SortOrder.ASC,
      });
    }
  }, [defaultItem, value?.sortBy, onChange]);

  const handleSortByChange = (sortBy: string) => {
    const sortOrder = value?.sortOrder ?? SortOrder.ASC;
    onChange?.({ sortBy, sortOrder });
  };

  const handleSortOrderChange = (sortOrder: SortOrder) => {
    const sortBy = value?.sortBy ?? defaultItem?.value;
    onChange?.({ sortBy, sortOrder });
  };

  return (
    <div className="flex flex-col w-full gap-2 p-4 pt-2">
      <span className="font-semibold">Sắp xếp theo</span>

      <div className="flex gap-2 w-full">
        {/* SORT BY */}
        <Select
          size={size === "small" ? "small" : "middle"}
          className={`${CLASSNAME.inputHeight} w-1/2`}
          value={value?.sortBy}
          labelInValue
          onChange={handleSortByChange}
          options={sortItems.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          suffixIcon={size === "small" ? null : <ChevronDownIcon className="h-3.5" />}
        />

        {/* SORT ORDER */}
        <Select
          size={size === "small" ? "small" : "middle"}
          className={`${CLASSNAME.inputHeight} w-1/2`}
          value={value?.sortOrder}
          onChange={handleSortOrderChange}
          suffixIcon={size === "small" ? null : <ChevronDownIcon className="h-3.5" />}
          options={[
            {
              value: SortOrder.ASC,
              label: selectedItem?.ascLabel ?? "Tăng dần",
            },
            {
              value: SortOrder.DESC,
              label: selectedItem?.descLabel ?? "Giảm dần",
            },
          ]}
        />
      </div>
    </div>
  );
};
