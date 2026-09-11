import React, { useEffect, useState } from "react";
import { Modal, Tabs } from "antd";
import { Product } from "../../product.model";
import { DetailModalProps } from "@/shared/interfaces/common";
import { InfoTab } from "./InfoTab";
import { DescriptionTab } from "./DescriptionTab";
import { StoreBranchesTab } from "./StoreBranchesTab";
import { InventoryTransactionTab } from "./InventoryTransactionTab";

export const ProductDetailModal: React.FC<DetailModalProps<Product>> = ({
  open,
  data,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (open) setActiveTab("info");
  }, [open, data?.id]);
  if (!data) return null;

  const tabItems = [
    { key: "info", label: "Thông tin" },
    { key: "description", label: "Mô tả & ghi chú" },
    { key: "stores", label: "Chi nhánh kinh doanh" },
    { key: "inventory", label: "Thẻ kho" },
    { key: "report", label: "Báo cáo" },
  ];
  const contentMap: Record<string, React.ReactNode> = {
    info: <InfoTab data={data} />,
    description: <DescriptionTab data={data} />,
    stores: <StoreBranchesTab data={data} />,
    inventory: <InventoryTransactionTab data={data} />,
    report: <div className="py-10 text-center text-gray-500">Sẽ hoàn thiện sau</div>,
  };

  const hideTabs = tabItems.length <= 1;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-800">{data.name}</span>
          <span className="font-mono text-sm text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
            {data.code}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      width={1280}
    >
      <div className="flex flex-col min-h-[50vh] gap-4">
        {!hideTabs && (
          <>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              tabBarStyle={{ marginBottom: 16 }}
            />
            {contentMap[activeTab] || null}
          </>
        )}
        {hideTabs && contentMap[tabItems[0].key]}
      </div>
    </Modal>
  );
};
