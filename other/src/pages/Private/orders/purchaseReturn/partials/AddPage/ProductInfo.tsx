import Title from "../../../../../../components/display/Title";
import { PartialProps } from "../../AddPage";
import { Button, Empty, Form } from "antd";
import { PlusIcon, TrashIcon, MinusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { formatMoney, formatPercentage } from "../../../../../../utils/formatNumber";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import { InputMoney, InputQuantity, OrderDiscountInput } from "../../../../../../components/input";
import { IOrderLine } from "../../../../../../models/store/orderLine";
import { getVariantOptionContent } from "../../../../../../utils/common";
import { DiscountTypeEnum } from "../../../../../../constants/enum";
import { useEffect, useState } from "react";
import SquareImage from "../../../../../../components/image/SquareImage";
import { getMainImage } from "../../../../../../utils/fileUtil";
import PurchaseSelect from "../../../../../../components/select/PurchaseSelect";
import { OrderLineSelect } from "../../../../../../components/no_hook_selects/OrderLineSelect";

const ProductInfo: React.FC<PartialProps> = ({ form }) => {
  const lines: IOrderLine[] = Form.useWatch("lines", form) || [];
  const { format } = useClientData();
  const refOrder = Form.useWatch("refOrder", form);

  const [defaultOrderLine, setDefaultOrderLine] = useState<IOrderLine | undefined>(undefined);

  useEffect(() => {
    if (!defaultOrderLine) return;

    setDefaultOrderLine(undefined);
  }, [defaultOrderLine]);

  return (
    <div className="flex flex-col w-full h-[calc(100%-80px)]">
      <Form.Item name="refOrderId" hidden />
      <Form.Item name="refOrder" hidden />

      {/* Bảng chi tiết đơn hàng */}
      <Form.List name="lines">
        {(fields, { add, remove }) => (
          <div className="flex flex-col h-full">
            <div className="flex gap-4">
              <Title content="Sản phẩm" level={3} className="mr-auto" />
              <PurchaseSelect
                value={refOrder?.id}
                style={{ height: 32, width: 250 }}
                defaultData={refOrder}
                onChange={(id) => form.setFieldValue("refOrderId", id)}
                onChangeData={(data: any) => {
                  form.setFieldsValue({
                    refOrder: data,
                    partnerId: data?.partnerId,
                    partner: data?.partner,
                    discountType: data?.discountType || DiscountTypeEnum.AMOUNT,
                    discountValue: data?.discountValue,
                  });
                }}
              />
              <div className="w-[calc(100%-500px)] relative">
                <OrderLineSelect
                  options={refOrder?.lines || []}
                  value={defaultOrderLine?.id ? [defaultOrderLine.id] : undefined}
                  onChangeData={(values) => {
                    const data = values && values.length > 0 ? values[0] : undefined;
                    setDefaultOrderLine(data);
                    add({
                      refOrderLineId: data?.id,
                      productVariant: data?.productVariantSnapshot,
                      productVariantId: data?.productVariantId,
                      quantity: 1,
                      unitPrice: data?.unitPrice,
                      discountType: data?.discountType,
                      discountValue: data?.discountValue,
                      taxRate: data?.taxRate,
                    });
                  }}
                  hideOptions={lines}
                  suffixIcon={false}
                  disabled={!refOrder}
                  className="search-select"
                  placeholder="Tìm kiếm sản phẩm từ đơn nhập hàng..."
                />
                <MagnifyingGlassIcon className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 text-[#747E76]" />
              </div>
            </div>
            <div className="flex flex-col flex-1 border rounded-md overflow-auto z-0 mt-4">
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
                    const item = lines[index];
                    const hasVariant =
                      !!item?.productVariant?.product?.hasVariant ||
                      !!item?.productVariant?.options?.length;
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
                              title={item?.productVariant?.product?.name}
                            >
                              {item?.productVariant?.product?.name}
                            </span>
                            <div className="flex gap-2 items-center w-full">
                              <span
                                className="text-gray-400 truncate block"
                                title={item?.productVariant?.product?.code}
                              >
                                {item?.productVariant?.product?.code}
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

                        <span className="flex w-20 justify-center shrink-0">
                          {item.productVariant?.product?.unit?.name}
                        </span>

                        <div className="flex w-36 justify-center px-0.5 items-center gap-1 shrink-0">
                          <button
                            type="button"
                            className="
                          h-5 w-5 p-0 bg-gray-100 rounded-full text-gray-400 flex items-center justify-center
                          hover:text-gray-500 transition-colors ease-in-out"
                            onClick={() => {
                              const currentQty = item?.quantity || 0;
                              if (currentQty > 1) {
                                const currentItems = form.getFieldValue("lines");
                                currentItems[index].quantity = currentQty - 1;
                                form.setFieldValue("lines", [...currentItems]);
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
                              const currentItems = form.getFieldValue("lines");
                              currentItems[index].quantity = currentQty + 1;
                              form.setFieldValue("lines", [...currentItems]);
                            }}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex w-32 justify-center px-0.5 shrink-0">
                          <Form.Item name={[field.name, "unitPrice"]} noStyle>
                            <InputMoney />
                          </Form.Item>
                        </div>

                        <div className="flex w-36 justify-center px-0.5 shrink-0">
                          <OrderDiscountInput
                            discountValue={item.discountValue}
                            discountType={item.discountType}
                            onChange={(val, type) => {
                              const currentItems = form.getFieldValue("lines");
                              currentItems[index].discountValue = Number(val || 0);
                              currentItems[index].discountType = type;
                              form.setFieldValue("lines", [...currentItems]);
                            }}
                          />
                        </div>

                        <span className="flex w-32 justify-end px-3 text-sm font-medium text-primary shrink-0">
                          {formatMoney(
                            (() => {
                              const qty = item?.quantity || 0;
                              const price = item?.unitPrice || 0;
                              const discount = item?.discountValue || 0;
                              const isPercent = item?.discountType === DiscountTypeEnum.PERCENT;

                              // tính discount theo % hoặc tiền
                              const discountAmount = isPercent
                                ? (price * discount) / 100
                                : discount;

                              // tổng trước VAT
                              const total = qty * (price - discountAmount);

                              return total;
                            })(),
                            format,
                          )}
                        </span>

                        <div className="flex w-20 justify-center px-0.5 shrink-0">
                          {formatPercentage(item.taxRate, format)}
                        </div>

                        <div className="flex w-11 justify-center shrink-0">
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
          </div>
        )}
      </Form.List>
    </div>
  );
};

export default ProductInfo;
