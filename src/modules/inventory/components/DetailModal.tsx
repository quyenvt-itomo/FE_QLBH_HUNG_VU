import React from "react";
import { Modal } from "antd";
import {
  InventoryReport,
  InventoryTransaction,
  InventoryTransactionRefType,
} from "../inventory.model";
import { PaginationProps, SummaryData } from "@/shared/interfaces/api";
import { InventoryTransactionTable } from "../partials/InventoryTransactionTable";
import { InventoryTransactionToolbar } from "../partials/InventoryTransactionToolbar";

interface Props {
  product?: InventoryReport;
  dataSource: InventoryTransaction[];
  summaryData?: SummaryData | null;
  pagination?: PaginationProps | null;
  setPage?: (page: number) => void;
  setSize?: (size: number) => void;
  open: boolean;
  startAt?: string;
  endAt?: string;
  refType?: InventoryTransactionRefType;
  setRefType?: (refType?: InventoryTransactionRefType) => void;
  onDateRangerChange?: (startAt?: string, endAt?: string) => void;
  onClose: () => void;
}

export const DetailInventoryReportModal: React.FC<Props> = ({
  dataSource,
  product,
  summaryData,
  pagination,
  setPage,
  setSize,
  endAt,
  startAt,
  onDateRangerChange,
  refType,
  setRefType,
  open,
  onClose,
}) => {
  if (!product) return null;

  return (
    <Modal
      title={`Chi tiết tồn kho - ${product.name || ""}`}
      open={open}
      footer={null}
      destroyOnClose
      maskClosable={false}
      centered
      width="100vw"
      className="fullscreen-modal"
      onCancel={onClose}
    >
      <div className="flex flex-col h-full gap-3">
        <InventoryTransactionToolbar
          product={product}
          refType={refType}
          setRefType={setRefType}
          startAt={startAt}
          endAt={endAt}
          onDateRangerChange={onDateRangerChange}
        />

        <div className="flex flex-col h-[calc(100%-76px)] rounded-lg border overflow-hidden">
          <InventoryTransactionTable
            dataSource={dataSource}
            summaryData={summaryData}
            pagination={pagination}
            setPage={setPage}
            setSize={setSize}
          />
        </div>
      </div>
    </Modal>
  );
};
