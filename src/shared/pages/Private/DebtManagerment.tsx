import { Tabs } from "antd";
import { useMemo } from "react";
import { checkModule } from "@/shared/utils/permission.util";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { useHashTabs } from "@/shared/hooks/useHashTabs";
import { CurrentDebtReportPage, PartnerDebtReportPage } from "@/modules/partnerDebtReport";
import { InvoiceType } from "@/modules/invoice";

type Tab =
  | "purchase-debt"
  | "sale-debt"
  | "partner-debt-report"
  | "partner-debt-adjustment"
  | "partner-debt-offset"
  | "commission-debt-adjustment"
  | "commission-debt-report"
  | "vat-debt-adjustment"
  | "vat-debt-report";

export const DebtManagermentPage: React.FC = () => {
  const contentMap: Record<Tab, React.ReactNode> = {
    "purchase-debt": <CurrentDebtReportPage invoiceType={InvoiceType.INPUT} />,
    "sale-debt": <CurrentDebtReportPage invoiceType={InvoiceType.OUTPUT} />,
    "partner-debt-report": <PartnerDebtReportPage />,
  };
  const { permissions } = useGlobalData();

  const items = useMemo(() => {
    const result: { label: string; key: Tab }[] = [];
    if (checkModule(permissions, "partnerDebtReport")) {
      result.push({ label: "Công nợ mua", key: "purchase-debt" });
      result.push({ label: "Công nợ bán", key: "sale-debt" });
    }

    if (checkModule(permissions, "commissionDebtReport")) {
      result.push({ label: "Công nợ hoa hồng", key: "commission-debt-adjustment" });
    }

    if (checkModule(permissions, "partnerDebtReport")) {
      result.push({ label: "Báo cáo công nợ đối tác", key: "partner-debt-report" });
    }

    if (checkModule(permissions, "commissionDebtReport")) {
      result.push({ label: "Báo cáo công nợ hoa hồng", key: "commission-debt-report" });
    }

    if (checkModule(permissions, "partnerDebtAdjustment")) {
      result.push({ label: "Đối trừ công nợ", key: "partner-debt-offset" });
    }
    return result;
  }, [permissions]);

  const { activeTab, onTabChange } = useHashTabs<Tab>({ items });

  if (!activeTab) return null;

  return (
    <div className="h-full">
      <Tabs
        className="custom-tabs"
        activeKey={activeTab}
        onChange={(key: string) => onTabChange(key as Tab)}
        items={items}
      />
      <div className="h-[calc(100%-48px)] mt-2 flex flex-col">{contentMap[activeTab]}</div>
    </div>
  );
};
