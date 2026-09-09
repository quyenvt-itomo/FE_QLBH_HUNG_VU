import { Tabs } from "antd";
import { useMemo } from "react";
import { PartnerDebtReportPage } from "@/modules/partnerDebtReport";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { useHashTabs } from "@/shared/hooks/useHashTabs";
import { checkModule } from "@/shared/utils/permission.util";

type Tab = "partner-debt-report";

export const DebtManagermentPage: React.FC = () => {
  const { permissions } = useGlobalData();
  const items = useMemo(
    () =>
      checkModule(permissions, "debtReport")
        ? [{ label: "Công nợ đối tác", key: "partner-debt-report" as Tab }]
        : [],
    [permissions],
  );
  const { activeTab, onTabChange } = useHashTabs<Tab>({ items });

  if (!activeTab) return null;

  return (
    <div className="h-full">
      <Tabs
        className="custom-tabs"
        activeKey={activeTab}
        onChange={(key) => onTabChange(key as Tab)}
        items={items}
      />
      <div className="mt-2 flex h-[calc(100%-48px)] flex-col">
        <PartnerDebtReportPage />
      </div>
    </div>
  );
};
