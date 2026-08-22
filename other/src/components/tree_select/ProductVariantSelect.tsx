import { TreeSelect } from "antd";
import { useEffect, useMemo, useState } from "react";
import useDebounce from "../../hooks/core/useDebounce";
import { useProductData } from "../../hooks/product/useProductData";
import { MultipleSelectProps } from "../../models/base/select";
import { IProduct, IProductVariant } from "../../models/product";
import ProductImage from "../image/ProductImage";
import { getMainImage } from "../../utils/fileUtil";
import { IconArrowDown } from "../icon/ArrowDown";
import { getFullVariantOptionContent } from "../../utils/common";
import { formatMoney, formatQuantity } from "../../utils/formatNumber";
import ManagerButton from "../add_select/AddButton";
import AddModal from "../../pages/Private/product/components/AddModal";
import { SortOrderEnum } from "../../constants/enum";

function buildTreeFromProducts(
  products: IProduct[],
  onlyActiveVariant?: boolean,
  showPrice?: {
    costPrice?: boolean;
    price?: boolean;
  },
) {
  const formatData = [];

  for (const p of products) {
    if (!p.hasVariant && p.variants?.length === 1) {
      const variant = p.variants[0];

      // if (onlyActiveVariant) {
      //   continue;
      // }

      formatData.push({
        key: variant.id,
        value: variant.id,
        selectable: true,
        title: (
          <div className="flex w-full items-center justify-between">
            <div className="flex gap-2 items-center py-1 min-w-96">
              <ProductImage image={getMainImage(p.album)} size={32} preview={false} />
              <div className="flex flex-col">
                <div className="h-4 flex items-center">{p.name}</div>
                <div className="h-3 flex items-center text-gray-500 text-[10px]">{`${p.code} - Tồn kho: ${formatQuantity(p.totalStockQty) || "0"}`}</div>
              </div>
            </div>
            <div className="flex text-xs">
              {showPrice?.costPrice ? (
                <span className="w-36 text-red-500">Giá vốn: {formatMoney(variant.costPrice)}</span>
              ) : null}
              {showPrice?.price ? (
                <span className="w-36 text-blue-500">Giá bán: {formatMoney(variant.price)}</span>
              ) : null}
            </div>
          </div>
        ),
      });
    } else {
      const childrenVariants = [];

      for (const item of p.variants) {
        // if (onlyActiveVariant) {
        //   continue;
        // }

        childrenVariants.push({
          ...item,
          key: item.id,
          value: item.id,
          title: (
            <div className="flex w-full items-center justify-between">
              <div className="flex gap-2 items-center py-1 min-w-96">
                <ProductImage image={getMainImage(item.image)} size={20} preview={false} />
                <span className="block w-80 truncate">{getFullVariantOptionContent(item)}</span>
                <span className="text-xs text-gray-400">
                  Tồn kho: {formatQuantity(item.stockQty) || "0"}
                </span>
              </div>

              <div className="flex">
                {showPrice?.costPrice ? (
                  <span className="w-36">Giá vốn: {formatMoney(item.costPrice)}</span>
                ) : null}
                {showPrice?.price ? (
                  <span className="w-36">Giá bán: {formatMoney(item.price)}</span>
                ) : null}
              </div>
            </div>
          ),
        });
      }

      if (childrenVariants.length > 0) {
        formatData.push({
          key: p.id,
          value: p.id,
          selectable: false,
          title: (
            <div className="flex gap-2 items-center py-1 min-w-96">
              <ProductImage image={getMainImage(p.album)} size={28} preview={false} />
              <div className="flex flex-col">
                <div className="h-4 flex items-center">{p.name}</div>
                <div className="h-3 flex items-center text-gray-500 text-[10px]">{`${p.code} - Tồn kho: ${formatQuantity(p.totalStockQty) || "0"}`}</div>
              </div>
            </div>
          ),
          children: childrenVariants,
        });
      }
    }
  }

  return formatData;
}

function collectVariants(products: IProduct[]) {
  const variants: IProductVariant[] = [];

  products.forEach((product) => {
    product.variants?.forEach((variant) => {
      variants.push({
        ...variant,
        product,
      });
    });
  });
  return variants;
}

interface Props extends MultipleSelectProps<IProductVariant> {
  onlyActiveVariant?: boolean;
  showCostPrice?: boolean;
  showPrice?: boolean;
  storeId?: string;
}

const ProductVariantSelect: React.FC<Props> = ({
  value,
  hideOptions,
  className,
  placeholder,
  suffixIcon,
  onlyActiveVariant,
  offsetAt,
  disabled,
  showCostPrice,
  showPrice,
  storeId,
  onChange,
  onChangeData,
  onFocus,
}) => {
  const [listProduct, setListProduct] = useState<IProduct[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const keyword = useDebounce(keywordTemp, 300, () => setPage(1));

  const { products, newProduct, loading, pagination, errors, addProduct } = useProductData({
    isLockHook,
    keyword,
    page,
    size: 10,
    offsetAt,
    sortBy: "totalStockQty",
    sortOrder: SortOrderEnum.DESC,
    storeId,
    onCloseModal: () => {
      setOpenModal(false);
      setIsLockHook(false);
      setPage(1);
      setKeywordTemp("");
    },
  });

  const variants = collectVariants(listProduct);

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setListProduct(products);
      return;
    }

    setListProduct((prevList) => {
      const newIds = new Set(products.map((item) => item.id));
      const filteredPrev = prevList.filter((item) => !newIds.has(item.id));
      return [...filteredPrev, ...products];
    });
  }, [products, pagination]);

  useEffect(() => {
    setPage(1);
  }, [offsetAt]);

  useEffect(() => {
    if (!newProduct?.variants?.[0]?.id || !open) return;
    onChange?.([newProduct.variants[0].id]);
    onChangeData?.([newProduct.variants[0]]);
  }, [newProduct]);

  const treeData = useMemo(() => {
    const tree = buildTreeFromProducts(listProduct, onlyActiveVariant, {
      costPrice: showCostPrice,
      price: showPrice,
    });

    if (!hideOptions || hideOptions.length === 0) return tree;

    const hiddenVariantIds = new Set(hideOptions.map((item) => item.id));

    return tree.filter((node: any) => {
      /**
       * CASE 1: Node selectable tầng 1 (product KHÔNG có phân loại)
       * value chính là variantId
       */
      if (!node.children) {
        return !hiddenVariantIds.has(node.value);
      }

      /**
       * CASE 2: Product có phân loại
       * → lọc children theo variantId
       */
      node.children = node.children.filter((child: any) => !hiddenVariantIds.has(child.value));

      // Nếu product không còn variant nào → bỏ luôn
      return node.children.length > 0;
    });
  }, [listProduct, hideOptions, onlyActiveVariant]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listProduct.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (id: string[]) => {
    onChange?.(id);
    console.log({ id, variants });

    const selectedVariants = variants.filter((item) => id.includes(item.id));
    onChangeData?.(selectedVariants);
  };

  return (
    <div className="flex w-full max-w-xl z-0">
      <TreeSelect
        open={open}
        multiple
        onDropdownVisibleChange={(open) => setOpen(open)}
        disabled={disabled}
        value={value}
        treeData={treeData}
        loading={loading}
        placeholder={placeholder || "Chọn hàng hóa"}
        suffixIcon={suffixIcon === undefined ? <IconArrowDown /> : suffixIcon}
        allowClear
        showSearch
        treeDefaultExpandAll
        className={`${addProduct ? "w-[calc(100%-36px)] rounded-e-none" : "w-full"} z-10 h-8 ${className || ""}`}
        filterTreeNode={false}
        // dropdownStyle={{
        //   minWidth: "max-content",
        //   width: "max-content",
        // }}
        popupMatchSelectWidth={false}
        onSearch={setKeywordTemp}
        onChange={handleChange}
        onPopupScroll={handleScroll}
        onFocus={(e) => {
          setIsLockHook(false);

          onFocus?.(e);
        }}
      />
      {addProduct && (
        <>
          <ManagerButton onClick={() => setOpenModal(true)} disabled={disabled} />
          <AddModal
            loading={loading}
            open={openModal}
            errors={errors}
            onClose={() => setOpenModal(false)}
            onAdd={addProduct}
          />
        </>
      )}
    </div>
  );
};

export default ProductVariantSelect;
