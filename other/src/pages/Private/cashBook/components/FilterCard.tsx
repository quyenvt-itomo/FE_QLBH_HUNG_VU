import { Radio } from "antd";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useMemo, useState, useEffect } from "react";
import clsx from "clsx";
import { FilterItem } from "../../../../models/base/api";
import { useClientData } from "../../../../hooks/core/useClientData";
import { formatMoney } from "../../../../utils/formatNumber";

interface FilterCardProps {
  items: FilterItem[];
  selectedId?: string;
  onSelect?: (id: string, parentId?: string) => void;
}

export const FilterCard: React.FC<FilterCardProps> = ({ items, selectedId, onSelect }) => {
  const { format } = useClientData();
  const [openParentIds, setOpenParentIds] = useState<string[]>([]);

  /* =========================
    Normalize data (2-level)
  ========================= */
  const { parents, childrenMap } = useMemo(() => {
    const parents = items.filter((i) => !i.parentId);
    const childrenMap = new Map<string, FilterItem[]>();

    items.forEach((item) => {
      if (item.parentId) {
        if (!childrenMap.has(item.parentId)) {
          childrenMap.set(item.parentId, []);
        }
        childrenMap.get(item.parentId)!.push(item);
      }
    });

    return { parents, childrenMap };
  }, [items]);

  // useEffect(() => {
  //   // Mở toàn bộ parent nếu nó có child
  //   const newOpenParentIds: string[] = [];
  //   parents.forEach((parent) => {
  //     const children = childrenMap.get(parent.id) || [];
  //     if (children.length > 0) {
  //       newOpenParentIds.push(parent.id);
  //     }
  //   });
  //   setOpenParentIds(newOpenParentIds);
  // }, [parents, childrenMap]);

  /* =========================
    Render
  ========================= */
  return (
    <div className="flex flex-col gap-1 mt-1">
      {parents.map((parent) => {
        const children = childrenMap.get(parent.id) || [];
        const hasChildren = children.length > 0;
        const isOpen = openParentIds.includes(parent.id);

        return (
          <div key={parent.id} className="flex flex-col">
            {/* ===== PARENT ROW ===== */}
            <div
              className={clsx(
                "flex items-center justify-between pl-2 py-1 rounded-md",
                "hover:bg-gray-50 transition-colors",
                selectedId === parent.id && "bg-primary/10",
              )}
            >
              <div className="flex w-5 h-5 gap-1 items-center flex-shrink-0">
                {hasChildren && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenParentIds((prev) => {
                        if (prev.includes(parent.id)) {
                          return prev.filter((id) => id !== parent.id);
                        } else {
                          return [...prev, parent.id];
                        }
                      });
                    }}
                  >
                    <ChevronDownIcon
                      className={clsx(
                        "w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                )}
              </div>
              <Radio
                checked={selectedId === parent.id}
                onChange={() => onSelect?.(parent.id)}
                className="m-0"
              >
                <div className="flex justify-between w-[250px] gap-3">
                  <span className="font-medium block truncate" title={parent.name}>
                    {parent.name}
                  </span>
                  <span className="font-medium flex-shrink-0">
                    {formatMoney(parent.value, format) || 0}
                  </span>
                </div>
              </Radio>
            </div>

            {/* ===== CHILDREN ===== */}
            {hasChildren && (
              <div
                className={clsx(
                  "overflow-hidden flex w-full items-center justify-between transition-all duration-300 ease-in-out",
                  isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
                )}
              >
                <div className="flex flex-col w-full gap-1 mt-1">
                  {children.map((child) => (
                    <div
                      key={child.id}
                      className={clsx(
                        "flex items-center px-3 py-1.5 ml-8 rounded-md",
                        "hover:bg-gray-50 transition-colors",
                        selectedId === child.id && "bg-primary/10",
                      )}
                    >
                      <Radio
                        checked={selectedId === child.id}
                        onChange={() => onSelect?.(child.id, parent.id)}
                      >
                        <div className="flex justify-between w-[234px]">
                          <span className="text-sm block truncate" title={child.name}>
                            {child.name}
                          </span>
                          <span className="ml-auto text-sm flex-shrink-0">
                            {formatMoney(child.value, format) || 0}
                          </span>
                        </div>
                      </Radio>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
