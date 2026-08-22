import React from "react";
import { Tabs, Card, Skeleton, TabsProps } from "antd";
import { useClientData } from "../../../hooks/core/useClientData";
import { DashboardDataType, useDashboardData } from "../../../hooks/core/useDashboardData";
import { usePageState } from "../../../hooks/core/usePageState";
import { WelcomeScreen } from "../../../components/display/WelcomeScreen";
import DateRangeFilter from "../../../components/button/DateRangeFilter";
import {
  ChartPieIcon,
  ArrowTrendingUpIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  DocumentCurrencyDollarIcon,
  ExclamationTriangleIcon,
  InboxIcon,
  TruckIcon,
  UsersIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import StoreSelect from "../../../components/select/StoreSelect";
import CustomPageTitle from "../../../layout/Private/header/components/PageTitle";
import { Overview } from "./partials/Overview";
import { Profit } from "./partials/Profit";
import { Sales } from "./partials/Sales";
import { Product } from "./partials/Product";
import { ExcelButton } from "../../../components/button/ExcelButton";
import { ExcelEntityType } from "../../../constants/enum";
import dayjs from "dayjs";

export interface PartialProps<T = any> {
  data: T | null;
  loading?: boolean;
}

const Page: React.FC = () => {
  const { currentStore } = useClientData();
  const { storeId, reload, startAt, endAt, pageAction } = usePageState();
  const [tabActive, setTabActive] = React.useState<DashboardDataType>("overview");

  const { canView, overviewData, profitData, salesData, productData, loading } = useDashboardData({
    reload,
    startAt,
    endAt,
    storeId,
    type: tabActive,
  });

  const tabItems: TabsProps["items"] = [
    {
      key: "overview",
      label: (
        <span className="flex items-center gap-2">
          <ChartPieIcon className="h-5" />
          <span className="hidden sm:inline">Tổng quan</span>
        </span>
      ),
    },
    {
      key: "profit",
      label: (
        <span className="flex items-center gap-2">
          <CurrencyDollarIcon className="h-5" />
          <span className="hidden sm:inline">Lợi nhuận</span>
        </span>
      ),
    },
    {
      key: "sales",
      label: (
        <span className="flex items-center gap-2">
          <ArrowTrendingUpIcon className="h-5" />
          <span className="hidden sm:inline">Bán hàng</span>
        </span>
      ),
    },
    {
      key: "product",
      label: (
        <span className="flex items-center gap-2">
          <InboxIcon className="h-5" />
          <span className="hidden sm:inline">Sản phẩm</span>
        </span>
      ),
    },
    // {
    //   key: "purchase",
    //   label: (
    //     <span className="flex items-center gap-2">
    //       <TruckIcon className="h-5" />
    //       <span className="hidden sm:inline">Nhập hàng</span>
    //     </span>
    //   ),
    // },
    // ...(!currentStore
    //   ? [
    //       {
    //         key: "fund",
    //         label: (
    //           <span className="flex items-center gap-2">
    //             <WalletIcon className="h-5" />
    //             <span className="hidden sm:inline">Quỹ tiền</span>
    //           </span>
    //         ),
    //       },
    //     ]
    //   : []),
    // {
    //   key: "incomeExpense",
    //   label: (
    //     <span className="flex items-center gap-2">
    //       <DocumentCurrencyDollarIcon className="h-5" />
    //       <span className="hidden sm:inline">Thu chi</span>
    //     </span>
    //   ),
    // },
    // {
    //   key: "inventory",
    //   label: (
    //     <span className="flex items-center gap-2">
    //       <InboxIcon className="h-5" />
    //       <span className="hidden sm:inline">Tồn kho</span>
    //     </span>
    //   ),
    // },
    // {
    //   key: "debt",
    //   label: (
    //     <span className="flex items-center gap-2">
    //       <ExclamationTriangleIcon className="h-5" />
    //       <span className="hidden sm:inline">Công nợ</span>
    //     </span>
    //   ),
    // },
    // {
    //   key: "partner",
    //   label: (
    //     <span className="flex items-center gap-2">
    //       <UsersIcon className="h-5" />
    //       <span className="hidden sm:inline">Đối tác</span>
    //     </span>
    //   ),
    // },
    // ...(!currentStore
    //   ? [
    //       {
    //         key: "store",
    //         label: (
    //           <span className="flex items-center gap-2">
    //             <BuildingStorefrontIcon className="h-5" />
    //             <span className="hidden sm:inline">Cửa hàng</span>
    //           </span>
    //         ),
    //       },
    //     ]
    //   : []),
  ];

  const contentMap: Record<DashboardDataType, React.ReactNode> = {
    overview: <Overview data={overviewData} loading={loading} />,
    profit: <Profit data={profitData} loading={loading} />,
    sales: <Sales data={salesData} loading={loading} />,
    product: <Product data={productData} loading={loading} />,
    "detail-product": null,
  };

  return canView ? (
    <div className="h-full w-full flex flex-col gap-6 px-2 py-4 pb-0">
      <div className="flex w-full items-center justify-between">
        <CustomPageTitle />

        <div className="flex gap-3">
          {!currentStore && <StoreSelect value={storeId} onChange={pageAction.handleStoreChange} />}
          <DateRangeFilter
            startDate={startAt}
            endDate={endAt}
            onRangeChange={pageAction.handleDateRangerChange}
          />
          <ExcelButton
            entityType={ExcelEntityType.DASHBOARD}
            showImport={false}
            exportOptions={{
              filename: currentStore
                ? `Bao_cao_cua_hang_${currentStore.name?.replace(" ", "_")}_`
                : "Bao_cao_toan_he_thong_",
              filters: {
                storeId: currentStore?.id || storeId,
                startAt: dayjs(startAt).startOf("day").toISOString(),
                endAt: dayjs(endAt).endOf("day").toISOString(),
              },
            }}
          />
        </div>
      </div>
      <div className="flex gap-4 pl-2 w-full h-[calc(100%-56px)]">
        <div className="p-4 bg-white w-44 h-full rounded-lg shadow-sm">
          <Tabs
            activeKey={tabActive}
            onChange={(key) => setTabActive(key as DashboardDataType)}
            className="dashboard-tabs"
            items={tabItems}
            tabPosition="right"
          />
        </div>

        <div className="w-[calc(100%-192px)] px-2 h-full overflow-y-auto scrollbar-hide">
          {contentMap[tabActive]}
        </div>
      </div>
    </div>
  ) : (
    <WelcomeScreen />
  );
};

export default Page;
