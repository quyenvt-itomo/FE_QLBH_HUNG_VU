import React, { useEffect, useState } from "react";
import { Modal, Tabs } from "antd";
import { DetailModalProps } from "@/shared/interfaces/common";
import { InfoTab } from "./InfoTab";
import { BankTab } from "./BankTab";
import { ContactTab } from "./ContactTab";
import { Partner } from "../../partner.model";

export const PartnerDetailModal: React.FC<DetailModalProps<Partner>> = ({
  open,
  data,
  onClose,
  onOpenUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (open) setActiveTab("info");
  }, [open]);

  if (!data) return null;

  const tabItems = [
    { key: "info", label: "Thông tin" },
    { key: "banks", label: `Tài khoản NH (${data.banks?.length ?? 0})` },
    { key: "contacts", label: `Người liên hệ (${data.contacts?.length ?? 0})` },
  ];

  const contentMap: Record<string, React.ReactNode> = {
    info: <InfoTab data={data} />,
    banks: <BankTab data={data} />,
    contacts: <ContactTab data={data} />,
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
