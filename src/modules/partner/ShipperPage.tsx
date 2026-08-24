import React from "react";
import { PartnerType } from "./partner.model";
import { useShipperStore } from "./partner.store";
import { PartnerBusinessPageView } from "./PartnerBusinessPage";
import { usePartnerBusinessPage } from "./partnerBusinessPage.hook";

const ShipperPage: React.FC = () => (
  <PartnerBusinessPageView
    {...usePartnerBusinessPage(useShipperStore, PartnerType.SHIPPER)}
    type={PartnerType.SHIPPER}
    title="Đơn vị vận chuyển"
    itemName="đơn vị vận chuyển"
  />
);

export default ShipperPage;
