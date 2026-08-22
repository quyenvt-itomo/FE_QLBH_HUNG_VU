import { useState, useMemo } from "react";
import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { SearchInput } from "../input";
import { Search, SearchItem } from "@/shared/interfaces/common";

interface SearchItemPanelProps {
  searchItems: SearchItem[];
  value?: Search;
  onChange?: (value: Search) => void;
}

export const SearchItemPanel: React.FC<SearchItemPanelProps> = ({
  searchItems,
  value,
  onChange,
}) => {
  const [activeKeys, setActiveKeys] = useState<string[]>(() =>
    searchItems.filter((item) => !!value?.[`search.${item.key}`]).map((item) => item.key),
  );

  const handleToggle = (keys: string[]) => {
    const allKeys = searchItems.map((i) => i.key);
    const closedKeys = allKeys.filter((k) => !keys.includes(k));

    if (closedKeys.length === 0) {
      setActiveKeys(keys);
      return;
    }

    const newValue: Search = { ...value };

    closedKeys.forEach((k) => {
      delete newValue[k];
    });

    setActiveKeys(keys);

    if (JSON.stringify(value) === JSON.stringify(newValue)) return;

    onChange?.(newValue);
  };

  const items = useMemo(
    () =>
      searchItems.map((item) => ({
        key: item.key,
        label: <span className="font-medium">{item.label}</span>,
        className: "custom-filter-panel",
        children: (
          <div className="pt-2">
            <SearchInput
              value={value?.[`search.${item.key}`] || ""}
              onSearch={(val) =>
                onChange?.({
                  ...value,
                  [`search.${item.key}`]: val || undefined,
                })
              }
            />
          </div>
        ),
      })),
    [searchItems, value, onChange],
  );

  return (
    <Collapse
      bordered={false}
      items={items}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined
          rotate={isActive ? 90 : 0}
          className="transition-transform text-gray-600"
        />
      )}
      className="!bg-transparent custom-filter-collapse"
      activeKey={activeKeys}
      onChange={(keys) => handleToggle(keys as string[])}
    />
  );
};
