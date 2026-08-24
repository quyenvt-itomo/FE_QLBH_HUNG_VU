import { Collapse } from "antd";
import { Filter, FilterKey } from "../../../models/base/interface";
import EmployeeFilter from "./EmployeeFilter";
import { CaretRightOutlined } from "@ant-design/icons";
import { useState } from "react";

import { useClientData } from "../../../hooks/core/useClientData";
import FundFilter from "./FundFilter";
import PartnerFilter from "./PartnerFilter";
import SupplierFilter from "./SupplierFilter";
import CustomerFilter from "./CustomerFilter";
import ShipperFilter from "./ShipperFilter";
import ProductFilter from "./ProductFilter";
import UnitFilter from "./UnitFilter";
import ProductGroupFilter from "./ProductGroupFilter";

interface FilterPanelProps {
  filterUses: FilterKey[];
  filterLabels?: { [key in FilterKey]?: string };
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filterUses, filterLabels }) => {
  const { filter, handleSetFilter } = useClientData();

  // panel nào có giá trị thì mở sẵn
  const [activeKeys, setActiveKeys] = useState<FilterKey[]>(() =>
    filterUses.filter((k) => (filter?.[k]?.length ?? 0) > 0),
  );

  const handleToggle = (keys: string[]) => {
    const nextActiveKeys = keys as FilterKey[];

    const closedKeys = filterUses.filter((k) => !nextActiveKeys.includes(k));

    if (closedKeys.length === 0) {
      setActiveKeys(nextActiveKeys);
      return;
    }

    const newValue: Filter = { ...filter };

    closedKeys.forEach((k) => {
      delete newValue[k];
    });

    setActiveKeys(nextActiveKeys);
    handleSetFilter(newValue);
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
      {filterUses.includes("employeeIds") && (
        <Collapse.Panel
          key="employeeIds"
          header={
            <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
              {filterLabels?.employeeIds || "Nhân viên"}

              {!!filter?.employeeIds?.length && (
                <button
                  className="font-light"
                  onClick={() => handleSetFilter({ ...filter, employeeIds: [] })}
                >
                  Bỏ lọc
                </button>
              )}
            </div>
          }
          className="custom-filter-panel"
        >
          <div className="pt-2">
            <EmployeeFilter
              data={filter?.employeeIds || []}
              setData={(employeeIds) =>
                handleSetFilter({
                  ...filter,
                  employeeIds,
                })
              }
            />
          </div>
        </Collapse.Panel>
      )}

      {filterUses.includes("fundIds") && (
        <Collapse.Panel
          key="fundIds"
          header={
            <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
              {filterLabels?.fundIds || "Quỹ"}

              {!!filter?.fundIds?.length && (
                <button
                  className="font-light"
                  onClick={() => handleSetFilter({ ...filter, fundIds: [] })}
                >
                  Bỏ lọc
                </button>
              )}
            </div>
          }
          className="custom-filter-panel"
        >
          <div className="pt-2">
            <FundFilter
              data={filter?.fundIds || []}
              setData={(fundIds) =>
                handleSetFilter({
                  ...filter,
                  fundIds,
                })
              }
            />
          </div>
        </Collapse.Panel>
      )}

      {filterUses.includes("partnerIds") && (
        <Collapse.Panel
          key="partnerIds"
          header={
            <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
              {filterLabels?.partnerIds || "Đối tác"}

              {!!filter?.partnerIds?.length && (
                <button
                  className="font-light"
                  onClick={() => handleSetFilter({ ...filter, partnerIds: [] })}
                >
                  Bỏ lọc
                </button>
              )}
            </div>
          }
          className="custom-filter-panel"
        >
          <div className="pt-2">
            <PartnerFilter
              data={filter?.partnerIds || []}
              setData={(partnerIds) =>
                handleSetFilter({
                  ...filter,
                  partnerIds,
                })
              }
            />
          </div>
        </Collapse.Panel>
      )}

      {filterUses.includes("supplierIds") && (
        <Collapse.Panel
          key="supplierIds"
          header={
            <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
              {filterLabels?.supplierIds || "Nhà cung cấp"}

              {!!filter?.supplierIds?.length && (
                <button
                  className="font-light"
                  onClick={() => handleSetFilter({ ...filter, supplierIds: [] })}
                >
                  Bỏ lọc
                </button>
              )}
            </div>
          }
          className="custom-filter-panel"
        >
          <div className="pt-2">
            <SupplierFilter
              data={filter?.supplierIds || []}
              setData={(supplierIds) =>
                handleSetFilter({
                  ...filter,
                  supplierIds,
                })
              }
            />
          </div>
        </Collapse.Panel>
      )}

      {filterUses.includes("customerIds") && (
        <Collapse.Panel
          key="customerIds"
          header={
            <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
              {filterLabels?.customerIds || "Khách hàng"}

              {!!filter?.customerIds?.length && (
                <button
                  className="font-light"
                  onClick={() => handleSetFilter({ ...filter, customerIds: [] })}
                >
                  Bỏ lọc
                </button>
              )}
            </div>
          }
          className="custom-filter-panel"
        >
          <div className="pt-2">
            <CustomerFilter
              data={filter?.customerIds || []}
              setData={(customerIds) =>
                handleSetFilter({
                  ...filter,
                  customerIds,
                })
              }
            />
          </div>
        </Collapse.Panel>
      )}

      {filterUses.includes("shipperIds") && (
        <Collapse.Panel
          key="shipperIds"
          header={
            <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
              {filterLabels?.shipperIds || "Đơn vị vận chuyển"}

              {!!filter?.shipperIds?.length && (
                <button
                  className="font-light"
                  onClick={() => handleSetFilter({ ...filter, shipperIds: [] })}
                >
                  Bỏ lọc
                </button>
              )}
            </div>
          }
          className="custom-filter-panel"
        >
          <div className="pt-2">
            <ShipperFilter
              data={filter?.shipperIds || []}
              setData={(shipperIds) =>
                handleSetFilter({
                  ...filter,
                  shipperIds,
                })
              }
            />
          </div>
        </Collapse.Panel>
      )}

      {filterUses.includes("productIds") && (
        <Collapse.Panel
          key="productIds"
          header={
            <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
              {filterLabels?.productIds || "Hàng hóa/sản phẩm"}

              {!!filter?.productIds?.length && (
                <button
                  className="font-light"
                  onClick={() => handleSetFilter({ ...filter, productIds: [] })}
                >
                  Bỏ lọc
                </button>
              )}
            </div>
          }
          className="custom-filter-panel"
        >
          <div className="pt-2">
            <ProductFilter
              data={filter?.productIds || []}
              setData={(productIds) =>
                handleSetFilter({
                  ...filter,
                  productIds,
                })
              }
            />
          </div>
        </Collapse.Panel>
      )}

      {filterUses.includes("productCategoryIds") && (
        <Collapse.Panel
          key="productCategoryIds"
          header={
            <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
              {filterLabels?.productCategoryIds || "Danh mục hàng hóa"}

              {!!filter?.productCategoryIds?.length && (
                <button
                  className="font-light"
                  onClick={() => handleSetFilter({ ...filter, productCategoryIds: [] })}
                >
                  Bỏ lọc
                </button>
              )}
            </div>
          }
          className="custom-filter-panel"
        >
          <div className="pt-2">
            <ProductGroupFilter
              data={filter?.productCategoryIds || []}
              setData={(productCategoryIds) =>
                handleSetFilter({
                  ...filter,
                  productCategoryIds,
                })
              }
            />
          </div>
        </Collapse.Panel>
      )}

      {filterUses.includes("unitIds") && (
        <Collapse.Panel
          key="unitIds"
          header={
            <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
              {filterLabels?.unitIds || "Đơn vị tính"}

              {!!filter?.unitIds?.length && (
                <button
                  className="font-light"
                  onClick={() => handleSetFilter({ ...filter, unitIds: [] })}
                >
                  Bỏ lọc
                </button>
              )}
            </div>
          }
          className="custom-filter-panel"
        >
          <div className="pt-2">
            <UnitFilter
              data={filter?.unitIds || []}
              setData={(unitIds) =>
                handleSetFilter({
                  ...filter,
                  unitIds,
                })
              }
            />
          </div>
        </Collapse.Panel>
      )}
    </Collapse>
  );
};
