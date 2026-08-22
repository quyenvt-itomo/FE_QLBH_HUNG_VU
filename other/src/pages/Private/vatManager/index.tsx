import { useEffect, useState } from "react";
import { useClientData } from "../../../hooks/core/useClientData";
import { Tabs } from "antd";
import { getHashFromParams } from "../../../utils/paramUtils";
import { Report } from "./partials/Report";
import { VatAdjustment } from "./partials/VatAdjustment";
import { checkModule } from "../../../utils/permissionUtils";

const Page: React.FC = () => {
  const contentMap: Record<string, React.ReactNode> = {};
  const items = [];
  const [tabActive, setTabActive] = useState<string>(() => {
    const hash = getHashFromParams();
    return hash || "report";
  });

  const { permissions } = useClientData();

  useEffect(() => {
    window.history.replaceState(null, "", `#${tabActive}`);
  }, [tabActive]);

  useEffect(() => {
    const hash = getHashFromParams();
    if (hash) {
      setTabActive(hash);
    }
  }, []);

  const onTabChange = (key: string) => {
    setTabActive(key);
  };

  if (checkModule(permissions, "vatReport")) {
    items.push({ key: "report", label: "Báo cáo thuế VAT" });
    contentMap.report = <Report />;
  }

  if (checkModule(permissions, "vatAdjustment")) {
    items.push({ key: "vat-adjustment", label: "Điều chỉnh thuế VAT" });
    contentMap["vat-adjustment"] = <VatAdjustment />;
  }

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <Tabs activeKey={tabActive} items={items} onChange={onTabChange} />
      <div className="flex flex-col h-[calc(100%-40px)]">{contentMap[tabActive]}</div>
    </div>
  );
};

export default Page;
