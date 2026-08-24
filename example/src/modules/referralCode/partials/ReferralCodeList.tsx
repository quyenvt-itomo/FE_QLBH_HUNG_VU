import React from "react";
import { Button, Empty, Spin } from "antd";
import { PlusIcon } from "@heroicons/react/24/solid";
import { PurchaseRequisition } from "@/modules/purchaseRequisition";
import { ApproveStatus } from "@/modules/shared/business.model";
import { ReferralCode } from "../referralCode.model";
import { useReferralCodeStore } from "../referralCode.store";
import { ReferralCodeCardBase, ReferralCodeAddModal, ReferralCodeDetailModal } from "../components";
import Title from "@/shared/components/display/Title";
import { SortOrder } from "@/shared/constants/enum";
import { usePageState } from "@/shared/hooks/usePageState";

interface ReferralCodeListProps {
  purchaseRequisition: PurchaseRequisition;
}

/**
 * Partial component - mini page hiển thị danh sách mã giới thiệu của một đề nghị mua vật tư.
 * Tự xử lý toàn bộ logic fetch, create, detail và UI.
 * Không thể đứng độc lập - cần truyền purchaseRequisition.
 */
export const ReferralCodeList: React.FC<ReferralCodeListProps> = ({ purchaseRequisition }) => {
  const {
    page,
    sortBy,
    sortOrder,
    reload,
    setPage,
    setSize,
    open,
    setOpen,
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,
    pageAction,
  } = usePageState<ReferralCode>({
    sortBy: "createdAt",
    sortOrder: SortOrder.DESC,
  });

  const { data, loading, create, creating } = useReferralCodeStore({
    page,
    size: 9999,
    sortBy,
    sortOrder,
    purchaseRequisitionId: purchaseRequisition.id,
  });

  const canCreate = purchaseRequisition.approveStatus === ApproveStatus.APPROVED;

  const list = data || [];

  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="flex items-center justify-between mb-3">
        <Title content="Mã giới thiệu" />
        {canCreate && (
          <Button
            size="small"
            icon={<PlusIcon className="h-4 w-4" />}
            loading={creating}
            onClick={() => setOpen(true)}
          >
            Tạo mã
          </Button>
        )}
      </div>

      {/* Danh sách card */}
      {loading ? (
        <Spin />
      ) : list.length === 0 ? (
        <Empty description="Chưa có mã giới thiệu" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className="flex flex-col gap-1.5 overflow-auto">
          {list.map((rc) => (
            <ReferralCodeCardBase
              key={rc.id}
              item={rc}
              onClick={(item) => {
                setRowData(item);
                setOpenDetail(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal thêm mã */}
      <ReferralCodeAddModal
        open={open}
        loading={creating}
        purchaseRequisition={purchaseRequisition}
        onAdd={(payload) => {
          create?.(payload as any);
        }}
        onClose={() => setOpen(false)}
      />

      {/* Modal chi tiết */}
      <ReferralCodeDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
      />
    </div>
  );
};
