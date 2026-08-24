import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import { useState } from "react";

import { useGlobalData } from "@/shared/hooks";
import { Filter, FilterKey } from "@/shared/interfaces";
import { AllPartnerFilter, CustomerFilter, ShipperFilter, SupplierFilter } from "./PartnerFilter";
import {
  CategoryFilter,
  CustomerGroupFilter,
  ShipperGroupFilter,
  SupplierGroupFilter,
} from "./AttributeFilter";
import { FundFilter } from "./FundFilter";
import { OrderFilter } from "./OrderFilter";
import { ProductFilter } from "./ProductFilter";
import { RoleFilter } from "./RoleFilter";
import { StoreFilter } from "./StoreFilter";
import { UserFilter } from "./UserFilter";
import { UnitFilter } from "./UnitFilter";

export interface FilterPanelProps {
  filterUses: FilterKey[];
  filterLabels?: { [key in FilterKey]?: string };
}

type FilterDefinition = {
  defaultLabel: string;
  component: React.FC<any>;
};

const filterMap: Partial<Record<FilterKey, FilterDefinition>> = {
  creatorIds: { defaultLabel: "Người tạo", component: UserFilter },
  updaterIds: { defaultLabel: "Người cập nhật", component: UserFilter },
  userIds: { defaultLabel: "Người dùng", component: UserFilter },
  supplierIds: { defaultLabel: "Nhà cung cấp", component: SupplierFilter },
  customerIds: { defaultLabel: "Khách hàng", component: CustomerFilter },
  shipperIds: { defaultLabel: "Đơn vị vận chuyển", component: ShipperFilter },
  partnerIds: { defaultLabel: "Đối tác", component: AllPartnerFilter },
  customerGroupIds: { defaultLabel: "Nhóm khách hàng", component: CustomerGroupFilter },
  supplierGroupIds: { defaultLabel: "Nhóm nhà cung cấp", component: SupplierGroupFilter },
  shipperGroupIds: { defaultLabel: "Nhóm đơn vị vận chuyển", component: ShipperGroupFilter },
  fundIds: { defaultLabel: "Quỹ", component: FundFilter },
  unitIds: { defaultLabel: "Đơn vị tính", component: UnitFilter },
  orderIds: { defaultLabel: "Đơn hàng", component: OrderFilter },
  itemIds: { defaultLabel: "Mặt hàng", component: ProductFilter },
  storeIds: { defaultLabel: "Cửa hàng", component: StoreFilter },
  roleIds: { defaultLabel: "Vai trò", component: RoleFilter },
  productIds: { defaultLabel: "Hàng hóa", component: ProductFilter },
  productGroupIds: { defaultLabel: "Nhóm hàng hóa", component: CategoryFilter },
};

export const FilterPanel: React.FC<FilterPanelProps> = ({ filterUses, filterLabels }) => {
  const { currentStore, filter, handleSetFilter } = useGlobalData();
  const [activeKeys, setActiveKeys] = useState<FilterKey[]>(() =>
    filterUses.filter((key) => (filter?.[key]?.length ?? 0) > 0),
  );

  const handleToggle = (keys: string[]) => {
    const nextActiveKeys = keys as FilterKey[];
    const closedKeys = filterUses.filter((key) => !nextActiveKeys.includes(key));

    if (closedKeys.length > 0) {
      const nextFilter: Filter = { ...filter };
      closedKeys.forEach((key) => delete nextFilter[key]);
      handleSetFilter(nextFilter);
    }

    setActiveKeys(nextActiveKeys);
  };

  return (
    <Collapse
      bordered={false}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined
          rotate={isActive ? 90 : 0}
          className="transition-transform text-gray-600"
        />
      )}
      className="!bg-transparent custom-filter-collapse"
      activeKey={activeKeys}
      onChange={(keys) => handleToggle(keys as string[])}
    >
      {filterUses.map((key) => {
        const filterInfo = filterMap[key];
        const Component = filterInfo?.component;
        if (!filterInfo || !Component) return null;

        return (
          <Collapse.Panel
            key={key}
            header={
              <div
                className="flex justify-between items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  onClick={() => {
                    if (!activeKeys.includes(key)) {
                      setActiveKeys([...activeKeys, key]);
                    } else {
                      handleToggle(activeKeys.filter((k) => k !== key));
                    }
                  }}
                >
                  {filterLabels?.[key] || filterInfo.defaultLabel}
                </span>

                {!!filter?.[key]?.length && (
                  <button
                    className="font-light"
                    onClick={() => handleSetFilter({ ...filter, [key]: [] })}
                  >
                    Bỏ lọc
                  </button>
                )}
              </div>
            }
            className="custom-filter-panel"
          >
            <div className="pt-2">
              <Component
                showStore={!currentStore}
                data={filter?.[key] || []}
                setData={(data: any) => handleSetFilter({ ...filter, [key]: data })}
              />
            </div>
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
};
