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
import { DiscountTypeEnum } from "../../../../../../constants/enum";
import {
  InputMoney,
  InputPercentage,
  InputQuantity,
  OrderDiscountInput,
} from "../../../../../../components/input";
import { IOrderLine } from "../../../../../../models/store/orderLine";
import { IProductVariant } from "../../../../../../models/product";
import SquareImage from "../../../../../../components/image/SquareImage";
import { getMainImage } from "../../../../../../utils/fileUtil";
import { sortData } from "../../../../../../utils/common";
import { PartialProps } from "../../DetailPage";
import { usePurchaseReturnLineData } from "../../../../../../hooks/order/usePurchaseReturnLineData";
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

  const { addPurchaseReturnLine, updatePurchaseReturnLine, deletePurchaseReturnLine } =
    usePurchaseReturnLineData({
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
            deletePurchaseReturnLine?.(item.id);
          },
        });
      }
    : undefined;

  const handleClose = () => {
    itemForm?.resetFields();
    setOpen(false);
    setRowData(undefined);
  };

  if (!data) {
    return <Empty description="Chưa có sản phẩm" className="mt-20" />;
  }

  const handleFinish = async (values: IOrderLine) => {
    try {
      if (rowData) {
        updatePurchaseReturnLine?.({
          ...values,
          id: rowData.id,
        });
      } else {
        addPurchaseReturnLine?.(values);
      }
    } catch (error) {
      console.error("Error saving sell order item:", error);
      message.error("Đã có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100%-80px)]">
      <div className="flex justify-between">
        <Title content="Sản phẩm" level={3} />
        <div className="flex gap-2 items-center w-[350px]">
          <Label title="Đơn nhập hàng:" />
          <span className="font-medium">{data.refOrder?.code || "--"}</span>
        </div>
      </div>

      {/* Bảng chi tiết đơn hàng */}
      <div className="flex flex-col h-[calc(100%-40px)] border rounded-md overflow-auto z-0 mt-4">
        <div className="flex w-fit min-w-full min-h-8 !h-8 items-center bg-primary text-white font-semibold border-b sticky top-0 z-10">
          <span className="flex w-12 justify-center">STT</span>
          <span className="flex w-60 px-3 border-l">Sản phẩm</span>
          <span className="flex w-20 justify-center border-l">ĐVT</span>
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
          {sortData([...(data.lines || [])])?.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center border rounded-lg transition-all ease-in-out h-20"
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
                    {!!item?.productVariant?.options?.length && (
                      <span
                        className="px-2.5 py-px rounded-lg text-primary bg-primary/10 truncate block"
                        title={item.productVariant.options.map((opt: any) => opt.value).join(" - ")}
                      >
                        {item.productVariant.options.map((opt: any) => opt.value).join(" - ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="flex w-20 justify-center shrink-0">
                {item.productVariantSnapshot?.product?.unit?.name || ""}
              </span>

              <div className="flex w-36 justify-end px-0.5 items-center gap-1 shrink-0">
                {rowData?.id === item.id ? (
                  <>
                    <button
                      type="button"
                      className="h-5 w-5 bg-gray-100 rounded-full text-gray-400 flex items-center justify-center
                                            hover:text-gray-500"
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
                        {
                          required: true,
                          message: "Nhập SL",
                        },
                        { type: "number", min: 1 },
                      ]}
                      noStyle
                    >
                      <InputQuantity className="!w-16 text-center" />
                    </Form.Item>

                    <button
                      type="button"
                      className="h-5 w-5 bg-primary rounded-full text-white flex items-center justify-center
                                            hover:bg-primary/90"
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
                {rowData?.id === item.id ? (
                  <Form.Item
                    name="unitPrice"
                    rules={[
                      {
                        required: true,
                        message: "Nhập đơn giá",
                      },
                    ]}
                    noStyle
                  >
                    <InputMoney />
                  </Form.Item>
                ) : (
                  formatMoney(item.unitPrice, format)
                )}
              </div>

              <div className="flex w-36 justify-end px-0.5 pr-3 shrink-0">
                {rowData?.id === item.id ? (
                  <OrderDiscountInput
                    discountValue={item.discountValue}
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

              <span className="flex w-36 justify-end px-3 text-sm font-medium text-primary shrink-0">
                {formatMoney(
                  (() => {
                    const data = rowData?.id === item.id ? itemFormValue : item;
                    const quantity = data?.quantity || 0;
                    const price = data?.unitPrice || 0;
                    const discount = data?.discountValue || 0;
                    const isPercent = data?.discountType === DiscountTypeEnum.PERCENT;

                    // tính discount theo % hoặc tiền
                    const discountAmount = isPercent ? (price * discount) / 100 : discount;

                    // tổng trước VAT
                    const total = quantity * (price - discountAmount);

                    return total;
                  })(),
                  format,
                )}
              </span>

              <div className="flex w-16 justify-center px-0.5 shrink-0">
                <span className="px-2.5">{formatPercentage(item.taxRate, format)}</span>
              </div>

              <div className="flex min-w-[76px] flex-1 justify-end shrink-0 px-0.5">
                {rowData?.id === item.id ? (
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
                  <>
                    <DropdownAction
                      onEdit={handleOpenEditProduct ? () => handleOpenEditProduct(item) : undefined}
                      onDelete={handleDeleteProduct ? () => handleDeleteProduct(item) : undefined}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
          {open && !rowData && (
            <div className="flex items-center border rounded-lg transition-all ease-in-out h-20">
              <span className="flex w-11 justify-center text-sm shrink-0">
                {(data.lines?.length || 0) + 1}
              </span>
              <div className="flex min-w-60 flex-1 px-3 items-center gap-2">
                {/* <SquareImage image={getMainImage(productVariant?.image)} size={56} /> */}
                <div className="flex flex-col w-[calc(100%-64px)]">
                  <span
                    className="font-medium truncate block"
                    title={productVariant?.product?.name}
                  >
                    {productVariant?.product?.name}
                  </span>
                  <div className="flex gap-2 items-center w-full">
                    <span
                      className="text-gray-400 truncate block"
                      title={productVariant?.product?.code}
                    >
                      {productVariant?.product?.code}
                    </span>
                    {productVariant?.options && (
                      <span
                        className="px-2.5 py-px rounded-lg text-primary bg-primary/10 truncate block"
                        title={productVariant.options.map((opt) => opt.value).join(" - ")}
                      >
                        {productVariant.options.map((opt) => opt.value).join(" - ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="flex w-12 justify-center shrink-0">
                {productVariant?.product?.unit?.name}
              </span>
              <div className="flex w-36 justify-end px-0.5 items-center gap-1 shrink-0">
                <button
                  type="button"
                  className="h-5 w-5 bg-gray-100 rounded-full text-gray-400 flex items-center justify-center
                            hover:text-gray-500"
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
                    {
                      required: true,
                      message: "Nhập SL",
                    },
                    { type: "number", min: 1 },
                  ]}
                  noStyle
                >
                  <InputQuantity className="!w-16 text-center" />
                </Form.Item>

                <button
                  type="button"
                  className="h-5 w-5 bg-primary rounded-full text-white flex items-center justify-center
                                            hover:bg-primary/90"
                  onClick={() => {
                    const currentQty = itemForm?.getFieldValue("quantity") || 0;

                    itemForm?.setFieldValue("quantity", currentQty + 1);
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex w-32 justify-end px-0.5 pr-3 shrink-0">
                <Form.Item
                  name="unitPrice"
                  rules={[
                    {
                      required: true,
                      message: "Nhập đơn giá",
                    },
                  ]}
                  noStyle
                >
                  <InputMoney />
                </Form.Item>
              </div>
              <div className="flex w-36 justify-end px-0.5 pr-3 shrink-0">
                <OrderDiscountInput
                  discountValue={discountValue}
                  onChange={(val, type) => {
                    itemForm?.setFieldsValue({
                      discountValue: val,
                      discountType: type,
                    });
                  }}
                />
              </div>
              <span className="flex w-36 justify-end px-3 text-sm font-medium text-primary shrink-0">
                {formatMoney(
                  (() => {
                    const discountAmount =
                      discountType === DiscountTypeEnum.PERCENT
                        ? (unitPrice * discountValue) / 100
                        : discountValue;
                    const total = quantity * (unitPrice - discountAmount);

                    return total;
                  })(),
                  format,
                )}
              </span>
              <div className="flex w-16 justify-center px-0.5 shrink-0">
                <Form.Item name="vat" rules={[{ required: true, message: "Nhập SL" }]} noStyle>
                  <InputPercentage placeholder="VAT" />
                </Form.Item>
              </div>
              <div className="flex min-w-[76px] flex-1 justify-end shrink-0 px-0.5">
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
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default ProductInfo;
