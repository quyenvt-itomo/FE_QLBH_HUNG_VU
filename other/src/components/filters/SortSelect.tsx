import { Select } from "antd";
import { SortItem } from "../../models/base/interface";
import { SortOrder } from "../../constants/enum";
import { IconArrowDown } from "../icon/ArrowDown";
import { useEffect } from "react";

interface SortSelectProps {
  sortItems: SortItem[];
  value?: {
    sortBy?: string;
    sortOrder?: SortOrder;
  };
  onChange?: (value: { sortBy?: string; sortOrder?: SortOrder }) => void;
}

export const SortSelect: React.FC<SortSelectProps> = ({ sortItems, value, onChange }) => {
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

  const handlesortOrderChange = (sortOrder: SortOrder) => {
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
              sortOrder: value?.sortOrder ?? SortOrder.ASC,
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
