import { useState, useMemo } from "react";
import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { InputRangeField } from "../input";
import { Ranger, RangerItem } from "@/shared/interfaces/common";

interface RangerItemPanelProps {
  rangerItems: RangerItem[];
  value?: Ranger;
  onChange?: (value: Ranger) => void;
  defaultOpenAll?: boolean;
}

export const RangerItemPanel: React.FC<RangerItemPanelProps> = ({
  rangerItems,
  value,
  onChange,
  defaultOpenAll = false,
}) => {
  const [activeKeys, setActiveKeys] = useState<string[]>(() =>
    defaultOpenAll
      ? rangerItems.map((item) => item.key)
      : rangerItems
          .filter((item) => {
            const k = item.key;
            return (
              value?.[`${k}Gte`] != null ||
              value?.[`${k}Gt`] != null ||
              value?.[`${k}Eq`] != null ||
              value?.[`${k}Lte`] != null ||
              value?.[`${k}Lt`] != null
            );
          })
          .map((item) => item.key),
  );

  const handleToggle = (keys: string[]) => {
    setActiveKeys(keys);
  };

  const hasRangerValue = (key: string) =>
    ["Gte", "Gt", "Eq", "Lte", "Lt"].some((operator) => {
      const currentValue = value?.[`${key}${operator}` as keyof Ranger];
      return currentValue !== undefined && currentValue !== null && currentValue !== "";
    });

  const handleClearItem = (key: string) => {
    const newValue: Ranger = { ...value };

    ["Gte", "Gt", "Eq", "Lte", "Lt"].forEach((operator) => {
      delete newValue[`${key}${operator}` as keyof Ranger];
    });

    onChange?.(newValue);
  };

  const items = useMemo(
    () =>
      rangerItems.map((item) => ({
        key: item.key,
        label: (
          <div
            className="flex items-center justify-between gap-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (!activeKeys.includes(item.key)) {
                  setActiveKeys([...activeKeys, item.key]);
                } else {
                  handleToggle(activeKeys.filter((key) => key !== item.key));
                }
              }}
            >
              {item.label}
            </span>
            {hasRangerValue(item.key) && (
              <button
                type="button"
                className="shrink-0 font-light text-primary hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearItem(item.key);
                }}
              >
                Bỏ lọc
              </button>
            )}
          </div>
        ),
        className: "custom-filter-panel",
        children: (
          <div className="pt-2">
            <InputRangeField
              fieldKey={item.key}
              type={item.type}
              value={value}
              onChange={onChange}
            />
          </div>
        ),
      })),
    [rangerItems, value, onChange, activeKeys],
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
