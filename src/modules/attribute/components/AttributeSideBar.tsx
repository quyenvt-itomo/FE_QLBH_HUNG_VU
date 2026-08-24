import React from "react";
import {
  BanknotesIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  RectangleStackIcon,
  ScaleIcon,
  TagIcon,
  TruckIcon,
  UserGroupIcon,
  WalletIcon,
} from "@/shared/icons";
import { AttributeType, attributeTypeMap } from "../attribute.enum";

interface AttributeSideBarProps {
  activeType: AttributeType;
  onTypeChange: (type: AttributeType) => void;
}

type AttributeIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface AttributeSideBarItem {
  label: string;
  value: AttributeType;
  icon: AttributeIcon;
}

interface AttributeSideBarSection {
  title: string;
  items: AttributeSideBarItem[];
}

const typeConfig: AttributeSideBarSection[] = [
  {
    title: "Hàng hóa",
    items: [
      {
        label: attributeTypeMap[AttributeType.PRODUCT_GROUP],
        value: AttributeType.PRODUCT_GROUP,
        icon: CubeIcon,
      },
      {
        label: attributeTypeMap[AttributeType.BRAND],
        value: AttributeType.BRAND,
        icon: TagIcon,
      },
      {
        label: attributeTypeMap[AttributeType.UNIT],
        value: AttributeType.UNIT,
        icon: ScaleIcon,
      },
      {
        label: attributeTypeMap[AttributeType.LOCATION],
        value: AttributeType.LOCATION,
        icon: RectangleStackIcon,
      },
    ],
  },
  {
    title: "Hạng mục",
    items: [
      {
        label: attributeTypeMap[AttributeType.INCOME_CATEGORY],
        value: AttributeType.INCOME_CATEGORY,
        icon: WalletIcon,
      },
      {
        label: attributeTypeMap[AttributeType.EXPENSE_CATEGORY],
        value: AttributeType.EXPENSE_CATEGORY,
        icon: BanknotesIcon,
      },
    ],
  },
  {
    title: "Đối tác",
    items: [
      {
        label: attributeTypeMap[AttributeType.CUSTOMER_GROUP],
        value: AttributeType.CUSTOMER_GROUP,
        icon: UserGroupIcon,
      },
      {
        label: attributeTypeMap[AttributeType.SUPPLIER_GROUP],
        value: AttributeType.SUPPLIER_GROUP,
        icon: BuildingStorefrontIcon,
      },
      {
        label: attributeTypeMap[AttributeType.SHIPPER_GROUP],
        value: AttributeType.SHIPPER_GROUP,
        icon: TruckIcon,
      },
    ],
  },
];

export const AttributeSideBar: React.FC<AttributeSideBarProps> = ({ activeType, onTypeChange }) => (
  <aside className="flex h-full w-56 flex-shrink-0 flex-col overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 shadow-sm scrollbar-hide">
    {typeConfig.map((section) => (
      <section key={section.title} className="mb-5 last:mb-0">
        <h3 className="px-2 pb-2 text-[11px] font-medium tracking-wide text-slate-400 uppercase">
          {section.title}
        </h3>
        <div className="flex flex-col gap-1">
          {section.items.map(({ label, value, icon: Icon }) => {
            const isActive = activeType === value;

            return (
              <button
                key={value}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onTypeChange(value)}
                className={`relative flex min-h-10 w-full items-center gap-3 rounded-lg px-2.5 text-left text-sm transition-colors ease-in-out ${
                  isActive
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                <span
                  className={`absolute left-0 top-2 w-0.5 rounded-r bg-blue-600 transition-all ease-in-out ${isActive ? "h-6" : "h-0"}`}
                />
                <Icon
                  className={`h-[18px] w-[18px] flex-shrink-0 ${
                    isActive ? "text-blue-600" : "text-slate-400"
                  }`}
                />
                <span className="truncate" title={label}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    ))}
  </aside>
);
