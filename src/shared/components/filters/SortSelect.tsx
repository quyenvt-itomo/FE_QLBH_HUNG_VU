import { Select } from "antd";
import { SortOrderEnum } from "../../constants/enum";
import { useEffect } from "react";
import { SortItem } from "@/shared/interfaces/common";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CLASSNAME } from "@/shared/constants/ui";

interface SortSelectProps {
  sortItems: SortItem[];
  value?: {
    sortBy?: string;
    sortOrder?: SortOrderEnum;
  };
  onChange?: (value: { sortBy?: string; sortOrder?: SortOrderEnum }) => void;
}

export const SortSelect: React.FC<SortSelectProps> = ({ sortItems, value, onChange }) => {
  const defaultItem = sortItems[0];

  const selectedItem = sortItems.find((x) => x.value === value?.sortBy) ?? defaultItem;

  // ✅ AUTO SET DEFAULT KHI MỚI VÀO
  useEffect(() => {
    if (!value?.sortBy && defaultItem) {
      onChange?.({
        sortBy: defaultItem.value,
        sortOrder: SortOrderEnum.ASC,
      });
    }
  }, [defaultItem, value?.sortBy, onChange]);

  const handleSortByChange = (sortBy: string) => {
    const sortOrder = value?.sortOrder ?? SortOrderEnum.ASC;
    onChange?.({ sortBy, sortOrder });
  };

  const handlesortOrderChange = (sortOrder: SortOrderEnum) => {
    const sortBy = value?.sortBy ?? defaultItem?.value;
    onChange?.({ sortBy, sortOrder });
  };

  return (
    <div className="flex flex-col w-full gap-2 p-4">
      <span className="font-semibold">Sắp xếp theo</span>

      <div className="flex gap-2 w-full">
        {/* SORT BY */}
        <Select
          className={`${CLASSNAME.inputHeight} w-1/2`}
          value={
            value?.sortBy
              ? {
                  value: value.sortBy,
                  label: selectedItem?.label,
                }
              : undefined
          }
          labelInValue
          onChange={(v) =>
            onChange?.({
              sortBy: v.value,
              sortOrder: value?.sortOrder ?? SortOrderEnum.ASC,
            })
          }
          options={sortItems.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          suffixIcon={<ChevronDownIcon className="h-3.5" />}
        />

        {/* SORT ORDER */}
        <Select
          className={`${CLASSNAME.inputHeight} w-1/2`}
          value={value?.sortOrder}
          onChange={handlesortOrderChange}
          suffixIcon={<ChevronDownIcon className="h-3.5" />}
          options={[
            {
              value: SortOrderEnum.ASC,
              label: selectedItem?.ascLabel ?? "Tăng dần",
            },
            {
              value: SortOrderEnum.DESC,
              label: selectedItem?.descLabel ?? "Giảm dần",
            },
          ]}
        />
      </div>
    </div>
  );
};
