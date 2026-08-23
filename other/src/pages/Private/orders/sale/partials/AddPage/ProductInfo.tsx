import Title from "../../../../../../components/display/Title";
import { PartialProps } from "../../AddPage";
import { Button, Empty, Form, message } from "antd";
import { PlusIcon, TrashIcon, MinusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { formatMoney } from "../../../../../../utils/formatNumber";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import {
  InputMoney,
  InputPercentage,
  InputQuantity,
  OrderDiscountInput,
} from "../../../../../../components/input";
import {
  collectProductVariantFromLines,
  getProductVariantByBarcode,
  getVariantOptionContent,
} from "../../../../../../utils/common";
import { DiscountTypeEnum } from "../../../../../../constants/enum";
import { IProductVariant } from "../../../../../../models/product";
import ProductVariantSelect from "../../../../../../components/tree_select/ProductVariantSelect";
import SquareImage from "../../../../../../components/image/SquareImage";
import { getMainImage } from "../../../../../../utils/fileUtil";
import { useEffect, useRef, useState } from "react";
import { checkModule } from "../../../../../../utils/permissionUtils";
import { Icon } from "@iconify/react";
import { IOrderLine } from "../../../../../../models/store/orderLine";
import { productVariant } from "../../../../../../constants/translate/error/product";
import { useBarcodeScanner } from "../../../../../../hooks/core/useBarcodeScanner";

const ProductInfo: React.FC<PartialProps> = ({ form, onFormChange }) => {
  const { format, permissions } = useClientData();
  const [defaultProductVariant, setDefaultProductVariant] = useState<IProductVariant | undefined>(
    undefined,
  );
  const lines = Form.useWatch("lines", form) || [];
  const totalQuantity = lines.reduce((total, line) => total + (line.quantity || 0), 0);

  const handleBarcodeSubmit = async (barcode: string) => {
    if (!barcode) return;
    if (!checkModule(permissions, "product")) {
      message.error(
        "Bạn không có quyền xem sản phẩm, vui lòng liên hệ quản trị viên để được cấp quyền.",
      );
      return;
    }

    const variant = await getProductVariantByBarcode(barcode.trim());
    if (!variant) {
      // TODO: notify không tìm thấy
      message.error("Không tìm thấy hàng hóa");
      return;
    }

    handleAddProductVariant(variant);
  };

  useBarcodeScanner({
    enabled: true,
    onScan: handleBarcodeSubmit,
  });

  useEffect(() => {
    if (!defaultProductVariant) return;
    setDefaultProductVariant(undefined);
  }, [defaultProductVariant]);

  const handleAddProductVariant = (data: IProductVariant) => {
    const currentLines: IOrderLine[] = form.getFieldValue("lines") || [];

    // Kiểm tra nếu đã có variant trong danh sách thì tăng số lượng lên 1
    const existingIndex = currentLines.findIndex((line) => line.productVariantId === data.id);
    if (existingIndex !== -1) {
      const existingLine = currentLines[existingIndex];
      const updatedLine = {
        ...existingLine,
        productVariant: data,
        productVariantId: data.id,
        quantity: (existingLine.quantity || 0) + 1,
      };
      const updatedLines = [...currentLines];
      updatedLines[existingIndex] = updatedLine;
      form.setFieldValue("lines", updatedLines);
      onFormChange?.();
      return;
    }

    const newLine = {
      productVariant: data,
      productVariantId: data?.id,
      quantity: 1,
      unitPrice: data?.price,
      taxRate: data?.product?.taxRate,
    };

    const updatedLines = [...currentLines, newLine];
    form.setFieldValue("lines", updatedLines);
    onFormChange?.();
  };

  return (
    <Form.List name="lines">
      {(fields, { add, remove }) => {
        return (
          <div className="flex flex-col gap-4 h-[calc(100%-80px)]">
            <div className="flex gap-4">
              <Title content="Sản phẩm" level={3} />
              <div className="w-[calc(100%-250px)] relative">
                <ProductVariantSelect
                  onlyActiveVariant
                  showPrice
                  value={defaultProductVariant?.id ? [defaultProductVariant.id] : undefined}
                  defaultData={defaultProductVariant ? [defaultProductVariant] : undefined}
                  onChangeData={(values) => {
                    const data = values && values.length > 0 ? values[0] : undefined;
                    setDefaultProductVariant(data);
                    if (!data) return;
                    handleAddProductVariant(data);
                  }}
                  suffixIcon={false}
                  className="search-select"
                  placeholder="Tìm kiếm và chọn hàng hóa để thêm vào phiếu"
                />
                <MagnifyingGlassIcon className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 text-[#747E76]" />
                {/* Nút cho phép quét barcode */}
              </div>
            </div>
            <div className="flex flex-col h-[calc(100%-60px)] border rounded-md overflow-auto z-0">
              <div className="flex w-fit min-w-full min-h-8 !h-8 items-center bg-primary text-white font-semibold border-b sticky top-0 z-10">
                <span className="flex w-12 justify-center">STT</span>
                <span className="flex min-w-60 flex-1 px-3 border-l">Sản phẩm</span>
                <span className="flex w-20 justify-center border-l">ĐVT</span>
                <span className="flex w-36 justify-center border-l">Số lượng</span>
                <span className="flex w-32 justify-center border-l">Đơn giá</span>
                <span className="flex w-36 justify-center border-l">Giảm giá/SP</span>
                <span className="flex w-32 justify-center border-l">Thành tiền</span>
                <span className="flex w-20 justify-center border-l">VAT%</span>
                <span className="flex w-12 h-[22px] px-3 border-l" />
              </div>
              <div className="w-fit min-w-full px-1 py-2 gap-3 flex flex-col sticky left-0">
                {fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        "Chưa có sản phẩm nào. Tìm kiếm, chọn sản phẩm và kho xuất ở trên."
                      }
                    />
                  </div>
                ) : (
                  fields.map((field, index) => {
                    const item = lines?.[index];
                    if (!item) return null;

                    const hasVariant =
                      !!item.productVariant?.product?.hasVariant ||
                      !!item.productVariant?.options?.length;
                    const isOverQuantity =
                      item.quantity && item.quantity > (item.productVariant?.stockQty || 0);
                    return (
                      <div
                        key={field.key}
                        className="flex items-center border rounded-lg transition-all ease-in-out h-20"
                      >
                        <span className="flex w-11 justify-center text-sm shrink-0">
                          {index + 1}
                        </span>

                        <div className="flex min-w-60 flex-1 px-3 items-center gap-2">
                          <SquareImage image={getMainImage(item.productVariant?.image)} size={56} />
                          <div className="flex flex-col w-[calc(100%-64px)]">
                            <span
                              className="font-medium truncate block"
                              title={item.productVariant?.product?.name}
                            >
                              {item.productVariant?.product?.name}
                            </span>
                            <div className="flex gap-2 items-center w-full">
                              <span
                                className="text-gray-400 truncate block"
                                title={item.productVariant?.product?.code}
                              >
                                {item.productVariant?.product?.code}
                              </span>
                              {hasVariant && (
                                <span
                                  className="px-2.5 py-px rounded-lg text-primary bg-primary/10 truncate block"
                                  title={getVariantOptionContent(item.productVariant)}
                                >
                                  {getVariantOptionContent(item.productVariant)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* hidden field */}
                        <Form.Item name={[field.name, "productVariant"]} hidden />
                        <Form.Item name={[field.name, "productVariantId"]} hidden />

                        <span className="flex w-20 justify-center shrink-0">
                          {item?.productVariant?.product?.unit?.name}
                        </span>

                        <div className="flex w-36 justify-center px-0.5 items-center gap-1 shrink-0 relative">
                          <button
                            type="button"
                            className="
                          h-5 w-5 p-0 bg-gray-100 rounded-full text-gray-400 flex items-center justify-center
                          hover:text-gray-500 transition-colors ease-in-out"
                            onClick={() => {
                              const currentQty = item?.quantity || 0;
                              if (currentQty > 1) {
                                const currentItems = form.getFieldValue("lines") || [];
                                if (currentItems[index]) {
                                  currentItems[index].quantity = currentQty - 1;
                                  form.setFieldValue("lines", [...currentItems]);
                                  onFormChange?.();
                                }
                              } else {
                                remove(field.name);
                              }
                            }}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>

                          <Form.Item
                            name={[field.name, "quantity"]}
                            rules={[
                              {
                                required: true,
                                message: "Nhập SL",
                              },
                              // {
                              //   validator: (_, value) => {
                              //     if (value === undefined || value === null) {
                              //       return Promise.reject("Nhập SL");
                              //     }
                              //     if (value <= 0) {
                              //       return Promise.reject("SL phải lớn hơn 0");
                              //     }
                              //     // if (isOverQuantity) {
                              //     //   return Promise.reject("Tồn kho không đủ");
                              //     // }
                              //     // return Promise.resolve();
                              //   },
                              // },
                            ]}
                            noStyle
                          >
                            <InputQuantity className="!w-20" />
                          </Form.Item>

                          <button
                            type="button"
                            className="
                            h-5 w-5 p-0 bg-primary/90 rounded-full text-white flex items-center justify-center
                            hover:bg-primary transition-colors ease-in-out"
                            onClick={() => {
                              const currentQty = item?.quantity || 0;
                              const currentItems = form.getFieldValue("lines") || [];
                              if (currentItems[index]) {
                                currentItems[index].quantity = currentQty + 1;
                                form.setFieldValue("lines", [...currentItems]);
                                onFormChange?.();
                              }
                            }}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>

                          {!!isOverQuantity && (
                            <span
                              className="absolute -bottom-5 w-full text-center text-xs text-red-500"
                              title={`Tồn kho hiện tại: ${item.productVariant?.stockQty || 0}`}
                            >
                              Tồn hiện tại {item.productVariant?.stockQty || 0}
                            </span>
                          )}
                        </div>

                        <div className="flex w-32 justify-center px-0.5 shrink-0">
                          <Form.Item name={[field.name, "unitPrice"]} noStyle>
                            <InputMoney />
                          </Form.Item>
                        </div>

                        <div className="flex w-36 justify-center px-0.5 shrink-0">
                          <OrderDiscountInput
                            discountValue={item?.discountValue}
                            discountType={item?.discountType}
                            onChange={(val, type) => {
                              const currentItems = form.getFieldValue("lines") || [];
                              if (currentItems[index]) {
                                currentItems[index].discountValue = Number(val || 0);
                                currentItems[index].discountType = type;
                                form.setFieldValue("lines", [...currentItems]);
                                onFormChange?.();
                              }
                            }}
                          />
                        </div>

                        <span className="flex w-32 justify-end px-3 text-sm font-medium text-primary shrink-0">
                          {formatMoney(
                            (() => {
                              const quantity = item?.quantity || 0;
                              const price = item?.unitPrice || 0;
                              const discount = item?.discountValue || 0;
                              const isPercent = item?.discountType === DiscountTypeEnum.PERCENT;

                              // tính discount theo % hoặc tiền
                              const discountAmount = isPercent
                                ? (price * discount) / 100
                                : discount;

                              // tổng trước VAT
                              const total = quantity * (price - discountAmount);

                              return total;
                            })(),
                            format,
                          )}
                        </span>

                        <div className="flex w-20 justify-center px-0.5 shrink-0">
                          <Form.Item name={[field.name, "taxRate"]} noStyle>
                            <InputPercentage placeholder="%VAT" />
                          </Form.Item>
                        </div>

                        <div className="flex w-11 justify-center shrink-0  sticky right-0 bg-gradient-to-l from-white via-white to-transparent">
                          <Button
                            type="text"
                            htmlType="button"
                            className="h-8 w-8 p-0 text-gray-400 hover:!text-red-500"
                            onClick={() => {
                              remove(field.name);
                            }}
                            icon={<TrashIcon className="h-4 w-4" />}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <span className="text-sm font-medium">
                Tổng số lượng: <span className="text-primary">{totalQuantity}</span>
              </span>
            </div>
          </div>
        );
      }}
    </Form.List>
  );
};

export default ProductInfo;
