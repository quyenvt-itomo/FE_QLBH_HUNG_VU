import { usePageState } from "../../../hooks/core/usePageState";
import { useClientData } from "../../../hooks/core/useClientData";
import {
  connectToInventoryStream,
  getFullVariantOptionContent,
  getLocationNotification,
} from "../../../utils/common";
import InventoryTransactionTable from "./components/InventoryTransactionTable";
import DateRangeFilter from "../../../components/button/DateRangeFilter";
import { useProductData } from "../../../hooks/product/useProductData";
import { useEffect, useState } from "react";
import { IProduct } from "../../../models/product";
import ProductImage from "../../../components/image/ProductImage";
import { getMainImage } from "../../../utils/fileUtil";
import { Button, Select } from "antd";
import { IconArrowDown } from "../../../components/icon/ArrowDown";
import NotFoundData from "../../../components/display/NotFoundData";
import { useNotFoundGuard } from "../../../hooks/core/useNotFoundGuard";
import StoreSelect from "../../../components/select/StoreSelect";
import { useInventoryData } from "../../../hooks/inventory/useInventoryData";
import { BackButton } from "../../../components/button/BackButton";
import { InventoryStreamData } from "../../../models/store/inventory";
import { inventoryRefTypeMap, InventoryTransactionRefTypeEnum } from "../../../constants/enum";

const InventoryTransactionPage: React.FC = () => {
  const notification = getLocationNotification();
  const {
    id,
    storeId,
    keyword,
    filter,
    reload,

    startAt,
    endAt,

    page,
    size,
    setPage,
    setSize,

    rowData,
    setRowData,

    containerRef,
    pageAction,
  } = usePageState<IProduct>();
  const [productVariantId, setProductVariantId] = useState<string | undefined>();
  const [refType, setRefType] = useState<InventoryTransactionRefTypeEnum | undefined>();
  const { currentStore, info } = useClientData();
  const [streamData, setStreamData] = useState<InventoryStreamData | undefined>();

  const { product, getProduct } = useProductData({
    isLockHook: true,
  });

  const { inventoryTransactions, loading, transactionSummary, transactionPagination } =
    useInventoryData({
      keyword,
      filter,
      reload,
      page,
      size,
      startAt,
      endAt,
      productId: id,
      productVariantId,
      storeId,
      refType,
      isLockHook: true,
    });

  useEffect(() => {
    if (!id) return;
    getProduct?.(id);
  }, [info]);

  useEffect(() => {
    if (!product) return;

    setRowData(product);
  }, [product]);

  useEffect(() => {
    connectToInventoryStream(setStreamData);
  }, []);

  useEffect(() => {
    if (!streamData || streamData.pendingVariants !== 0 || streamData.processingVariants !== 0)
      return;
    const timer = setTimeout(() => {
      pageAction.handleReload();
    }, 1000);

    return () => clearTimeout(timer);
  }, [streamData]);

  const { permissions } = useClientData();

  const showNotFound = useNotFoundGuard({
    id,
    loading,
    data: rowData,
  });

  if (showNotFound) return <NotFoundData />;

  if (!rowData) return null;

  return (
    <div className="flex flex-col h-full w-full gap-3">
      <div className="flex items-center w-full rounded-xl border shadow-sm bg-white px-6 py-4 gap-4">
        <div className="flex gap-4 items-center flex-1">
          <BackButton />
          <div className="flex gap-2 items-center">
            <ProductImage image={getMainImage(rowData?.album)} size={40} />
            <div className="flex flex-col">
              <div className="flex gap-4 items-center">
                <div className="font-semibold text-lg text-primary">{rowData?.name}</div>
                <div className="text-gray-500">ĐVT: {rowData?.unit?.name}</div>
              </div>
              <div className="text-xs text-gray-500">Mã hàng: {rowData?.code}</div>
            </div>
          </div>
        </div>
        {rowData?.hasVariant && (
          <div className="w-80 flex flex-col gap-1">
            <span className="text-xs text-primary">Mẫu mã, phân loại</span>
            <Select
              value={productVariantId}
              allowClear
              className="h-8"
              placeholder="Lọc theo phân loại"
              suffixIcon={<IconArrowDown />}
              onChange={(value) => {
                setProductVariantId(value);
              }}
              options={
                rowData?.variants?.map((variant) => ({
                  label: getFullVariantOptionContent(variant),
                  value: variant.id,
                })) || []
              }
            />
          </div>
        )}
        <div className="w-80 flex flex-col gap-1">
          <span className="text-xs text-primary">LOẠI GIAO DỊCH</span>
          <Select
            value={refType}
            allowClear
            className="h-8"
            placeholder="Tất cả"
            suffixIcon={<IconArrowDown />}
            onChange={(value) => {
              setRefType(value);
              setPage?.(1);
            }}
            options={Object.entries(inventoryRefTypeMap).map(([key, label]) => ({
              label,
              value: key,
            }))}
          />
        </div>
        {!currentStore && (
          <div className="w-80 flex flex-col gap-1">
            <span className="text-xs text-primary">CỬA HÀNG</span>
            <StoreSelect
              value={storeId}
              onChange={pageAction.handleStoreChange}
              placeholder="Lọc theo cửa hàng"
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-primary">THỜI GIAN ÁP DỤNG</span>
          <DateRangeFilter
            startDate={startAt}
            endDate={endAt}
            onRangeChange={pageAction.handleDateRangerChange}
          />
        </div>
      </div>
      <div className="flex flex-col w-full border shadow-sm bg-white px-6 py-2 rounded-lg h-[calc(100%-112px)]">
        <InventoryTransactionTable
          dataSource={inventoryTransactions}
          loading={loading}
          summaryData={transactionSummary}
          pagination={transactionPagination}
          setPage={setPage}
          setSize={setSize}
        />
      </div>
    </div>
  );
};

export default InventoryTransactionPage;
