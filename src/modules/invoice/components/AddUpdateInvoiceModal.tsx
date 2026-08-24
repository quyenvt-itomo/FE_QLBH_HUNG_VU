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
import { SubmitButton } from "@/shared";
import { Label } from "@/shared";
import { AppDatePicker } from "@/shared";
import { InputMoney, InputPercentage, InputQuantity } from "@/shared";
import { FormSection } from "@/shared";
import { FormListTable, FormColumn } from "@/shared";
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
import { AppSelect } from "@/shared";
import { PartnerSelect } from "@/modules/partner";
import {
  convertPurchaseToInvoiceLines,
  convertOrderToInvoiceLines,
  convertStockDocumentToInvoiceLines,
  convertShippingPlanToInvoiceLines,
} from "../invoice.util";
import { EntityType, FileCategory, SortOrder } from "@/shared/constants/enum";
import { AddressInput } from "@/shared";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { FileUploadBox } from "@/shared";
import { CalculationUtil } from "@/shared/utils/calculation.util";

/** Sinh t? �?ng d?ng h�a ��n t? ch?ng t? ngu?n d?a tr�n Type + SourceType */
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

  // Memo h�a params �? queryKey ?n �?nh (tr�nh refetch m?i render ? infinite loop)
  const { data: stockDocuments } = useStockDocumentStore({
    page: 1,
    size: 999,
    sortBy: isInput ? "actualImportDate" : "actualExportDate",
    sortOrder: SortOrder.ASC,
    partnerId: partner?.id,
    purchaseId: purchase?.id,
    orderId: order?.id,
    status: StockDocumentStatus.COMPLETED,
    isLocked: sourceType !== InvoiceSourceType.ORDER || (!purchase && !order),
  });

  // C?t l?ch s? giao h�ng: m?i phi?u nh?p kho 1 c?t (billingQuantity) � �? �?i chi?u khi nh?p h�a ��n
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
    // Tr�ch xu?t c�c cell b? l?i �? highlight
    const cells = extractListErrorCells(errors, "lines");
    setErrorCells(cells);
  }, [errors, form]);

  // Option ngu?n t�y theo Type
  const sourceTypeOptions = useMemo(() => getInmvoiceOptionsByDirection(type), [type]);

  const isManual = sourceType === InvoiceSourceType.OTHER;

  // �p d?ng ch?ng t? ngu?n: sinh d?ng + �?i t�c
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

  // C?t d?ng h�a ��n
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
        title: "H�ng h�a",
        dataIndex: "productName",
        width: 220,
        editable: isManual,
        render: ({ record }) =>
          isManual ? (
            <Input placeholder="T�n h�ng h�a" variant="borderless" />
          ) : (
            record?.productName || "--"
          ),
      },
      {
        title: "M? h�ng",
        dataIndex: "productCode",
        width: 100,
        editable: isManual,
        render: ({ record }) =>
          isManual ? (
            <Input placeholder="M? h�ng" variant="borderless" />
          ) : (
            record?.productCode || "--"
          ),
      },
      {
        title: "�VT",
        dataIndex: "unit",
        width: 70,
        align: "center",
        editable: isManual,
        render: ({ record }) =>
          isManual ? <Input placeholder="�VT" variant="borderless" /> : record?.unit || "--",
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
        title: "��n gi�",
        dataIndex: "unitPrice",
        width: 110,
        align: "right",
        editable: isManual,
        render: ({ record }) =>
          isManual ? <InputMoney variant="borderless" /> : formatMoney(record?.unitPrice),
      },
      {
        title: "Th�nh ti?n",
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
        title: "Ti?n VAT",
        dataIndex: "taxAmount",
        width: 100,
        align: "right",
        render: ({ record }) => {
          const taxAmount = calc.calculateTaxAmount(record);
          return formatMoney(taxAmount);
        },
      },
      {
        title: "Th�nh ti?n",
        dataIndex: "totalAmount",
        width: 110,
        align: "right",
        render: ({ record }) => {
          const totalAmount = calc.calculateGrossAmount(record);
          return formatMoney(totalAmount);
        },
      },
      {
        title: "Ghi ch�",
        dataIndex: "note",
        width: 120,
        editable: true,
        render: ({ record }) => <Input placeholder="Ghi ch�" variant="borderless" />,
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
              message.error(canUse?.reason || "��n h�ng kh�ng th? nh?p h�a ��n");
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
              message.error(canUse?.reason || "Ph��ng �n v?n chuy?n kh�ng th? nh?p h�a ��n");
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
              message.error(canUse?.reason || "��n h�ng kh�ng th? xu?t h�a ��n");
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
              message.error(canUse?.reason || "Ch?ng t? kho kh�ng th? nh?p h�a ��n");
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
      children = <Input placeholder="Nh?p s? ch?ng t?" />;
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
      title: editData ? "X�c nh?n s?a h�a ��n?" : "X�c nh?n th�m h�a ��n?",
      content: editData
        ? "B?n c� ch?c ch?n mu?n s?a h�a ��n n�y kh�ng?"
        : "B?n c� ch?c ch?n mu?n th�m h�a ��n n�y kh�ng?",
      okText: "X�c nh?n",
      cancelText: "H?y",
      onOk: () => {
        const formattedData = formatFormData(payload);
        editData ? onEdit?.(formattedData) : onAdd?.(formattedData);
      },
    });
  };

  // X�a ch?ng t? ngu?n
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
      title={`${invoiceTypeMap[type]} - ${editData ? "Ch?nh s?a" : "Nh?p m?i"}`}
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
        <FormSection title="Th�ng tin chung">
          <Row gutter={[24, 0]}>
            <Col span={10}>
              <Form.Item
                name="partnerId"
                label={<Label title="�?i t�c" required />}
                rules={[{ required: true, message: "Vui l?ng ch?n �?i t�c" }]}
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
              <Form.Item name="sourceType" label={<Label title="Lo?i ch?ng t?" />}>
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
                label={<Label title="S? ch?ng t?" required />}
                rules={[{ required: true, message: "Vui l?ng ch?n/nh?p s? ch?ng t?" }]}
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
              <Form.Item name="referenceDate" label={<Label title="Ng�y ch?ng t?" />}>
                <AppDatePicker onlyDate disabled={!isManual} />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item name={["partner", "code"]} label={<Label title="M? �?i t�c" />}>
                <Input placeholder="Ch?n �?i t�c" disabled />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item name={["partner", "taxCode"]} label={<Label title="M? s? thu?" />}>
                <Input placeholder="M? s? thu?" disabled />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item name={["partner", "phone"]} label={<Label title="S? �i?n tho?i" />}>
                <Input placeholder="S? �i?n tho?i" disabled />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item
                name="invoiceNumber"
                label={<Label title="S? h�a ��n" required />}
                rules={[{ required: true, message: "Vui l?ng nh?p s? h�a ��n" }]}
              >
                <Input placeholder="S? h�a ��n" />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item
                name="invoiceDate"
                label={<Label title="Ng�y h�a ��n" required />}
                rules={[{ required: true, message: "Vui l?ng ch?n ng�y h�a ��n" }]}
              >
                <AppDatePicker onlyDate />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item name={["partner", "address"]} label={<Label title="�?a ch?" />}>
                <AddressInput disabled />
              </Form.Item>
            </Col>

            <Col span={14}>
              <Form.Item name="note" label={<Label title="Ghi ch�" />}>
                <Input placeholder="Ghi ch�" />
              </Form.Item>
            </Col>
          </Row>
        </FormSection>

        {/* D?ng h�a ��n */}
        <FormSection title="D?ng h�a ��n">
          <FormListTable
            form={form}
            fieldName="lines"
            columns={[...lineColumns, ...moreColumns]}
            records={lines}
            showDelete={isManual}
            errorCells={errorCells}
            emptyText={isManual ? "Ch�a c� d?ng" : "Ch?n ch?ng t? ngu?n �? sinh d?ng t? �?ng"}
            renderSummary={() => {
              const total = calc.calculateTotalForArray(lines);
              return (
                <>
                  <td className="text-center" colSpan={4}>
                    <span className="font-semibold">T?ng</span>
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
              entity={EntityType.PURCHASE}
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
