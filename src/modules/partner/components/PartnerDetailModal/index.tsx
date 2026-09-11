import React, { useEffect, useState } from "react";
import { Modal, Tabs } from "antd";
import { DetailModalProps } from "@/shared/interfaces/common";
import { InfoTab } from "./InfoTab";
import { BankTab } from "./BankTab";
import { ContactTab } from "./ContactTab";
import { Partner, PartnerType } from "../../partner.model";
import { checkModule } from "@/shared/utils";
import { useGlobalData } from "@/shared/hooks";
import { PayableDebtReport, ReceivableDebtReport } from "@/modules/partnerDebtReport";
import { OrderType } from "@/modules/order/order.model";
import { PartnerOrderHistory } from "../PartnerOrderHistory";

export const PartnerDetailModal: React.FC<DetailModalProps<Partner>> = ({
  open,
  data,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const { permissions } = useGlobalData();

  useEffect(() => {
    if (open) setActiveTab("info");
  }, [open, data?.id]);

  if (!data) return null;

  const tabItems = [
    { key: "info", label: "Thông tin" },
    { key: "banks", label: `Tài khoản NH (${data.banks?.length ?? 0})` },
    { key: "contacts", label: `Người liên hệ (${data.contacts?.length ?? 0})` },
  ];

  if (data.type === PartnerType.CUSTOMER) {
    if (checkModule(permissions, "sale")) {
      tabItems.push({ key: "sales", label: "Lịch sử mua hàng" });
    }

    if (checkModule(permissions, "saleReturn")) {
      tabItems.push({ key: "saleReturns", label: "Trả hàng" });
    }
  }

  if (data.type === PartnerType.SUPPLIER) {
    if (checkModule(permissions, "purchase")) {
      tabItems.push({ key: "purchases", label: "Lịch sử nhập hàng" });
    }

    if (checkModule(permissions, "purchaseReturn")) {
      tabItems.push({ key: "purchaseReturns", label: "Trả hàng" });
    }
  }

  if (data.type === PartnerType.SHIPPER) {
    tabItems.push({ key: "shipments", label: "Đơn đã vận chuyển" });
  }

  if (checkModule(permissions, "debtReport")) {
    tabItems.push({ key: "debts", label: "Công nợ" });
  }

  const contentMap: Record<string, React.ReactNode> = {
    info: <InfoTab data={data} />,
    banks: <BankTab data={data} />,
    contacts: <ContactTab data={data} />,
    sales: (
      <PartnerOrderHistory
        partnerId={data.id}
        mode="customer"
        orderType={OrderType.SALE}
      />
    ),
    saleReturns: (
      <PartnerOrderHistory
        partnerId={data.id}
        mode="customer"
        orderType={OrderType.SALE_RETURN}
      />
    ),
    purchases: (
      <PartnerOrderHistory
        partnerId={data.id}
        mode="supplier"
        orderType={OrderType.PURCHASE}
      />
    ),
    purchaseReturns: (
      <PartnerOrderHistory
        partnerId={data.id}
        mode="supplier"
        orderType={OrderType.PURCHASE_RETURN}
      />
    ),
    shipments: <PartnerOrderHistory partnerId={data.id} mode="shipper" />,
    debts:
      data.type === PartnerType.CUSTOMER ? (
        <ReceivableDebtReport partner={data} />
      ) : (
        <PayableDebtReport partner={data} />
      ),
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{data.name}</span>
          <span className="font-mono text-sm text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
            {data.code}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      maskClosable={false}
      width={1280}
    >
      <div className="flex flex-col gap-4">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabBarStyle={{ marginBottom: 16 }}
        />
        <div className="flex flex-col h-[70vh] overflow-y-auto scrollbar-hide">
          {contentMap[activeTab] || null}
        </div>
      </div>
    </Modal>
  );
};
