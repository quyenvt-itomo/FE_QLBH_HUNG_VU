import Title from "../../../../../../components/display/Title";
import { Button, Empty, Form, message, App } from "antd";
import {
  formatMoney,
  formatPercentage,
  formatQuantity,
} from "../../../../../../utils/formatNumber";
import { useEffect } from "react";
import { usePageState } from "../../../../../../hooks/core/usePageState";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import { CheckIcon, MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DropdownAction from "../../../../../../components/dropdown/ActionMenu";
import { DiscountTypeEnum, OrderLineTypeEnum } from "../../../../../../constants/enum";
import {
  InputMoney,
  InputPercentage,
  InputQuantity,
  OrderDiscountInput,
} from "../../../../../../components/input";
import { IOrderLine } from "../../../../../../models/store/orderLine";
import { IProductVariant } from "../../../../../../models/product";
import { useSaleLineData } from "../../../../../../hooks/order/useSaleLineData";
import SquareImage from "../../../../../../components/image/SquareImage";
import { getMainImage } from "../../../../../../utils/fileUtil";
import { PartialProps } from "../../DetailPage";
import { sortData } from "../../../../../../utils/common";
import Label from "../../../../../../components/display/Label";

const ProductInfo: React.FC<PartialProps> = ({ data, itemForm, onReload, onUpdate }) => {
  const { rowData, setRowData, open, setOpen, containerRef } = usePageState<IOrderLine>();
  const { format } = useClientData();
  const itemFormValue = Form.useWatch([], itemForm);
  const { modal } = App.useApp();

  const quantity: number = Form.useWatch("quantity", itemForm) || 0;
  const unitPrice: number = Form.useWatch("unitPrice", itemForm) || 0;
  const discountValue: number = Form.useWatch("discountValue", itemForm) || 0;
  const discountType = Form.useWatch("discountType", itemForm) || false;
  const productVariant: IProductVariant | undefined = Form.useWatch("productVariant", itemForm);

  const { addSaleLine, updateSaleLine, deleteSaleLine } = useSaleLineData({
    orderId: data?.id,
    onCloseModal: () => {
      onReload?.();
      handleClose();
    },
  });

  useEffect(() => {
    if (!rowData) return;
    itemForm?.setFieldsValue(rowData);
  }, [rowData]);

  const handleOpenEditProduct = onUpdate
    ? (item: IOrderLine) => {
        setOpen(true);
        setRowData(item);
      }
    : undefined;

  const handleDeleteProduct = onUpdate
    ? (item: IOrderLine) => {
        modal.confirm({
          title: "Xóa sản phẩm",
          content: `Bạn có chắc chắn muốn xóa sản phẩm "${item.productVariantSnapshot?.product?.name}" khỏi đơn hàng?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteSaleLine?.(item.id);
          },
        });
      }
    : undefined;

  if (!data) {
    return <Empty description="Chưa có sản phẩm" className="mt-20" />;
  }

  const handleClose = () => {
    itemForm?.resetFields();
    setOpen(false);
    setRowData(undefined);
  };

  const handleFinish = async (values: IOrderLine) => {
    try {
      if (rowData) {
        updateSaleLine?.({
          ...values,
          id: rowData.id,
        });
      } else {
        addSaleLine?.(values);
      }
    } catch (error) {
      console.error("Error saving sell order item:", error);
      message.error("Đã có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100%-80px)] gap-4">
      <div className="flex justify-between">
        <Title content="Chi tiết sản phẩm" level={3} />
        <div className="flex gap-2 items-center w-[350px]">
          <Label title="Đơn bán hàng:" />
          <span className="font-medium">{data.refOrder?.code || "--"}</span>
        </div>
      </div>

      {/* ========== BẢNG HÀNG HOÀN ========== */}
      <div className="flex flex-col flex-1">
        <Title content="1. Sản phẩm hoàn" level={3} className="mb-3" />
        <div className="flex flex-col h-full border rounded-md overflow-auto z-0 bg-red-50/30">
          <div className="flex w-fit min-w-full min-h-8 !h-8 items-center bg-red-600 text-white font-semibold border-b sticky top-0 z-10">
            <span className="flex w-12 justify-center">STT</span>
            <span className="flex w-60 px-3 border-l">Sản phẩm</span>
            <span className="flex w-12 justify-center border-l">ĐVT</span>
            <span className="flex w-36 justify-center border-l">Số lượng</span>
            <span className="flex w-32 justify-center border-l">Đơn giá</span>
            <span className="flex w-36 justify-center border-l">Giảm giá/SP</span>
            <span className="flex w-36 justify-center border-l">Thành tiền</span>
            <span className="flex w-16 justify-center border-l">VAT%</span>
            <span className="flex min-w-20 flex-1 justify-center border-l h-[22px]"></span>
          </div>

          <Form
            form={itemForm}
            onFinish={handleFinish}
            className="w-fit min-w-full px-1 py-2 gap-3 flex flex-col sticky left-0"
          >
            <Form.Item name="product" hidden />
            <Form.Item name="productId" hidden />
            <Form.Item name="productVariantId" hidden />
            <Form.Item name="productVariant" hidden />
            <Form.Item name="discountValue" hidden />
            <Form.Item name="discountType" hidden />
            <Form.Item name="lineType" hidden />
            {sortData([...(data.lines || [])])
              .filter((line) => line.lineType === OrderLineTypeEnum.RETURN)
              .map((item, index) => {
                const isEditing = rowData?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className="flex items-center border rounded-lg transition-all ease-in-out h-20 bg-white"
                  >
                    <span className="flex w-11 justify-center text-sm shrink-0">{index + 1}</span>

                    <div className="flex w-60 px-3 items-center gap-2">
                      <SquareImage image={getMainImage(item.productVariant?.image)} size={56} />
                      <div className="flex flex-col w-[calc(100%-64px)]">
                        <span
                          className="font-medium truncate block"
                          title={
                            item.productVariantSnapshot?.product?.name ||
                            item.productVariant?.product?.name
                          }
                        >
                          {item.productVariantSnapshot?.product?.name ||
                            item.productVariant?.product?.name}
                        </span>
                        <div className="flex gap-2 items-center w-full">
                          <span
                            className="text-gray-400 truncate block"
                            title={
                              item?.productVariantSnapshot?.product?.code ||
                              item.productVariant?.product?.code
                            }
                          >
                            {item?.productVariantSnapshot?.product?.code ||
                              item.productVariant?.product?.code}
                          </span>
                          {!!item.productVariant?.options?.length && (
                            <span
                              className="px-2.5 py-px rounded-lg text-primary bg-primary/10 truncate block"
                              title={item.productVariant.options
                                .map((opt: any) => opt.value)
                                .join(" - ")}
                            >
                              {item.productVariant.options.map((opt: any) => opt.value).join(" - ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="flex w-12 justify-center shrink-0">
                      {item?.productVariantSnapshot?.product?.unit?.name || ""}
                    </span>

                    <div className="flex w-36 justify-end px-0.5 items-center gap-1 shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            className="h-5 w-5 bg-gray-100 rounded-full text-gray-400 flex items-center justify-center hover:text-gray-500"
                            onClick={() => {
                              const currentQty = itemForm?.getFieldValue("quantity") || 1;
                              if (currentQty > 1) {
                                itemForm?.setFieldValue("quantity", currentQty - 1);
                              }
                            }}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <Form.Item
                            name="quantity"
                            rules={[
                              { required: true, message: "Nhập SL" },
                              { type: "number", min: 1 },
                            ]}
                            noStyle
                          >
                            <InputQuantity className="!w-16 text-center" />
                          </Form.Item>
                          <button
                            type="button"
                            className="h-5 w-5 bg-primary rounded-full text-white flex items-center justify-center hover:bg-primary/90"
                            onClick={() => {
                              const currentQty = itemForm?.getFieldValue("quantity") || 0;
                              itemForm?.setFieldValue("quantity", currentQty + 1);
                            }}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <span className="px-2.5">{formatQuantity(item.quantity, format)}</span>
                      )}
                    </div>

                    <div className="flex w-32 justify-end px-0.5 pr-3 shrink-0">
                      {isEditing ? (
                        <Form.Item
                          name="unitPrice"
                          rules={[{ required: true, message: "Nhập đơn giá" }]}
                          noStyle
                        >
                          <InputMoney />
                        </Form.Item>
                      ) : (
                        formatMoney(item.unitPrice, format)
                      )}
                    </div>

                    <div className="flex w-36 justify-end px-0.5 pr-3 shrink-0">
                      {isEditing ? (
                        <OrderDiscountInput
                          discountValue={item.discountValue || 0}
                          onChange={(val, type) => {
                            itemForm?.setFieldsValue({
                              discountValue: val,
                              discountType: type,
                            });
                          }}
                        />
                      ) : item.discountType === DiscountTypeEnum.PERCENT ? (
                        formatPercentage(item.discountValue, format)
                      ) : (
                        formatMoney(item.discountValue, format)
                      )}
                    </div>

                    <span className="flex w-36 justify-end px-3 text-sm font-medium text-red-600 shrink-0">
                      -
                      {formatMoney(
                        (() => {
                          const data = isEditing ? itemFormValue : item;
                          const quantity = data?.quantity || 0;
                          const price = data?.unitPrice || 0;
                          const discount = data?.discountValue || 0;
                          const isPercent = data?.discountType === DiscountTypeEnum.PERCENT;
                          const discountAmount = isPercent ? (price * discount) / 100 : discount;
                          const total = quantity * (price - discountAmount);
                          return total;
                        })(),
                        format,
                      )}
                    </span>

                    <div className="flex w-16 justify-center px-0.5 shrink-0">
                      {isEditing ? (
                        <Form.Item
                          name="taxRate"
                          rules={[{ required: true, message: "Nhập VAT" }]}
                          noStyle
                        >
                          <InputPercentage placeholder="VAT" />
                        </Form.Item>
                      ) : (
                        <span className="px-2.5">{formatPercentage(item.taxRate, format)}</span>
                      )}
                    </div>

                    <div className="flex min-w-[76px] flex-1 justify-end shrink-0 px-0.5 sticky right-0 bg-gradient-to-l from-white via-white to-transparent">
                      {isEditing ? (
                        <>
                          <Button
                            type="text"
                            htmlType="submit"
                            className="h-8 w-8 p-0 text-gray-400 hover:!text-green-500"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </Button>
                          <Button
                            type="text"
                            htmlType="button"
                            className="h-8 w-8 p-0 text-gray-400 hover:!text-red-500"
                            onClick={handleClose}
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </Button>
                        </>
                      ) : open ? (
                        <></>
                      ) : (
                        <DropdownAction
                          onEdit={
                            handleOpenEditProduct ? () => handleOpenEditProduct(item) : undefined
                          }
                          onDelete={
                            handleDeleteProduct ? () => handleDeleteProduct(item) : undefined
                          }
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </Form>
        </div>
      </div>

      {/* ========== BẢNG HÀNG ĐỔI MỚI ========== */}
      <div className="flex flex-col flex-1">
        <Title content="2. Hàng đổi mới" level={3} className="mb-3" />
        <div className="flex flex-col h-full border rounded-md overflow-auto z-0 bg-blue-50/30">
          <div className="flex w-fit min-w-full min-h-8 !h-8 items-center bg-primary text-white font-semibold border-b sticky top-0 z-10">
            <span className="flex w-12 justify-center">STT</span>
            <span className="flex w-60 px-3 border-l">Sản phẩm</span>
            <span className="flex w-12 justify-center border-l">ĐVT</span>
            <span className="flex w-36 justify-center border-l">Số lượng</span>
            <span className="flex w-32 justify-center border-l">Đơn giá</span>
            <span className="flex w-36 justify-center border-l">Giảm giá/SP</span>
            <span className="flex w-36 justify-center border-l">Thành tiền</span>
            <span className="flex w-16 justify-center border-l">VAT%</span>
            <span className="flex min-w-20 flex-1 justify-center border-l h-[22px]"></span>
          </div>
          <Form
            form={itemForm}
            onFinish={handleFinish}
            className="w-fit min-w-full px-1 py-2 gap-3 flex flex-col sticky left-0"
          >
            <Form.Item name="product" hidden />
            <Form.Item name="productId" hidden />
            <Form.Item name="productVariantId" hidden />
            <Form.Item name="productVariant" hidden />
            <Form.Item name="discountValue" hidden />
            <Form.Item name="discountType" hidden />
            <Form.Item name="lineType" hidden />
            {sortData([...(data.lines || [])])
              .filter((line) => line.lineType === OrderLineTypeEnum.NORMAL)
              .map((item, index) => {
                const isEditing = rowData?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className="flex items-center border rounded-lg transition-all ease-in-out h-20 bg-white"
                  >
                    <span className="flex w-11 justify-center text-sm shrink-0">{index + 1}</span>

                    <div className="flex w-60 px-3 items-center gap-2">
                      <SquareImage image={getMainImage(item.productVariant?.image)} size={56} />
                      <div className="flex flex-col w-[calc(100%-64px)]">
                        <span
                          className="font-medium truncate block"
                          title={
                            item.productVariantSnapshot?.product?.name ||
                            item.productVariant?.product?.name
                          }
                        >
                          {item.productVariantSnapshot?.product?.name ||
                            item.productVariant?.product?.name}
                        </span>
                        <div className="flex gap-2 items-center w-full">
                          <span
                            className="text-gray-400 truncate block"
                            title={
                              item?.productVariantSnapshot?.product?.code ||
                              item.productVariant?.product?.code
                            }
                          >
                            {item?.productVariantSnapshot?.product?.code ||
                              item.productVariant?.product?.code}
                          </span>
                          {!!item.productVariant?.options?.length && (
                            <span
                              className="px-2.5 py-px rounded-lg text-primary bg-primary/10 truncate block"
                              title={item.productVariant.options
                                .map((opt: any) => opt.value)
                                .join(" - ")}
                            >
                              {item.productVariant.options.map((opt: any) => opt.value).join(" - ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="flex w-12 justify-center shrink-0">
                      {item?.productVariantSnapshot?.product?.unit?.name || ""}
                    </span>

                    <div className="flex w-36 justify-end px-0.5 items-center gap-1 shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            className="h-5 w-5 bg-gray-100 rounded-full text-gray-400 flex items-center justify-center hover:text-gray-500"
                            onClick={() => {
                              const currentQty = itemForm?.getFieldValue("quantity") || 1;
                              if (currentQty > 1) {
                                itemForm?.setFieldValue("quantity", currentQty - 1);
                              }
                            }}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <Form.Item
                            name="quantity"
                            rules={[
                              { required: true, message: "Nhập SL" },
                              { type: "number", min: 1 },
                            ]}
                            noStyle
                          >
                            <InputQuantity className="!w-16 text-center" />
                          </Form.Item>
                          <button
                            type="button"
                            className="h-5 w-5 bg-primary rounded-full text-white flex items-center justify-center hover:bg-primary/90"
                            onClick={() => {
                              const currentQty = itemForm?.getFieldValue("quantity") || 0;
                              itemForm?.setFieldValue("quantity", currentQty + 1);
                            }}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <span className="px-2.5">{formatQuantity(item.quantity, format)}</span>
                      )}
                    </div>

                    <div className="flex w-32 justify-end px-0.5 pr-3 shrink-0">
                      {isEditing ? (
                        <Form.Item
                          name="unitPrice"
                          rules={[{ required: true, message: "Nhập đơn giá" }]}
                          noStyle
                        >
                          <InputMoney />
                        </Form.Item>
                      ) : (
                        formatMoney(item.unitPrice, format)
                      )}
                    </div>

                    <div className="flex w-36 justify-end px-0.5 pr-3 shrink-0">
                      {isEditing ? (
                        <OrderDiscountInput
                          discountValue={item.discountValue || 0}
                          onChange={(val, type) => {
                            itemForm?.setFieldsValue({
                              discountValue: val,
                              discountType: type,
                            });
                          }}
                        />
                      ) : item.discountType === DiscountTypeEnum.PERCENT ? (
                        formatPercentage(item.discountValue, format)
                      ) : (
                        formatMoney(item.discountValue, format)
                      )}
                    </div>

                    <span className="flex w-36 justify-end px-3 text-sm font-medium text-blue-600 shrink-0">
                      {formatMoney(
                        (() => {
                          const data = isEditing ? itemFormValue : item;
                          const quantity = data?.quantity || 0;
                          const price = data?.unitPrice || 0;
                          const discount = data?.discountValue || 0;
                          const isPercent = data?.discountType === DiscountTypeEnum.PERCENT;
                          const discountAmount = isPercent ? (price * discount) / 100 : discount;
                          const total = quantity * (price - discountAmount);
                          return total;
                        })(),
                        format,
                      )}
                    </span>

                    <div className="flex w-16 justify-center px-0.5 shrink-0">
                      {isEditing ? (
                        <Form.Item
                          name="taxRate"
                          rules={[{ required: true, message: "Nhập VAT" }]}
                          noStyle
                        >
                          <InputPercentage placeholder="VAT" />
                        </Form.Item>
                      ) : (
                        <span className="px-2.5">{formatPercentage(item.taxRate, format)}</span>
                      )}
                    </div>

                    <div className="flex min-w-[76px] flex-1 justify-end shrink-0 px-0.5 sticky right-0 bg-gradient-to-l from-white via-white to-transparent">
                      {isEditing ? (
                        <>
                          <Button
                            type="text"
                            htmlType="submit"
                            className="h-8 w-8 p-0 text-gray-400 hover:!text-green-500"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </Button>
                          <Button
                            type="text"
                            htmlType="button"
                            className="h-8 w-8 p-0 text-gray-400 hover:!text-red-500"
                            onClick={handleClose}
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </Button>
                        </>
                      ) : open ? (
                        <></>
                      ) : (
                        <DropdownAction
                          onEdit={
                            handleOpenEditProduct ? () => handleOpenEditProduct(item) : undefined
                          }
                          onDelete={
                            handleDeleteProduct ? () => handleDeleteProduct(item) : undefined
                          }
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
