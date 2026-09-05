import React, { useEffect, useRef, useState } from "react";
import ExcelJS from "exceljs";
import dayjs from "dayjs";
import { App, Button, Col, Divider, Form, Input, Modal, Row, Space } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { AppDatePicker, InputMoney, Label, OrderValueInput } from "@/shared/components";
import { SupplierAddSelect } from "@/modules/partner/components/Select";
import { getProductsByCodes } from "@/modules/product/product.store";
import { collectUnits, getDefaultPurchaseUnit } from "@/modules/product/product.util";
import { DiscountTypeEnum } from "@/shared/constants/enum";
import { OrderStatus, OrderType, Purchase, PurchaseLine } from "../purchase.model";
import { PurchaseFile, purchaseExcelColumns } from "../purchase.file";
import { PurchaseLineFormList } from "./PurchaseLineFormList";
import { randomId } from "@/shared/utils/common.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FundSelect } from "@/modules/fund";
import { formatVnd } from "@/shared/utils";

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

export const AddUpdatePurchaseModal: React.FC<AddUpdateModalProps<Purchase>> = ({
  open,
  editData,
  loading,
  errors,
  defaultData,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { modal, message } = App.useApp();
  const { showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<any>();
  const [showInfo, setShowInfo] = useState(true);
  const [unmatchedRows, setUnmatchedRows] = useState<unknown[][]>([]);
  const createIdRef = useRef(randomId());
  const discountValue = Form.useWatch("discountValue", form) || 0;
  const discountType = Form.useWatch("discountType", form);
  const taxValue = Form.useWatch("taxValue", form) || 0;
  const taxType = Form.useWatch("taxType", form);
  const shippingFee = Form.useWatch("shippingFee", form) || 0;
  const isFreeShipping = Form.useWatch("isFreeShipping", form);
  const payment = Form.useWatch(["incomeExpenses", 0], form) || {};
  const paymentAmount = Number(payment.amount || 0);
  const paymentFund = payment.fund;
  const lines: PurchaseLine[] = Form.useWatch("lines", form) || [];
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
      type: OrderType.PURCHASE,
      orderAt: dayjs(),
      lines: [],
      discountValue: 0,
      discountType: DiscountTypeEnum.AMOUNT,
      taxValue: 0,
      taxType: DiscountTypeEnum.PERCENT,
      shippingFee: 0,
      isFreeShipping: false,
      incomeExpenses: [{ amount: 0 }],
      completeImmediately: false,
      ...(defaultData ? parseFormDataDates(defaultData) : {}),
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
          return {
            tempId: randomId(),
            productId: product.id,
            product,
            unitId: unit?.id || product.baseUnitId,
            unit,
            quantity: cellNumber(row[6]) || 1,
            unitPrice: cellNumber(row[3]),
          };
        })
        .filter(Boolean);
      form.setFieldValue("lines", [...(form.getFieldValue("lines") || []), ...importedLines]);
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
    const payload = formatFormData({
      ...values,
      id,
      tempId: id,
    });
    if (editData) onEdit?.(payload);
    else onAdd?.(payload);
  };

  const totalAmount = lines.reduce(
    (sum, line) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0),
    0,
  );
  const calculateRateAmount = (value: number, type?: DiscountTypeEnum) =>
    type === DiscountTypeEnum.PERCENT
      ? (totalAmount * Number(value || 0)) / 100
      : Number(value || 0);
  const discountAmount = Math.min(
    totalAmount,
    calculateRateAmount(Number(discountValue), discountType),
  );
  const netAmount = Math.max(0, totalAmount - discountAmount);
  const taxAmount =
    taxType === DiscountTypeEnum.PERCENT
      ? (netAmount * Number(taxValue || 0)) / 100
      : Number(taxValue || 0);
  const shippingAmount =
    Number(shippingFee || 0) > 0 && isFreeShipping === false ? Number(shippingFee || 0) : 0;
  const payableAmount = netAmount + taxAmount + shippingAmount;

  return (
    <>
      <Modal
        title={editData ? "Sửa phiếu nhập hàng" : "Thêm phiếu nhập hàng"}
        open={open}
        onCancel={onClose}
        footer={null}
        width="100vw"
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
              <PurchaseLineFormList
                form={form}
                onImportFile={importExcel}
              />
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
                            <Input placeholder="Mã phiếu nhập (Tự động tạo)" />
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
                    <Form.Item name="occurredAt" label={<Label title="Ngày nhập kho" />}>
                      <AppDatePicker showTime />
                    </Form.Item>
                  )}

                  <Divider className="my-2" />
                      <div className="flex justify-between pt-2 pb-4">
                        <span>Tổng tiền hàng</span>
                        <span>{formatVnd(totalAmount)}</span>
                      </div>

                      <div className="flex gap-2.5 w-full pb-5">
                        <Form.Item name="discountValue" hidden />
                        <Form.Item name="discountType" hidden />
                        <Label title="Giảm giá" />
                        <OrderValueInput
                          type="discount"
                          discountValue={discountValue}
                          discountType={discountType}
                          onChange={(value, type) => {
                            form.setFieldValue("discountValue", value);
                            form.setFieldValue("discountType", type);
                          }}
                          notRightAlign
                        />
                      </div>

                      <div className="flex gap-2.5 w-full pb-5">
                        <Label title="Thuế/VAT" />
                        <Form.Item name="taxValue" hidden />
                        <Form.Item name="taxType" hidden />
                        <OrderValueInput
                          type="tax"
                          discountValue={taxValue}
                          discountType={taxType}
                          onChange={(value, type) => {
                            form.setFieldValue("taxValue", value);
                            form.setFieldValue("taxType", type);
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
                      <div className="mb-2 font-semibold text-gray-800">Thanh toán</div>

                      <Form.Item
                        name={["incomeExpenses", 0, "amount"]}
                        label={<Label title="Số tiền thanh toán" />}
                      >
                        <InputMoney notRightAlign placeholder="Nhập số tiền thanh toán" />
                      </Form.Item>
                      <Form.Item
                        name={["incomeExpenses", 0, "fundId"]}
                        label={<Label title="Quỹ thanh toán" />}
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
                        <span>Còn nợ nhà cung cấp</span>
                        <span className="font-medium text-orange-600">
                          {formatVnd(Math.max(0, payableAmount - Number(paymentAmount || 0)))}
                        </span>
                      </div>
                      <Form.Item name="note">
                        <Input.TextArea rows={2} placeholder="Ghi chú cho phiếu nhập" />
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
                {editData ? "Lưu phiếu" : "Nhập kho ngay"}
              </Button>
            </Space>
          </div>
          <Form.Item name="completeImmediately" hidden />
        </Form>
      </Modal>
    </>
  );
};
