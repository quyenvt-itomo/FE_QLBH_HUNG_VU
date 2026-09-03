import React from "react";
import { Button, Empty, Spin } from "antd";
import { ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { Partner } from "../partner.model";
import { PartnerCardBase } from "./Card";

interface ShipperListProps extends ObjectTableProps {
  dataSource: Partner[];
  onAdd?: () => void;
}

export const ShipperList: React.FC<ShipperListProps> = ({ dataSource, loading, onAdd, onEdit, onDelete, onViewDetail }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-6 py-3 relative">
    {dataSource.length === 0 && (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<div className="flex flex-col items-center"><span>Chưa có đơn vị vận chuyển nào</span>{onAdd && <Button type="primary" onClick={onAdd} className="mt-4 h-10 rounded-lg w-fit">Thêm đơn vị vận chuyển</Button>}</div>}
        className="col-span-full"
      />
    )}
    {dataSource.map((item) => <PartnerCardBase key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onClick={onViewDetail} />)}
    {loading && <div className="absolute top-0 left-0 w-full h-full bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center"><Spin /></div>}
  </div>
);
