import React, { useEffect, useRef, useState } from "react";
import ExcelJS from "exceljs";
import dayjs from "dayjs";
import { App, Button, Col, Divider, Form, Input, Modal, Row, Space } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { AppDatePicker, InputMoney, Label, OrderValueInput } from "@/shared/components";
import { SupplierAddSelect } from "@/modules/partner/components/Select";
import { getProductsByCodes } from "@/modules/product/product.store";
import {
  collectUnits,
  getCostPriceByStore,
  getDefaultPurchaseUnit,
} from "@/modules/product/product.util";
import { DiscountType } from "@/shared/constants/enum";
import { OrderStatus, OrderType, Purchase, PurchaseLine } from "../purchase.model";
import { PurchaseFile, purchaseExcelColumns } from "../purchase.file";
import { PurchaseLineFormList } from "./PurchaseLineFormList";
import { PurchaseReturnLineFormList } from "./PurchaseReturnLineFormList";
import { randomId } from "@/shared/utils/common.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FundSelect } from "@/modules/fund";
import { formatVnd } from "@/shared/utils";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

const cellText = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "object" && value && "richText" in value) {
    return ((value as any).richText || []).map((item: any) => item.text || "").join("");
  }
  return String(value).trim();
};

const cellNumber = (value: unknown) => {
  const number = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(number) ? number : 0;
};

type Props = AddUpdateModalProps<Purchase> & {
  documentType?: OrderType;
};

export const AddUpdatePurchaseModal: React.FC<Props> = ({
  open,
  editData,
  loading,
  errors,
  defaultData,
  onAdd,
  onEdit,
  onClose,
  documentType = OrderType.PURCHASE,
}) => {
  const { modal, message } = App.useApp();
  const { currentStore } = useGlobalData();
  const { showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<any>();
  const [showInfo, setShowInfo] = useState(true);
  const [unmatchedRows, setUnmatchedRows] = useState<unknown[][]>([]);
  const createIdRef = useRef(randomId());
  const isPurchaseReturn = documentType === OrderType.PURCHASE_RETURN;
  const discountValue =
    Form.useWatch(isPurchaseReturn ? "returnDiscountValue" : "discountValue", form) || 0;
  const discountType = Form.useWatch(
    isPurchaseReturn ? "returnDiscountType" : "discountType",
    form,
  );
  const taxValue = Form.useWatch(isPurchaseReturn ? "returnTaxValue" : "taxValue", form) || 0;
  const taxType = Form.useWatch(isPurchaseReturn ? "returnTaxType" : "taxType", form);
  const shippingFee = Form.useWatch("shippingFee", form) || 0;
  const isFreeShipping = Form.useWatch("isFreeShipping", form);
  const payment = Form.useWatch(["incomeExpenses", 0], form) || {};
  const paymentAmount = Number(payment.amount || 0);
  const paymentFund = payment.fund;
  const lineFieldName = isPurchaseReturn ? "returnLines" : "lines";
  const lines: PurchaseLine[] = Form.useWatch(lineFieldName, form) || [];
  const id = editData?.id || createIdRef.current;

  useEffect(() => {
    if (errors) setFormErrors(form, errors, { scrollToFirst: true });
  }, [errors, form]);

  const handleAfterOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.resetFields();
      setUnmatchedRows([]);
      return;
    }

    setUnmatchedRows([]);
    setShowInfo(true);

    if (editData) {
      form.setFieldsValue(parseFormDataDates(editData as any) as any);
      return;
    }

    const createId = randomId();
    createIdRef.current = createId;
    form.resetFields();
    form.setFieldsValue({
      id: createId,
      tempId: createId,
      orderAt: dayjs(),
      lines: [],
      returnLines: [],
      discountValue: 0,
      discountType: DiscountType.AMOUNT,
      returnDiscountValue: 0,
      returnDiscountType: DiscountType.AMOUNT,
      taxValue: 0,
      taxType: DiscountType.PERCENT,
      returnTaxValue: 0,
      returnTaxType: DiscountType.PERCENT,
      shippingFee: 0,
      isFreeShipping: false,
      incomeExpenses: [{ amount: 0 }],
      completeImmediately: false,
      ...(defaultData ? parseFormDataDates(defaultData) : {}),
      type: documentType,
    });
  };

  const importExcel = async (file: File) => {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load((await file.arrayBuffer()) as any);
      const sheet = workbook.worksheets[0];
      const rows: unknown[][] = [];
      sheet.eachRow((row, index) => {
        if (index > 1 && cellText(row.getCell(1).value)) {
          rows.push(
            purchaseExcelColumns.map((_column, columnIndex) =>
              cellText(row.getCell(columnIndex + 1).value),
            ),
          );
        }
      });
      if (!rows.length) {
        message.warning("File Excel chưa có dòng hàng hóa hợp lệ");
        return;
      }

      const codes = Array.from(new Set(rows.map((row) => cellText(row[0])).filter(Boolean)));
      const products = await getProductsByCodes(codes);
      const productMap = new Map(
        products.map((product) => [product.code.trim().toLowerCase(), product]),
      );
      const missing = rows.filter((row) => !productMap.has(cellText(row[0]).toLowerCase()));
      const importedLines = rows
        .map((row) => {
          const product = productMap.get(cellText(row[0]).toLowerCase());
          if (!product) return null;
          const unitName = cellText(row[2]).toLowerCase();
          const unit =
            collectUnits(product, getDefaultPurchaseUnit(product)).find(
              (item) => item.name.toLowerCase() === unitName,
            ) || getDefaultPurchaseUnit(product);
          const currentCostPrice = isPurchaseReturn
            ? (getCostPriceByStore({
                product,
                storeId: currentStore?.id,
                unitId: unit?.id || product.baseUnitId,
              }) ?? 0)
            : undefined;
          const unitPrice = isPurchaseReturn ? currentCostPrice : cellNumber(row[3]);
          return {
            tempId: randomId(),
            productId: product.id,
            product,
            unitId: unit?.id || product.baseUnitId,
            unit,
            quantity: cellNumber(row[4]) || 1,
            ...(isPurchaseReturn ? { currentCostPrice } : {}),
            unitPrice,
          };
        })
        .filter(Boolean);
      form.setFieldValue(lineFieldName, [
        ...(form.getFieldValue(lineFieldName) || []),
        ...importedLines,
      ]);
      setUnmatchedRows(missing);
      if (missing.length) {
        modal.warning({
          title: "Không tìm thấy hàng hóa",
          content: (
            <div>
              Không tìm thấy hàng hóa có mã:
              <ul className="mt-2 list-disc pl-5">
                {missing.map((row, index) => (
                  <li key={`${row[0]}-${index}`} className="font-mono">
                    {String(row[0] ?? "")}
                  </li>
                ))}
              </ul>
              <Button
                type="link"
                className="!px-0"
                onClick={() => PurchaseFile.exportRows(missing)}
              >
                Tải file các dòng chưa thêm
              </Button>
            </div>
          ),
        });
      } else {
        message.success(`Đã thêm ${importedLines.length} hàng hóa từ Excel`);
      }
    } catch {
      message.error("Không thể đọc file Excel. Vui lòng dùng đúng biểu mẫu phiếu nhập.");
    }
  };

  const onFinish = (values: Purchase) => {
    const returnLines = (values.returnLines || []).map((line: PurchaseLine & {
      currentCostPrice?: number;
    }) => {
      const { currentCostPrice: _currentCostPrice, ...payloadLine } = line;
      return payloadLine;
    });
    const payload = formatFormData({
      ...values,
      id,
      tempId: id,
      type: documentType,
      lines: isPurchaseReturn ? [] : values.lines || [],
      returnLines: isPurchaseReturn ? returnLines : values.returnLines || [],
    });
    if (editData) onEdit?.(payload);
    else onAdd?.(payload);
  };

  const totalAmount = lines.reduce(
    (sum, line) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0),
    0,
  );
  const calculateRateAmount = (value: number, type?: DiscountType) =>
    type === DiscountType.PERCENT ? (totalAmount * Number(value || 0)) / 100 : Number(value || 0);
  const discountAmount = Math.min(
    totalAmount,
    calculateRateAmount(Number(discountValue), discountType),
  );
  const netAmount = Math.max(0, totalAmount - discountAmount);
  const taxAmount =
    taxType === DiscountType.PERCENT
      ? (netAmount * Number(taxValue || 0)) / 100
      : Number(taxValue || 0);
  const shippingAmount =
    Number(shippingFee || 0) > 0 && isFreeShipping === false ? Number(shippingFee || 0) : 0;
  const payableAmount = netAmount + taxAmount + shippingAmount;

  return (
    <>
      <Modal
        title={
          editData
            ? isPurchaseReturn
              ? "Sửa phiếu trả hàng nhập"
              : "Sửa phiếu nhập hàng"
            : isPurchaseReturn
              ? "Thêm phiếu trả hàng nhập"
              : "Thêm phiếu nhập hàng"
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width={"100vw"}
        className="fullscreen-modal"
        centered
        afterOpenChange={handleAfterOpenChange}
        destroyOnClose
        maskClosable={false}
      >
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={showFormErrorMessages}
          className="flex h-full min-h-0 flex-col"
        >
          <div className="flex min-h-0 flex-1 gap-3">
            <div className="flex min-w-0 flex-1 flex-col h-full">
              {isPurchaseReturn ? (
                <PurchaseReturnLineFormList form={form} onImportFile={importExcel} />
              ) : (
                <PurchaseLineFormList form={form} onImportFile={importExcel} />
              )}
            </div>

            <div className="relative flex shrink-0 items-start h-full">
              <Button
                shape="circle"
                size="small"
                className={`absolute -left-3 top-1/2 z-10 transition-all ease-in-out ${showInfo ? "" : "rotate-180"}`}
                onClick={() => setShowInfo((value) => !value)}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
              <div
                className={`${showInfo ? "w-[520px]" : "w-0"} relative  h-full shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white transition-all`}
              >
                {showInfo && (
                  <div className="h-full overflow-y-auto overflow-x-hidden">
                    <div className="p-4 flex flex-col">
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item name="code">
                            <Input
                              placeholder={
                                isPurchaseReturn
                                  ? "Mã phiếu trả hàng (Tự động tạo)"
                                  : "Mã phiếu nhập (Tự động tạo)"
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="orderAt">
                            <AppDatePicker showTime />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item name="partnerId">
                        <SupplierAddSelect
                          defaultData={editData?.partner || defaultData?.partner}
                        />
                      </Form.Item>

                      <Form.Item name="invoiceNumber" label={<Label title="Số hóa đơn" />}>
                        <Input placeholder="Số hóa đơn đầu vào" />
                      </Form.Item>

                      {editData?.status === OrderStatus.COMPLETED && (
                        <Form.Item
                          name="occurredAt"
                          label={
                            <Label title={isPurchaseReturn ? "Ngày trả hàng" : "Ngày nhập kho"} />
                          }
                        >
                          <AppDatePicker showTime />
                        </Form.Item>
                      )}

                      <Divider className="my-2" />
                      <div className="flex justify-between pt-2 pb-4">
                        <span>Tổng tiền hàng</span>
                        <span>{formatVnd(totalAmount)}</span>
                      </div>

                      <div className="flex gap-2.5 w-full pb-5">
                        <Form.Item
                          name={isPurchaseReturn ? "returnDiscountValue" : "discountValue"}
                          hidden
                        />
                        <Form.Item
                          name={isPurchaseReturn ? "returnDiscountType" : "discountType"}
                          hidden
                        />
                        <Label title="Giảm giá" />
                        <OrderValueInput
                          type="discount"
                          discountValue={discountValue}
                          discountType={discountType}
                          onChange={(value, type) => {
                            form.setFieldValue(
                              isPurchaseReturn ? "returnDiscountValue" : "discountValue",
                              value,
                            );
                            form.setFieldValue(
                              isPurchaseReturn ? "returnDiscountType" : "discountType",
                              type,
                            );
                          }}
                          notRightAlign
                        />
                      </div>

                      <div className="flex gap-2.5 w-full pb-5">
                        <Label title={isPurchaseReturn ? "Thuế trả lại" : "Thuế/VAT"} />
                        <Form.Item name={isPurchaseReturn ? "returnTaxValue" : "taxValue"} hidden />
                        <Form.Item name={isPurchaseReturn ? "returnTaxType" : "taxType"} hidden />
                        <OrderValueInput
                          type="tax"
                          discountValue={taxValue}
                          discountType={taxType}
                          onChange={(value, type) => {
                            form.setFieldValue(
                              isPurchaseReturn ? "returnTaxValue" : "taxValue",
                              value,
                            );
                            form.setFieldValue(
                              isPurchaseReturn ? "returnTaxType" : "taxType",
                              type,
                            );
                          }}
                          notRightAlign
                        />
                      </div>

                      <Form.Item name="shippingFee" label={<Label title="Phí vận chuyển" />}>
                        <InputMoney notRightAlign placeholder="Nhập phí vận chuyển" />
                      </Form.Item>
                      <Form.Item name="isFreeShipping" hidden />

                      <div className="flex items-center justify-between py-2 font-semibold">
                        <span>Tổng đơn</span>
                        <span className="text-blue-600">{formatVnd(payableAmount)}</span>
                      </div>

                      <Divider className="my-2" />
                      <div className="mb-2 font-semibold text-gray-800">
                        {isPurchaseReturn ? "NCC hoàn tiền" : "Thanh toán"}
                      </div>

                      <Form.Item
                        name={["incomeExpenses", 0, "amount"]}
                        label={<Label title={isPurchaseReturn ? "NCC hoàn tiền" : "Số tiền thanh toán"} />}
                      >
                        <InputMoney notRightAlign placeholder="Nhập số tiền thanh toán" />
                      </Form.Item>
                      <Form.Item
                        name={["incomeExpenses", 0, "fundId"]}
                        label={<Label title={isPurchaseReturn ? "Quỹ nhận" : "Quỹ thanh toán"} />}
                        rules={[
                          { required: paymentAmount > 0, message: "Vui lòng chọn quỹ thanh toán" },
                        ]}
                      >
                        <FundSelect
                          defaultData={paymentFund}
                          onChangeData={(val) =>
                            form.setFieldValue(["incomeExpenses", 0, "fund"], val)
                          }
                        />
                      </Form.Item>
                      <Form.Item name={["incomeExpenses", 0, "fund"]} hidden />

                      <div className="flex justify-between pb-3 text-sm">
                        <span>
                          {isPurchaseReturn ? "Tính vào công nợ" : "Còn nợ nhà cung cấp"}
                        </span>
                        <span className="font-medium text-orange-600">
                          {formatVnd(Math.max(0, payableAmount - Number(paymentAmount || 0)))}
                        </span>
                      </div>
                      <Form.Item name="note">
                        <Input.TextArea
                          rows={2}
                          placeholder={
                            isPurchaseReturn
                              ? "Ghi chú cho phiếu trả hàng"
                              : "Ghi chú cho phiếu nhập"
                          }
                        />
                      </Form.Item>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 flex shrink-0 justify-between border-t pt-3">
            <Button onClick={onClose} htmlType="button" danger>
              Hủy
            </Button>
            <Space>
              {!editData && (
                <Button
                  htmlType="button"
                  loading={loading}
                  onClick={() => {
                    form.setFieldValue("completeImmediately", false);
                    form.submit();
                  }}
                >
                  Lưu tạm
                </Button>
              )}
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  form.setFieldValue("completeImmediately", !editData);
                  form.submit();
                }}
              >
                {editData ? "Lưu phiếu" : isPurchaseReturn ? "Trả hàng ngay" : "Nhập kho ngay"}
              </Button>
            </Space>
          </div>
          <Form.Item name="completeImmediately" hidden />
        </Form>
      </Modal>
    </>
  );
};
