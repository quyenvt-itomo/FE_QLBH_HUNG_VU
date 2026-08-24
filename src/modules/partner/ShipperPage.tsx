import React from "react";
import { PartnerType } from "./partner.model";
import { useShipperStore } from "./partner.store";
import { PartnerBusinessPageView } from "./PartnerBusinessPage";
import { usePartnerBusinessPage } from "./partnerBusinessPage.hook";

const ShipperPage: React.FC = () => (
  <PartnerBusinessPageView
    {...usePartnerBusinessPage(useShipperStore, PartnerType.SHIPPER)}
    type={PartnerType.SHIPPER}
  />
);

export default ShipperPage;
