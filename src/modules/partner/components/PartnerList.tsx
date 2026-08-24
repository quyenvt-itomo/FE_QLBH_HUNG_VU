import React from "react";
import { ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { PartnerCardBase } from "./Card";
import { Partner, PartnerType, partnerTypeMap } from "../partner.model";
import { Button, Empty, Spin } from "antd";

interface PartnerListProps extends ObjectTableProps {
  dataSource: Partner[];
  type: PartnerType;
  loading?: boolean;
  onAdd?: () => void;
}
export const PartnerList: React.FC<PartnerListProps> = ({
  dataSource,
  type,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onViewDetail,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-6 py-3 relative">
      {dataSource.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="flex flex-col items-center">
              <span>Chưa có {partnerTypeMap[type]?.toLowerCase()} nào</span>
              {onAdd && (
                <Button type="primary" onClick={onAdd} className="mt-4 h-10 rounded-lg w-fit">
                  Thêm {partnerTypeMap[type]?.toLowerCase()}
                </Button>
              )}
            </div>
          }
          className="col-span-full"
        />
      )}

      {dataSource.map((item: any) => (
        <PartnerCardBase
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onViewDetail}
        />
      ))}

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center">
          <Spin />
        </div>
      )}
    </div>
  );
};
