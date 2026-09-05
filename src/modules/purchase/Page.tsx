import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { usePageState } from "@/shared/hooks/usePageState";
import { AddButton, Panel, SearchInput } from "@/shared/components";
import { PanelFilter } from "@/shared/components/filters";
import { usePurchaseStore } from "./purchase.store";
import { Purchase, OrderStatus, purchaseStatusItems } from "./purchase.model";
import { PurchaseTable } from "./components/PurchaseTable";
import { AddUpdatePurchaseModal } from "./components/AddUpdatePurchaseModal";
import { PurchaseDetailModal } from "./components/PurchaseDetailModal";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { usePurchaseHandlers } from "./purchase.handlers";
import { PurchaseFile } from "./purchase.file";
import { ProductBarcodePrintModal } from "@/modules/product/components/ProductBarcodePrintModal";
import { getLineProduct } from "./purchase.util";
import { SortOrder } from "@/shared/constants/enum";

const PurchasePage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { defaultCreateData?: Partial<Purchase> } | null;
  const [statusValues, setStatusValues] = useState<OrderStatus[]>([OrderStatus.DRAFT, OrderStatus.COMPLETED]);
  const [barcodeData, setBarcodeData] = useState<Purchase>();
  const handledDefaultCreateState = useRef<unknown>();
  const {
    isFilterActive,
    keyword,
    page,
    size,
    sortBy,
    sortOrder,
    filter,
    ranger,
    reload,
    setPage,
    setSize,
    open,
    setOpen,
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,
    defaultData,
    setDefaultData,
    pageAction,
  } = usePageState<Purchase>({ sortBy: "orderAt", sortOrder: SortOrder.DESC, filterUses });

  const store = usePurchaseStore({
    keyword,
    page,
    size,
    sortBy,
    sortOrder,
    reload,
    type: "purchase" as any,
    statuses: statusValues,
    ...filter,
    ...ranger,
  }, () => pageAction.handleClose());

  const handlers = usePurchaseHandlers({
    getById: store.getById,
    create: store.create,
    update: store.update,
    remove: store.remove,
    cancel: store.cancel,
    complete: store.complete,
    setOpen,
    setOpenDetail,
    setRowData,
    setDefaultData,
    setBarcodeData,
  });

  useEffect(() => {
    if (!state?.defaultCreateData || !handlers.handleOpenAdd || handledDefaultCreateState.current === state) return;
    handledDefaultCreateState.current = state;
    handlers.handleOpenAdd();
    setDefaultData(state.defaultCreateData);
    window.history.replaceState({}, "");
  }, [state, handlers.handleOpenAdd, setDefaultData]);

  const barcodeProducts = useMemo(() => {
    const map = new Map<string, any>();
    (barcodeData?.lines || []).forEach((line: any) => {
      const product = getLineProduct(line);
      if (product?.id) map.set(product.id, product);
    });
    return Array.from(map.values());
  }, [barcodeData]);

  const barcodeItems = useMemo(() => {
    const items = (barcodeData?.lines || []).map((line: any, index: number) => {
      const product = getLineProduct(line);
      const barcode = product?.barcode?.trim();
      if (!product?.id || !barcode) return null;
      return {
        id: `${product.id}-${line.id || line.tempId || index}`,
        barcode,
        code: product.code || "",
        name: product.name || "",
        price: product.salePrice,
        quantity: Math.max(1, Number(line.quantity || 1)),
      };
    }).filter(Boolean);
    return items as Array<{ id: string; barcode: string; code: string; name: string; price?: number | null; quantity?: number }>;
  }, [barcodeData]);

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2"><h1 className="m-0 text-xl font-semibold">Nhập hàng</h1><span className="text-sm text-gray-500">Danh sách phiếu nhập hàng</span></div>
        <Space>
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={320} />
          <Button icon={<DownloadOutlined />} onClick={() => PurchaseFile.downloadTemplate()}>Biểu mẫu</Button>
          {handlers.handleOpenAdd && <AddButton title="Thêm phiếu nhập" onOpenAdd={handlers.handleOpenAdd} />}
        </Space>
      </div>
      <div className="flex min-h-0 flex-1 gap-3">
        <PanelFilter
          className="hidden xl:flex"
          filterActive={isFilterActive || statusValues.length !== 2 || !statusValues.includes(OrderStatus.DRAFT) || !statusValues.includes(OrderStatus.COMPLETED)}
          sortItems={sortItems}
          sortValue={{ sortBy, sortOrder }}
          onSortChange={pageAction.handleSortChange}
          rangerItems={rangerItems}
          rangerValue={ranger}
          onRangerChange={pageAction.handleRangerChange}
          filterUses={filterUses}
          onClearFilter={() => { pageAction.resetFilter(); setStatusValues([OrderStatus.DRAFT, OrderStatus.COMPLETED]); }}
          enumFilters={[{ label: "Trạng thái", items: purchaseStatusItems, value: statusValues, onChange: (values) => { setStatusValues(values as OrderStatus[]); setPage(1); } }]}
        />
        <Panel className="min-w-0 flex-1">
          <PurchaseTable
            dataSource={store.data}
            loading={store.loading}
            pagination={store.pagination}
            setPage={setPage}
            setSize={setSize}
            onViewDetail={handlers.handleOpenDetail}
            onEdit={handlers.handleOpenEdit}
            onDelete={handlers.handleDelete}
            onCancel={handlers.handleCancel}
            onComplete={handlers.handleComplete}
            onCopy={handlers.handleCopy}
            onExportExcel={handlers.handleExportExcel}
            onPrint={handlers.handlePrint}
            onPrintBarcode={handlers.handlePrintBarcode}
          />
        </Panel>
      </div>
      <AddUpdatePurchaseModal
        open={open}
        editData={rowData}
        defaultData={defaultData}
        loading={store.creating || store.updating}
        errors={store.errors}
        onAdd={store.create}
        onEdit={store.update}
        onClose={() => pageAction.handleClose(false)}
      />
      <PurchaseDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => pageAction.handleClose()}
        onOpenUpdate={handlers.handleEditFromDetail}
        onDelete={handlers.handleDelete}
        onCancel={handlers.handleCancel}
        onComplete={handlers.handleComplete}
        onCopy={handlers.handleCopy}
        onExportExcel={handlers.handleExportExcel}
        onPrint={handlers.handlePrint}
        onPrintBarcode={handlers.handlePrintBarcode}
      />
      <ProductBarcodePrintModal
        open={!!barcodeData}
        products={barcodeProducts}
        initialItems={barcodeItems}
        onClose={() => setBarcodeData(undefined)}
      />
    </div>
  );
};

export default PurchasePage;
