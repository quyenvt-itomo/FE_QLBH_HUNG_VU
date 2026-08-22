import { useEffect, useState } from "react";
import { useClientData } from "../../../hooks/core/useClientData";
import { checkModule } from "../../../utils/permissionUtils";
import { FundList } from "./partials/FundList";
import { Report } from "./partials/Report";
import { Tabs, TabsProps } from "antd";
import { FundAdjustment } from "./partials/FundAdjustment";
import { FundTransfer } from "./partials/FundTransfer";

const Page: React.FC = () => {
  const contentMap: Record<string, React.ReactNode> = {};
  const items: TabsProps["items"] = [];
  const [tabActive, setTabActive] = useState<string>("fund");
  const { permissions } = useClientData();

  if (checkModule(permissions, "fundReport")) {
    items.push({ key: "report", label: "Tổng hợp tồn quỹ" });
    contentMap.report = <Report />;
  }

  if (checkModule(permissions, "fundTransfer")) {
    items.push({ key: "fund-transfer", label: "Chuyển quỹ" });
    contentMap["fund-transfer"] = <FundTransfer />;
  }

  if (checkModule(permissions, "fundAdjustment")) {
    items.push({ key: "fund-adjustment", label: "Kiểm quỹ" });
    contentMap["fund-adjustment"] = <FundAdjustment />;
  }

  if (checkModule(permissions, "fund")) {
    items.push({ key: "fund", label: "Danh sách quỹ" });
    contentMap.fund = <FundList />;
  }

  useEffect(() => {
    if (items.length > 0) {
      setTabActive(items[0].key as string);
    }
  }, []);

  return (
    <div className="flex gap-6 w-full h-full">
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
