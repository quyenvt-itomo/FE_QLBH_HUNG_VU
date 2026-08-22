import { useState, useMemo } from "react";
import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Ranger, RangerItem } from "../../models/base/interface";
import { InputRangeField } from "../input";

interface RangerItemPanelProps {
  rangerItems: RangerItem[];
  value?: Ranger;
  onChange?: (value: Ranger) => void;
}

export const RangerItemPanel: React.FC<RangerItemPanelProps> = ({
  rangerItems,
  value,
  onChange,
}) => {
  const [activeKeys, setActiveKeys] = useState<string[]>(() =>
    rangerItems
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
    const allKeys = rangerItems.map((i) => i.key);
    const closedKeys = allKeys.filter((k) => !keys.includes(k));

    if (closedKeys.length === 0) {
      setActiveKeys(keys);
      return;
    }

    const newValue: Ranger = { ...value };

    closedKeys.forEach((k) => {
      delete newValue[`${k}Gte`];
      delete newValue[`${k}Gt`];
      delete newValue[`${k}Eq`];
      delete newValue[`${k}Lte`];
      delete newValue[`${k}Lt`];
    });

    setActiveKeys(keys);

    if (JSON.stringify(value) === JSON.stringify(newValue)) return;

    onChange?.(newValue);
  };

  const items = useMemo(
    () =>
      rangerItems.map((item) => ({
        key: item.key,
        label: (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {item.label}
          </div>
        ),
        className: "custom-filter-panel",
        children: (
          <div className="pt-2">
            <InputRangeField fieldKey={item.key} value={value} onChange={onChange!} />
          </div>
        ),
      })),
    [rangerItems, value, onChange],
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
