import React, { useEffect, useState } from "react";
import { getDelayStyle } from "../../../../../../utils/style.util";
import { useNavigate, useParams } from "react-router-dom";
import { PartialProps } from "../../DetailPage";
import { IPartner } from "../../../../../../models/partner";
import AddressBank from "./AddressBank";
import { OrganizationInfo } from "./OrganizationInfo";
import { Button } from "antd";
import { privateRoutesName } from "../../../../../../constants/routerName";
import { DebtReport } from "./DebtReport";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import { checkModule } from "../../../../../../utils/permissionUtils";
import { LoyaltyPointReport } from "./LoyaltyPointReport";

interface DetailTabsProps extends PartialProps {
  customer?: IPartner;
  onEdit?: (data: Partial<IPartner>) => void | Promise<void>;
  onReload?: () => void;
}

const DetailTabs: React.FC<DetailTabsProps> = ({ customer, onEdit, onReload }) => {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>();
  const { permissions } = useClientData();

  const tabs = [
    { key: "addressBank", label: "Địa chỉ & Tài khoản ngân hàng" },
    ...(customer?.isOrganization ? [{ key: "organization", label: "Thông tin tổ chức" }] : []),
  ];

  if (checkModule(permissions, "debtReport")) {
    tabs.push({ key: "debtReport", label: "Báo cáo công nợ" });
  }

  if (checkModule(permissions, "loyaltyPointReport")) {
    tabs.push({ key: "loyaltyPointReport", label: "Báo cáo tích điểm" });
  }

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab(tabs[0].key);
    }
  }, [tab]);

  if (!customer) {
    return <></>;
  }

  const contentMap: { [key: string]: React.ReactNode } = {
    addressBank: <AddressBank customer={customer} onEdit={onEdit} />,
    organization: <OrganizationInfo customer={customer} onEdit={onEdit} onReload={onReload} />,
    debtReport: <DebtReport customer={customer} />,
    loyaltyPointReport: <LoyaltyPointReport customer={customer} />,
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {tabs.map((t, index) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`
              relative overflow-hidden
              px-6 py-2.5 rounded-lg font-medium text-sm
              transition-all duration-300 ease-in-out
              shadow-md
              text-gray-500 
              after:content-['']
              after:absolute
              after:left-1/2
              after:bottom-0
              after:h-[2px]
              after:w-full
              after:bg-primary
              after:-translate-x-1/2
              after:scale-x-0
              after:origin-center
              after:transition-transform
              after:duration-300
              after:ease-out
              ${
                activeTab === t.key
                  ? "text-primary shadow-lg after:scale-x-100 bg-white"
                  : "hover:after:scale-x-100 bg-white/50 hover:bg-white/80"
              }
              `}
              style={getDelayStyle(index)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button className="h-8" onClick={() => navigate(privateRoutesName.customer.page)}>
          Quay lại
        </Button>
      </div>

      <div key={activeTab} className="flex-1 rounded-xl h-[calc(100%-62px)]">
        {contentMap[activeTab || ""]}
      </div>
    </div>
  );
};

export default DetailTabs;
