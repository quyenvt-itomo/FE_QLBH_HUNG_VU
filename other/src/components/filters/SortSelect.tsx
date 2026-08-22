import { Select } from "antd";
import { SortItem } from "../../models/base/interface";
import { SortOrderEnum } from "../../constants/enum";
import { IconArrowDown } from "../icon/ArrowDown";
import { useEffect } from "react";

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
          className="h-8 w-1/2"
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
          suffixIcon={<IconArrowDown />}
        />

        {/* SORT ORDER */}
        <Select
          className="h-8 w-1/2"
          value={value?.sortOrder}
          onChange={handlesortOrderChange}
          suffixIcon={<IconArrowDown />}
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
