import { useEffect, useState } from "react";
import { useClientData } from "../../../hooks/core/useClientData";
import { Tabs } from "antd";
import { getHashFromParams } from "../../../utils/paramUtils";
import { Report } from "./partials/Report";
import { DebtOffset } from "./partials/DebtOffset";
import { DebtAdjustment } from "./partials/DebtAdjustment";
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

  if (checkModule(permissions, "debtReport")) {
    items.push({ key: "report", label: "Báo cáo công nợ" });
    contentMap.report = <Report />;
  }

  if (checkModule(permissions, "debtAdjustment")) {
    items.push({ key: "debt-adjustment", label: "Điều chỉnh công nợ" });
    contentMap["debt-adjustment"] = <DebtAdjustment />;
  }

  if (checkModule(permissions, "debtOffset")) {
    items.push({ key: "debt-offset", label: "Đối trừ công nợ" });
    contentMap["debt-offset"] = <DebtOffset />;
  }

  return (
    <div className="flex flex-col h-full w-full gap-2">
      {/* <Tabs activeKey={tabActive} items={items} onChange={onTabChange} />
      <div className="flex flex-col h-[calc(100%-40px)]">{contentMap[tabActive]}</div> */}
      <div className="flex h-full gap-6 w-full">
        <div className="bg-white p-4 rounded-lg w-48">
          <Tabs activeKey={tabActive} items={items} onChange={setTabActive} tabPosition="right" />
        </div>
        <div className="flex flex-col h-full w-[calc(100%-216px)] bg-white p-4 rounded-lg">
          {contentMap[tabActive]}
        </div>
      </div>
    </div>
  );
};

export default Page;
