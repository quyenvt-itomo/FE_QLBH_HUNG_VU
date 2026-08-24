import React from "react";
import { PartnerType } from "./partner.model";
import { useSupplierStore } from "./partner.store";
import { PartnerBusinessPageView } from "./PartnerBusinessPage";
import { usePartnerBusinessPage } from "./partnerBusinessPage.hook";

const SupplierPage: React.FC = () => (
  <PartnerBusinessPageView
    {...usePartnerBusinessPage(useSupplierStore, PartnerType.SUPPLIER)}
    type={PartnerType.SUPPLIER}
    title="Nhà cung cấp"
    itemName="nhà cung cấp"
  />
);

export default SupplierPage;
