import React, { useEffect, useMemo } from "react";
import { App, Col, Form, FormProps, Input, Modal, Radio, Row } from "antd";
import dayjs from "dayjs";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import {
  Invoice,
  InvoiceLine,
  InvoiceType,
  invoiceTypeMap,
  InvoiceSourceType,
  invoiceSourceTypeMap,
  getInmvoiceOptionsByDirection,
} from "../invoice.model";
import { handleCloseWithPendingFiles, randomId } from "@/shared/utils/common.util";
import { extractListErrorCells, setFormErrors } from "@/shared/utils/form.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { formatMoney, formatPercentage, formatQuantity } from "@/shared/utils/number.util";
import SubmitButton from "@/shared/components/button/SubmitButton";
import Label from "@/shared/components/display/Label";
import { AppDatePicker } from "@/shared/components/input/AppDatePicker";
import { InputMoney, InputPercentage, InputQuantity } from "@/shared/components/input";
import { FormSection } from "@/shared/components/form/FormSection";
import FormListTable, { FormColumn } from "@/shared/components/form/FormListTable";
import { Purchase, PurchaseSelect } from "@/modules/purchase";
import { ShippingPlan, ShippingPlanSelect } from "@/modules/shippingPlan";
import { Order, OrderSelect } from "@/modules/order";
import {
  StockDocument,
  StockDocumentSelect,
  StockDocumentStatus,
  StockDocumentType,
  useStockDocumentStore,
} from "@/modules/stockDocument";
import { ApproveStatus } from "@/modules/shared/business.model";
import { AppSelect } from "@/shared/components/select/AppSelect";
import { PartnerSelect } from "@/modules/partner";
import {
  convertPurchaseToInvoiceLines,
  convertOrderToInvoiceLines,
  convertStockDocumentToInvoiceLines,
  convertShippingPlanToInvoiceLines,
} from "../invoice.util";
import { EntityFile, FileCategory, SortOrderEnum } from "@/shared/constants/enum";
import { AddressInput } from "@/shared/components/input/AddressInput";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";
import { CalculationUtil } from "@/shared/utils/calculation.util";

/** Sinh tự động dòng hóa đơn từ chứng từ nguồn dựa trên Type + SourceType */
function buildLines(
  source: Order | Purchase | ShippingPlan | StockDocument | null | undefined,
  Type: InvoiceType,
  sourceType: InvoiceSourceType,
): InvoiceLine[] {
  if (!source) return [];
  const isInput = Type === InvoiceType.INPUT;

  switch (sourceType) {
    case InvoiceSourceType.ORDER:
      return isInput
        ? convertPurchaseToInvoiceLines(source as Purchase)
        : convertOrderToInvoiceLines(source as Order);
    case InvoiceSourceType.SALES_SERVICE:
      return convertOrderToInvoiceLines(source as Order, "service");
    case InvoiceSourceType.SHIPPING_PLAN:
      return convertShippingPlanToInvoiceLines(source as ShippingPlan);
    case InvoiceSourceType.DOCUMENT:
      return convertStockDocumentToInvoiceLines(source as StockDocument);
    default:
      return [];
  }
}

export interface AddUpdateInvoiceModalProps extends AddUpdateModalProps<Invoice> {
  type: InvoiceType;
}
export const AddUpdateInvoiceModal: React.FC<AddUpdateInvoiceModalProps> = ({
  open,
  editData,
  loading,
  errors,
  type,
  onAdd,
  onEdit,
  onClose,
}) => {
  const { modal } = App.useApp();
  const { message, errorCells, setErrorCells, showFormErrorMessages } = useAppMessage();
  const [form] = Form.useForm<Invoice>();
  const id = editData?.id || randomId();
  const isEdit = !!editData;
  const calc = new CalculationUtil();

  const isInput = type === InvoiceType.INPUT;

  const sourceType = Form.useWatch("sourceType", form);
  const lines = Form.useWatch("lines", form) || [];
  const partner = Form.useWatch("partner", form);
  const purchase = Form.useWatch("purchase", form);
  const order = Form.useWatch("order", form);
  const shippingPlan = Form.useWatch("shippingPlan", form);
  const stockDocument = Form.useWatch("stockDocument", form);

  // Memo hóa params để queryKey ổn định (tránh refetch mỗi render → infinite loop)
  const { data: stockDocuments } = useStockDocumentStore({
    page: 1,
    size: 999,
    sortBy: isInput ? "actualImportDate" : "actualExportDate",
    sortOrder: SortOrderEnum.ASC,
    partnerId: partner?.id,
    purchaseId: purchase?.id,
    orderId: order?.id,
    status: StockDocumentStatus.COMPLETED,
    isLocked: sourceType !== InvoiceSourceType.ORDER || (!purchase && !order),
  });

  // Cột lịch sử giao hàng: mỗi phiếu nhập kho 1 cột (billingQuantity) — để đối chiếu khi nhập hóa đơn
  const { moreColumns } = useMemo(() => {
    const docs = stockDocuments || [];

    const dynamicCols: FormColumn<InvoiceLine>[] = docs.map((sd) => {
      const importDate = sd.actualImportDate || sd.effectiveDate;
      return {
        title: (
          <div className="flex flex-col items-center">
            <span className="font-mono text-2xs">{sd.code}</span>
            <span className="text-2xs text-gray-500">{dayjs(importDate).format("DD/MM")}</span>
          </div>
        ),
        dataIndex: sd.id,
        key: sd.id,
        width: 110,
        align: "right",
        className: "yellow-column",
        render: ({ record }) => {
          const sourceLineId = (record as any)?.sourceLineId;
          const sdl = sd.lines?.find(
            (l) => l.purchaseLineId === sourceLineId || l.orderLineId === sourceLineId,
          );
          return sdl?.billingQuantity != null ? formatQuantity(sdl.billingQuantity) : "";
        },
      };
    });

    return { moreColumns: dynamicCols };
  }, [stockDocuments]);

  useEffect(() => {
    if (!errors) {
      setErrorCells(new Map());
      return;
    }
    setFormErrors(form, errors, { scrollToFirst: true });
    // Trích xuất các cell bị lỗi để highlight
    const cells = extractListErrorCells(errors, "lines");
    setErrorCells(cells);
  }, [errors, form]);

  // Option nguồn tùy theo Type
  const sourceTypeOptions = useMemo(() => getInmvoiceOptionsByDirection(type), [type]);

  const isManual = sourceType === InvoiceSourceType.OTHER;

  // Áp dụng chứng từ nguồn: sinh dòng + đối tác
  const applySource = (
    srcData: Order | Purchase | ShippingPlan | StockDocument | null | undefined,
    dir: InvoiceType,
    st: InvoiceSourceType,
    selectName: keyof Invoice,
    selectDataName: keyof Invoice,
  ) => {
    form.setFieldValue(selectName, srcData?.id ?? null);
    form.setFieldValue(selectDataName, srcData || null);
    form.setFieldValue("lines", buildLines(srcData, dir, st));
    const partner =
      (srcData as any)?.partner || (srcData as any)?.customer || (srcData as any)?.supplier || null;
    form.setFieldValue("partnerId", partner?.id ?? null);
    form.setFieldValue("partner", partner || null);
  };

  const setReferenceDate = (date?: Date | string | null) => {
    if (!date) {
      form.setFieldValue("referenceDate", null);
      return;
    }

    const d = dayjs(date);
    form.setFieldValue("referenceDate", d);
  };

  // Cột dòng hóa đơn
  const lineColumns: FormColumn<InvoiceLine>[] = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "__idx",
        width: 40,
        align: "center",
        render: ({ index }) => index + 1,
      },
      {
        title: "Hàng hóa",
        dataIndex: "productName",
        width: 220,
        editable: isManual,
        render: ({ record }) =>
          isManual ? (
            <Input placeholder="Tên hàng hóa" variant="borderless" />
          ) : (
            record?.productName || "--"
          ),
      },
      {
        title: "Mã hàng",
        dataIndex: "productCode",
        width: 100,
        editable: isManual,
        render: ({ record }) =>
          isManual ? (
            <Input placeholder="Mã hàng" variant="borderless" />
          ) : (
            record?.productCode || "--"
          ),
      },
      {
        title: "ĐVT",
        dataIndex: "unit",
        width: 70,
        align: "center",
        editable: isManual,
        render: ({ record }) =>
          isManual ? <Input placeholder="ĐVT" variant="borderless" /> : record?.unit || "--",
      },
      {
        title: "SL",
        dataIndex: "quantity",
        width: 90,
        align: "right",
        editable: isManual,
        render: ({ record }) =>
          isManual ? (
            <InputQuantity variant="borderless" min={0} />
          ) : (
            formatQuantity(record?.quantity)
          ),
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        width: 110,
        align: "right",
        editable: isManual,
        render: ({ record }) =>
          isManual ? <InputMoney variant="borderless" /> : formatMoney(record?.unitPrice),
      },
      {
        title: "Thành tiền",
        dataIndex: "subTotal",
        width: 100,
        align: "right",
        render: ({ record }) => {
          const subTotal = calc.calculateSubTotal(record);
          return formatMoney(subTotal);
        },
      },
      {
        title: "VAT%",
        dataIndex: "taxRate",
        width: 70,
        align: "right",
        editable: isManual,
        render: ({ record }) =>
          isManual ? (
            <InputPercentage notRightAlign variant="borderless" />
          ) : (
            formatPercentage(record?.taxRate)
          ),
      },
      {
        title: "Tiền VAT",
        dataIndex: "taxAmount",
        width: 100,
        align: "right",
        render: ({ record }) => {
          const taxAmount = calc.calculateTaxAmount(record);
          return formatMoney(taxAmount);
        },
      },
      {
        title: "Thành tiền",
        dataIndex: "totalAmount",
        width: 110,
        align: "right",
        render: ({ record }) => {
          const totalAmount = calc.calculateGrossAmount(record);
          return formatMoney(totalAmount);
        },
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        width: 120,
        editable: true,
        render: ({ record }) => <Input placeholder="Ghi chú" variant="borderless" />,
      },
    ],
    [isManual],
  );

  const getSourceItemConfig = (): { name: string; children: React.ReactNode } => {
    let name = "";
    let children: React.ReactNode = null;

    if (isInput && sourceType === InvoiceSourceType.ORDER) {
      name = "purchaseId";
      children = (
        <PurchaseSelect
          defaultData={purchase}
          query={{
            supplierId: partner?.id,
            isCompleted: true,
            approveStatus: ApproveStatus.APPROVED,
          }}
          disabled={isEdit}
          onChangeData={(v) => {
            const canUse = v?._actions?.createInvoice;
            if (v && !canUse?.can) {
              message.error(canUse?.reason || "Đơn hàng không thể nhập hóa đơn");
              form.setFieldValue("purchaseId", null);
              return;
            }
            form.setFieldValue("referenceNumber", v?.code || null);
            setReferenceDate(v?.orderedAt);
            applySource(v, type, sourceType, "purchaseId", "purchase");
          }}
        />
      );
    } else if (isInput && sourceType === InvoiceSourceType.SHIPPING_PLAN) {
      name = "shippingPlanId";
      children = (
        <ShippingPlanSelect
          defaultData={shippingPlan}
          disabled={isEdit}
          query={{
            approveStatus: ApproveStatus.APPROVED,
          }}
          onChangeData={(v) => {
            const canUse = v?._actions?.createInvoice;
            if (v && !canUse?.can) {
              message.error(canUse?.reason || "Phương án vận chuyển không thể nhập hóa đơn");
              form.setFieldValue("shippingPlanId", null);
              return;
            }
            form.setFieldValue("referenceNumber", v?.code || null);
            setReferenceDate(v?.plannedAt);
            applySource(v, type, sourceType, "shippingPlanId", "shippingPlan");
          }}
        />
      );
    } else if (
      (!isInput && sourceType === InvoiceSourceType.ORDER) ||
      sourceType === InvoiceSourceType.SALES_SERVICE
    ) {
      name = "orderId";
      children = (
        <OrderSelect
          defaultData={order}
          disabled={isEdit}
          query={{
            customerId: partner?.id,
            isCompleted: true,
            approveStatus: ApproveStatus.APPROVED,
          }}
          onChangeData={(v) => {
            const canUse = v?._actions?.createInvoice;
            if (v && !canUse?.can) {
              message.error(canUse?.reason || "Đơn hàng không thể xuất hóa đơn");
              form.setFieldValue("orderId", null);
              return;
            }

            form.setFieldValue("referenceNumber", v?.code || null);
            setReferenceDate(v?.timeAt);

            applySource(v, type, sourceType, "orderId", "order");
          }}
        />
      );
    } else if (sourceType === InvoiceSourceType.DOCUMENT) {
      name = "stockDocumentId";
      children = (
        <StockDocumentSelect
          defaultData={stockDocument}
          disabled={isEdit}
          query={{
            type: isInput ? StockDocumentType.PURCHASE_RECEIPT : StockDocumentType.ORDER_ISSUE,
            status: StockDocumentStatus.COMPLETED,
          }}
          onChangeData={(v) => {
            const canUse = v?._actions?.createInvoice;
            if (v && !canUse?.can) {
              message.error(canUse?.reason || "Chứng từ kho không thể nhập hóa đơn");
              form.setFieldValue("stockDocumentId", null);
              return;
            }

            form.setFieldValue("referenceNumber", v?.code || null);
            setReferenceDate(v?.effectiveDate);

            applySource(v, type, sourceType, "stockDocumentId", "stockDocument");
          }}
        />
      );
    } else {
      name = "referenceNumber";
      children = <Input placeholder="Nhập số chứng từ" />;
    }

    return { name, children };
  };

  const { name: sourceName, children: sourceChildren } = getSourceItemConfig();

  const onFinish: FormProps<Invoice>["onFinish"] = async (values) => {
    const payload = {
      ...values,
      type,
      id,
      tempId: id,
    };

    modal.confirm({
      centered: true,
      title: editData ? "Xác nhận sửa hóa đơn?" : "Xác nhận thêm hóa đơn?",
      content: editData
        ? "Bạn có chắc chắn muốn sửa hóa đơn này không?"
        : "Bạn có chắc chắn muốn thêm hóa đơn này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        const formattedData = formatFormData(payload);
        editData ? onEdit?.(formattedData) : onAdd?.(formattedData);
      },
    });
  };

  // Xóa chứng từ nguồn
  const handleClearSource = () => {
    form.setFieldValue("purchaseId", null);
    form.setFieldValue("purchase", null);
    form.setFieldValue("orderId", null);
    form.setFieldValue("order", null);
    form.setFieldValue("shippingPlanId", null);
    form.setFieldValue("shippingPlan", null);
    form.setFieldValue("stockDocumentId", null);
    form.setFieldValue("stockDocument", null);
    form.setFieldValue("lines", []);
  };

  return (
    <Modal
      title={`${invoiceTypeMap[type]} - ${editData ? "Chỉnh sửa" : "Nhập mới"}`}
      open={open}
      onCancel={() => handleCloseWithPendingFiles(id, onClose)}
      footer={null}
      maskClosable={false}
      centered
      width="100vw"
      className="fullscreen-modal"
      afterOpenChange={(isOpen) => {
        if (!isOpen) {
          form.resetFields();
          return;
        }
        if (editData) {
          const formatted = parseFormDataDates(editData, ["lines"]);
          form.setFieldsValue(formatted);
          return;
        }
      }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={showFormErrorMessages}
        className="flex flex-col h-full overflow-x-hidden overflow-y-auto"
        initialValues={{
          sourceType: InvoiceSourceType.ORDER,
          lines: [],
        }}
      >
        <FormSection title="Thông tin chung">
          <Row gutter={[24, 0]}>
            <Col span={10}>
              <Form.Item
                name="partnerId"
                label={<Label title="Đối tác" required />}
                rules={[{ required: true, message: "Vui lòng chọn đối tác" }]}
              >
                <PartnerSelect
                  defaultData={partner}
                  disabled={isEdit}
                  onChangeData={(v) => {
                    form.setFieldValue("partner", v);
                    handleClearSource();
                  }}
                />
              </Form.Item>
              <Form.Item name="partner" hidden />
            </Col>
            <Col span={4}>
              <Form.Item name="sourceType" label={<Label title="Loại chứng từ" />}>
                <AppSelect
                  allowClear={false}
                  options={sourceTypeOptions}
                  disabled={isEdit}
                  onChange={() => {
                    handleClearSource();
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name={sourceName}
                label={<Label title="Số chứng từ" required />}
                rules={[{ required: true, message: "Vui lòng chọn/nhập số chứng từ" }]}
              >
                {sourceChildren}
              </Form.Item>
              <Form.Item name="referenceNumber" hidden />
              <Form.Item name="purchase" hidden />
              <Form.Item name="shippingPlan" hidden />
              <Form.Item name="order" hidden />
              <Form.Item name="stockDocument" hidden />
            </Col>

            <Col span={5}>
              <Form.Item name="referenceDate" label={<Label title="Ngày chứng từ" />}>
                <AppDatePicker onlyDate disabled={!isManual} />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item name={["partner", "code"]} label={<Label title="Mã đối tác" />}>
                <Input placeholder="Chọn đối tác" disabled />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item name={["partner", "taxCode"]} label={<Label title="Mã số thuế" />}>
                <Input placeholder="Mã số thuế" disabled />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item name={["partner", "phone"]} label={<Label title="Số điện thoại" />}>
                <Input placeholder="Số điện thoại" disabled />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item
                name="invoiceNumber"
                label={<Label title="Số hóa đơn" required />}
                rules={[{ required: true, message: "Vui lòng nhập số hóa đơn" }]}
              >
                <Input placeholder="Số hóa đơn" />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item
                name="invoiceDate"
                label={<Label title="Ngày hóa đơn" required />}
                rules={[{ required: true, message: "Vui lòng chọn ngày hóa đơn" }]}
              >
                <AppDatePicker onlyDate />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item name={["partner", "address"]} label={<Label title="Địa chỉ" />}>
                <AddressInput disabled />
              </Form.Item>
            </Col>

            <Col span={14}>
              <Form.Item name="note" label={<Label title="Ghi chú" />}>
                <Input placeholder="Ghi chú" />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        {/* Dòng hóa đơn */}
        <FormSection title="Dòng hóa đơn">
          <FormListTable
            form={form}
            fieldName="lines"
            columns={[...lineColumns, ...moreColumns]}
            records={lines}
            showDelete={isManual}
            errorCells={errorCells}
            emptyText={isManual ? "Chưa có dòng" : "Chọn chứng từ nguồn để sinh dòng tự động"}
            renderSummary={() => {
              const total = calc.calculateTotalForArray(lines);
              return (
                <>
                  <td className="text-center" colSpan={4}>
                    <span className="font-semibold">Tổng</span>
                  </td>
                  <td className="border-l text-end px-3 font-semibold">
                    {formatQuantity(total.quantity)}
                  </td>
                  <td className="border-l" />
                  <td className="border-l text-end">
                    <span className="px-3">{formatMoney(total.subTotal)}</span>
                  </td>
                  <td className="border-l" />
                  <td className="px-3 border-l text-end">{formatMoney(total.taxAmount)}</td>
                  <td className="border-l text-end text-primary font-semibold">
                    <span className="px-3">{formatMoney(total.grossAmount)}</span>
                  </td>
                  <td className="border-l" />
                  {(stockDocuments || []).map((sd) => {
                    const s = (lines || []).reduce((acc, l) => {
                      const srcId = (l as any)?.sourceLineId;
                      const sdl = sd.lines?.find(
                        (x) => x.purchaseLineId === srcId || x.orderLineId === srcId,
                      );
                      return acc + (sdl?.billingQuantity || 0);
                    }, 0);
                    return (
                      <td key={sd.id} className="border-l text-end font-semibold px-3">
                        {s ? formatQuantity(s) : ""}
                      </td>
                    );
                  })}
                </>
              );
            }}
          />
        </FormSection>

        <div className="flex justify-between items-end mt-auto mb-0 action-sticky-bottom">
          <div className="flex w-[520px]">
            <FileUploadBox
              defaultFiles={editData?.document}
              oId={id}
              entity={EntityFile.PURCHASE}
              category={FileCategory.DOCUMENT}
              maxCount={5}
              onMoveToTrash={(file) => {
                const trashFileIds: string[] = form?.getFieldValue("__trashFileIds") || [];
                if (trashFileIds.includes(file.id)) return;
                form?.setFieldValue("__trashFileIds", [...trashFileIds, file.id]);
              }}
            />
            <Form.Item name="__trashFileIds" hidden />
          </div>
          <SubmitButton
            loading={loading}
            onCancel={() => handleCloseWithPendingFiles(id, onClose)}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default AddUpdateInvoiceModal;
