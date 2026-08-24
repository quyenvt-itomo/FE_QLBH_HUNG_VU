import React from "react";
import { PartnerType } from "./partner.model";
import { useCustomerStore } from "./partner.store";
import { PartnerBusinessPageView } from "./PartnerBusinessPage";
import { usePartnerBusinessPage } from "./partnerBusinessPage.hook";

const CustomerPage: React.FC = () => (
  <PartnerBusinessPageView
    {...usePartnerBusinessPage(useCustomerStore, PartnerType.CUSTOMER)}
    type={PartnerType.CUSTOMER}
    title="Khách hàng"
    itemName="khách hàng"
  />
);

export default CustomerPage;
