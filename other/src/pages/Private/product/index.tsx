import { usePageState } from "../../../hooks/core/usePageState";
import ProductTable from "./components/ProductTable";
import { SearchInput } from "../../../components/input/SearchInput";
import {
  checkSelection,
  getLocationNotification,
  getVariantOptionContent,
} from "../../../utils/common";
import CustomFilter from "../../../components/filters";
import { useNavigate } from "react-router-dom";
import { privateRoutesName } from "../../../constants/routerName";
import { buildUrlWithId } from "../../../utils/paramUtils";
import { Button, Dropdown, App } from "antd";
import CustomPageTitle from "../../../layout/Private/header/components/PageTitle";
import { IProduct, IProductVariant } from "../../../models/product";
import { useProductData } from "../../../hooks/product/useProductData";
import AddModal from "./components/AddModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import DetailModal from "./components/DetailModal";
import { useEffect, useState } from "react";
import { ExcelEntityType, SortOrder } from "../../../constants/enum";
import BarcodePrintModal from "./components/BarcodePrintModal";
import { ExcelButton } from "../../../components/button/ExcelButton";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { useClientData } from "../../../hooks/core/useClientData";
import { Icon } from "@iconify/react";
import { checkModule } from "../../../utils/permissionUtils";

const Page: React.FC = () => {
  const notification = getLocationNotification();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const {
    isFilterActive,
    keyword,
    page,
    size,
    status,
    sortOrder,
    filter,
    ranger,
    reload,
    sortBy,
    setPage,
    setSize,

    containerRef,

    open,
    setOpen,
    openDetail,
    setOpenDetail,

    rowData,
    setRowData,

    pageAction,
  } = usePageState<IProduct>({
    sortBy: "createdAt",
    sortOrder: SortOrder.DESC,
    filterUses,
  });
  const { currentStore, permissions } = useClientData();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [printItems, setPrintItems] = useState<any[]>([]);
  const [openPrint, setOpenPrint] = useState(false);

  const {
    products,
    errors,
    loading,
    pagination,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteProductMany,
  } = useProductData({
    keyword,
    page,
    size,
    status: status === "all" ? undefined : status,
    sortBy,
    sortOrder,
    filter,
    ranger,
    reload,
    onCloseModal: () => {
      pageAction.handleClose(false);
    },
  });

  useEffect(() => {
    if (!openDetail || !rowData) return;

    const existingProduct = products.find((p) => p.id === rowData.id);
    if (!existingProduct) {
      setOpenDetail(false);
      setRowData(undefined);
    } else {
      setRowData(existingProduct);
    }
  }, [products]);

  useEffect(() => {
    // Loại bỏ những id trong selectedIds mà không còn tồn tại trong products
    const validIds = products.map((p) => p.id);
    const newSelectedIds = selectedIds.filter((id) => validIds.includes(id));
    if (newSelectedIds.length !== selectedIds.length) {
      setSelectedIds(newSelectedIds);
    }
  }, [products, selectedIds]);

  const handleOpenDetailPage = (record: IProduct) => {
    if ((record as any).isChild) {
      const variant = record as any as IProductVariant;
      const url = buildUrlWithId(privateRoutesName.product.detail, variant.productId);
      navigate(url);
    }
    if (record.hasVariant === true) {
      const url = buildUrlWithId(privateRoutesName.product.detail, record.id);
      navigate(url);
      return;
    }
    setOpenDetail(true);
    setRowData(record);
  };

  const handleViewReport = checkModule(permissions, "report")
    ? (record: IProduct) => {
        const url = buildUrlWithId(privateRoutesName.product.report, record.id);
        navigate(url);
      }
    : undefined;

  const handleViewInventory = checkModule(permissions, "inventoryReport")
    ? (record: IProduct) => {
        const url = buildUrlWithId(privateRoutesName.inventory.detail, record.id);
        navigate(url);
      }
    : undefined;

  const handleOpenAddModal = addProduct
    ? (hasVariant: boolean) => {
        if (hasVariant) {
          navigate(privateRoutesName.product.add);
        } else {
          setOpen(true);
        }
      }
    : undefined;

  const handleOpenUpdate = updateProduct ? handleOpenDetailPage : undefined;

  const handleDelete = deleteProduct
    ? (record: IProduct) => {
        modal.confirm({
          title: "Xóa sản phẩm",
          content: `Bạn có chắc chắn muốn xóa sản phẩm "${record.name}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteProduct(record.id);
          },
        });
      }
    : undefined;

  const handleDeleteMany = deleteProductMany
    ? (ids: string[]) => {
        modal.confirm({
          title: "Xóa sản phẩm",
          content: `Bạn có chắc chắn muốn xóa ${ids.length} sản phẩm đã chọn?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteProductMany(ids);
          },
        });
      }
    : undefined;

  const items = [
    { key: "simple", label: "Đơn giản" },
    { key: "variant", label: "Nhiều mẫu mã" },
  ];

  const handlePrintBarcode = (record: any) => {
    const isChild = record.isChild;
    const barcode = isChild ? record.barcode : record.variants?.[0]?.barcode;
    const name = record.name || "";
    const code = isChild ? record.code : record.code;
    const price = isChild ? record.price : record.variants?.[0]?.price;

    if (!barcode) {
      modal.warning({
        title: "Không thể in",
        content: "Sản phẩm này không có mã vạch.",
      });
      return;
    }

    setPrintItems([{ barcode, name, code, price }]);
    setOpenPrint(true);
  };

  const handlePrintSelectedBarcodes = () => {
    const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
    const items: any[] = [];

    selectedProducts.forEach((product) => {
      if (product.hasVariant) {
        // Nếu có variant, lấy tất cả variant đang active
        product.variants?.forEach((variant) => {
          if (variant.barcode) {
            const variantName = getVariantOptionContent(variant);
            items.push({
              barcode: variant.barcode,
              name: product.name + " - " + variantName,
              code: variant.sku || "",
              price: variant.price,
            });
          }
        });
      } else {
        // Sản phẩm đơn giản
        const barcode = product.variants?.[0]?.barcode;
        if (barcode) {
          items.push({
            barcode,
            name: product.name,
            code: product.code,
            price: product.variants?.[0]?.price,
          });
        }
      }
    });

    if (items.length === 0) {
      modal.warning({
        title: "Không thể in",
        content: "Các sản phẩm đã chọn không có mã vạch. Vui lòng kiểm tra lại.",
      });
      return;
    }

    setPrintItems(items);
    setOpenPrint(true);
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <CustomPageTitle />
        <div className="flex items-center justify-between gap-3 flex-1 flex-shrink-0">
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && handleDeleteMany && (
              <Button
                type="primary"
                danger
                onClick={() => handleDeleteMany(selectedIds)}
                className="flex items-center gap-2 h-8 px-4 font-light"
              >
                <Icon icon="ic:baseline-delete" width="18" height="18" />
                Xóa ({selectedIds.length})
              </Button>
            )}
            {selectedIds.length > 0 && (
              <Button
                type="primary"
                onClick={handlePrintSelectedBarcodes}
                className="flex items-center gap-2 h-8 px-4 font-light"
              >
                <Icon icon="ic:baseline-barcode" width="18" height="18" />
                In mã vạch ({selectedIds.length})
              </Button>
            )}
            <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
            <CustomFilter
              filterActive={isFilterActive}
              sortItems={sortItems}
              sortValue={{ sortBy, sortOrder }}
              onSortChange={pageAction.handleSortChange}
              rangerItems={rangerItems}
              rangerValue={ranger}
              onRangerChange={pageAction.handleRangerChange}
              filterUses={filterUses}
              onClearFilter={pageAction.resetFilter}
            />
          </div>
          {handleOpenAddModal && (
            <>
              <ExcelButton
                entityType={ExcelEntityType.PRODUCT}
                onSuccess={pageAction.handleReload}
                showImport={!!handleOpenAddModal}
                exportOptions={{
                  filename: "Danh_sach_san_pham",
                  filters: {
                    storeId: currentStore?.id,
                    sortBy,
                    sortOrder,
                    ...filter,
                    ...ranger,
                  },
                }}
              />
              <Dropdown
                trigger={["click"]}
                menu={{ items, onClick: ({ key }) => handleOpenAddModal(key === "variant") }}
              >
                <Button
                  type="primary"
                  className={`flex items-center gap-2 h-8 px-4 rounded font-light`}
                >
                  <PlusIcon className="h-5 w-5" />
                  Thêm mới
                </Button>
              </Dropdown>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full h-[calc(100%-36px)] bg-white py-2 px-6 rounded-lg border">
        <ProductTable
          dataSource={products}
          loading={loading}
          pagination={pagination}
          selectedIds={selectedIds}
          onSelectIdsChange={setSelectedIds}
          onPrintBarcode={handlePrintBarcode}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenUpdate}
          onDelete={handleDelete}
          onViewReport={handleViewReport}
          onViewInventory={handleViewInventory}
          onRow={(record: any) => {
            return {
              onClick: () => {
                if (record.isSummary || checkSelection()) return;
                handleOpenDetailPage(record);
              },
            };
          }}
        />
      </div>

      <AddModal
        open={open}
        errors={errors}
        onClose={pageAction.handleClose}
        loading={loading}
        onAdd={addProduct}
      />

      <DetailModal
        open={openDetail}
        editData={rowData}
        onEdit={handleOpenUpdate ? updateProduct : undefined}
        errors={errors}
        onReload={pageAction.handleReload}
        onClose={pageAction.handleClose}
      />

      <BarcodePrintModal
        open={openPrint}
        items={printItems}
        onClose={() => {
          setOpenPrint(false);
          setPrintItems([]);
        }}
      />
    </div>
  );
};

export default Page;
