import React, { useEffect, useMemo, useRef } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { FormListTable, FormColumn } from "@/shared";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import {
  collectProduct,
  collectUnits as collectProductUnits,
  getPriceInKg,
  getQuantityInKg,
  Product,
  ProductMultipleSelect,
  ProductSelect,
  ProductType,
} from "@/modules/product";
import { PartialProps } from "./AddUpdateQuotationModal";
import { randomId, resolveByPath } from "@/shared/utils/common.util";
import { AppSelect } from "@/shared";
import { QuotationLine } from "@/modules/quotationLine";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import {
  collectService,
  collectUnits as collectServiceUnits,
  getPricePerUnit,
  Service,
  ServiceMultipleSelect,
  serviceTypeMap,
} from "@/modules/service";
import {
  collectPartnerContact,
  PartnerContact,
  PartnerContactMultipleSelect,
} from "@/modules/partnerContact";
import {
  CommissionMode,
  commissionModeOptions,
  SaleLineType,
  SortOrder,
} from "@/shared/constants/enum";
import { MagnifyingGlassIcon } from "@/shared/icons";
import { TrashIcon } from "@heroicons/react/24/outline";
import { InputMoney, InputPercentage, InputQuantity } from "@/shared";
import {
  QuotationCalculationUtil,
  QuotationCommissionEntry,
} from "@/shared/utils/quotationCalculation.util";
import { QuotationCommission } from "../quotation.model";

const EMPTY_LIST: any[] = [];
const colorClassList = ["yellow-column", "green-column", "red-column", "blue-column"];

export const QuotationLineFormList: React.FC<PartialProps> = ({ form, errorCells }) => {
  const [defaultProduct, setDefaultProduct] = useAutoResetItem<Product>();
  const [defaultService, setDefaultService] = useAutoResetItem<Service>();
  const [defaultPartnerContact, setDefaultPartnerContact] = useAutoResetItem<PartnerContact>();

  const lines = Form.useWatch("lines", form) || EMPTY_LIST;
  const commissions = Form.useWatch("commissions", form) || EMPTY_LIST;
  const hideProducts = collectProduct(lines);
  const hideServices = collectService(lines);
  const hidePartnerContacts = collectPartnerContact(commissions);
  const commissionMode = Form.useWatch("commissionMode", form) || null;

  const commissionLength = commissions.length;

  useEffect(() => {
    if (commissionLength <= 1) {
      form.setFieldValue("commissionMode", null);
    } else if (!commissionMode) {
      form.setFieldValue("commissionMode", CommissionMode.PRICE);
    }
  }, [commissionLength]); // eslint-disable-line react-hooks/exhaustive-deps

  // ?? C�ng th?c ph? thu?c l?n nhau � d�ng chung QuotationCalculationUtil ??
  const commissionId = (c: any) => c?.tempId || c?.id;
  const qc = new QuotationCalculationUtil();
  const commissionEntries = (record: any) =>
    QuotationCalculationUtil.extractCommissionEntries(record, commissions);
  const calcQuantity = (record: any) => qc.calculateQuantity(record, commissionEntries(record));
  const calcUnitPrice = (record: any) => qc.calculateUnitPrice(record, commissionEntries(record));
  const calcSubTotal = (record: any) => qc.calculateSubTotal(record, commissionEntries(record));
  const calcTaxAmount = (record: any) => qc.calculateTaxAmount(record, commissionEntries(record));
  const calcGrossAmount = (record: any) =>
    qc.calculateGrossAmount(record, commissionEntries(record));
  const calcRawSubTotal = (record: any) => qc.calculateRawSubTotal(record);
  const calcRawMaterialCost = (record: any) => qc.calculateRawMaterialTotalCost(record);
  const calcProfit = (record: any) => qc.calculateRawProfit(record);
  const calcMainPrice = (record: any) => qc.calculateMainPrice(record);

  // T? ghi l?i quantity/unitPrice (gi� tr? th?c = raw + t?ng hoa h?ng) v�o t?ng line
  useEffect(() => {
    if (!lines?.length) return;
    const next = (lines as any[]).map((r) => ({ ...r }));
    let changed = false;
    next.forEach((record: any) => {
      // T? t�nh s? l�?ng Kg (rawMaterialQuantity) t? SL (rawQuantity) theo ��n v? quy �?i
      const rawMaterialQuantity = getQuantityInKg({
        product: record.product || record.productSnapshot || null,
        unitId: record.unitId,
        quantity: record.rawQuantity,
      });
      if (Math.abs((Number(record.rawMaterialQuantity) || 0) - rawMaterialQuantity) > 1e-9) {
        record.rawMaterialQuantity = rawMaterialQuantity;
        changed = true;
      }
      const quantity = calcQuantity(record);
      const unitPrice = calcUnitPrice(record);
      if (Math.abs((Number(record.quantity) || 0) - quantity) > 1e-9) {
        record.quantity = quantity;
        changed = true;
      }
      if (Math.abs((Number(record.unitPrice) || 0) - unitPrice) > 1e-9) {
        record.unitPrice = unitPrice;
        changed = true;
      }
    });
    if (changed) form.setFieldsValue({ lines: next });
  }, [lines, commissions]); // eslint-disable-line react-hooks/exhaustive-deps

  // Khi �?i ch? �? hoa h?ng (? 2 ng�?i h�?ng): c�c gi� tr? c?a ch? �? kia ph?i v? 0
  const prevModeRef = useRef<string | null>(commissionMode || CommissionMode.PRICE);
  useEffect(() => {
    if (commissions.length <= 1) return;
    const next = commissionMode || CommissionMode.PRICE;
    if (prevModeRef.current === next) return;
    prevModeRef.current = next;

    const resetPrice = next === CommissionMode.QUANTITY; // �ang theo l�?ng ? x�a gi�
    const resetQuantity = next === CommissionMode.PRICE; // �ang theo gi� ? x�a l�?ng

    const currentLines = form.getFieldValue("lines") || [];
    const updated = (currentLines as any[]).map((record: any) => {
      const clone = { ...record };
      commissions.forEach((c) => {
        const id = commissionId(c);
        if (!id) return;
        if (resetPrice) {
          clone[`commission_${id}_price`] = 0;
          clone[`commission_${id}_priceTaxRate`] = 0;
        }
        if (resetQuantity) {
          clone[`commission_${id}_quantity`] = 0;
          clone[`commission_${id}_quantityTaxRate`] = 0;
        }
      });
      return clone;
    });
    form.setFieldsValue({ lines: updated });
  }, [commissionMode, commissions]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemoveCommission = (commission: QuotationCommission) => {
    const id = commission?.tempId || commission?.id;
    if (!id) return;

    // X�a commission kh?i m?ng commissions
    form.setFieldValue(
      "commissions",
      commissions.filter((c) => (c?.tempId || c?.id) !== id),
    );

    // D?n c�c field flat commission_<id>_* v� commissionDetails tr�n t?ng line
    const currentLines: QuotationLine[] = form.getFieldValue("lines") || [];
    const updated = currentLines.map((record) => {
      const clone = { ...record };
      Object.keys(clone).forEach((key) => {
        if (key.startsWith(`commission_${id}_`)) delete clone[key as keyof QuotationLine];
      });
      if (Array.isArray(clone.commissionDetails)) {
        clone.commissionDetails = clone.commissionDetails.filter(
          (d) =>
            d?.quotationCommissionId !== id &&
            d?.quotationCommission?.partnerContactId !== commission?.partnerContactId,
        );
      }
      return clone;
    });
    form.setFieldValue("lines", updated);
  };

  /**
   * C?t hoa h?ng �?ng theo chi?u ngang, d?a v�o �? d�i m?ng `commissions`.
   * V? `columns` l� m?ng JS thu?n, ta map t?ng commission ? 1 c?t nh�m (group)
   * v?i c�c c?t con: ��n gi� / TT gi� / %VAT / L�?ng / T?ng HH.
   * Gi� tr? t?ng � l�u tr�n m?i d?ng line d�?i d?ng flat field `commission_<id>_*`.
   * Khi `commissions` thay �?i (useWatch), useMemo t? ch?y l?i ? s? c?t thay �?i.
   */
  const commissionColumns = useMemo<FormColumn<QuotationLine>[]>(() => {
    const isMulti = commissions.length > 1;
    const showPrice = !isMulti || commissionMode === CommissionMode.PRICE;
    const showQuantity = !isMulti || commissionMode === CommissionMode.QUANTITY;

    return commissions.map((commission, index) => {
      const id = commission?.tempId || commission?.id || `c${index}`;
      const prefix = (field: string) => `commission_${id}_${field}`;
      const name = resolveByPath(commission, ["partnerContact", "name"]);
      const phone = resolveByPath(commission, ["partnerContact", "phone"]);

      const colorClass = colorClassList[index % colorClassList.length];
      const getEntry = (record: any): QuotationCommissionEntry => ({
        price: Number(record?.[prefix("price")]) || 0,
        priceTaxRate: Number(record?.[prefix("priceTaxRate")]) || 0,
        quantity: Number(record?.[prefix("quantity")]) || 0,
        quantityTaxRate: Number(record?.[prefix("quantityTaxRate")]) || 0,
      });

      const children: FormColumn<QuotationLine>[] = [];

      if (showPrice) {
        children.push(
          {
            title: <span className="text-xs">��n gi�</span>,
            dataIndex: prefix("price"),
            width: 80,
            align: "right",
            editable: true,
            className: colorClass,
            render: () => <InputMoney variant="borderless" />,
          },
          {
            title: <span className="text-xs">Th�nh ti?n</span>,
            dataIndex: prefix("priceAmount"),
            width: 90,
            align: "right",
            className: colorClass,
            render: ({ record }) =>
              formatMoney(qc.calculatePriceAmount(getEntry(record), calcQuantity(record))),
          },
          {
            title: <span className="text-xs">%VAT</span>,
            dataIndex: prefix("priceTaxRate"),
            width: 60,
            align: "right",
            editable: true,
            className: colorClass,
            render: () => <InputPercentage variant="borderless" />,
          },
          {
            title: <span className="text-xs">Th�nh ti?n</span>,
            dataIndex: prefix("priceTaxRateAmount"),
            width: 90,
            align: "right",
            className: colorClass,
            render: ({ record }) =>
              formatMoney(
                qc.calculatePriceTaxRateAmount(getEntry(record), record, calcQuantity(record)),
              ),
          },
        );
      }

      if (showQuantity) {
        children.push(
          {
            title: <span className="text-xs">L�?ng</span>,
            dataIndex: prefix("quantity"),
            width: 80,
            align: "right",
            editable: true,
            className: colorClass,
            render: () => <InputQuantity variant="borderless" />,
          },
          {
            title: <span className="text-xs">Th�nh ti?n</span>,
            dataIndex: prefix("quantityAmount"),
            width: 90,
            align: "right",
            className: colorClass,
            render: ({ record }) =>
              formatMoney(
                qc.calculateQuantityAmount(getEntry(record), Number(record.rawUnitPrice) || 0),
              ),
          },
          {
            title: <span className="text-xs">%VAT</span>,
            dataIndex: prefix("quantityTaxRate"),
            width: 60,
            align: "right",
            className: colorClass,
            editable: true,
            render: () => <InputPercentage variant="borderless" />,
          },
          {
            title: <span className="text-xs">Th�nh ti?n</span>,
            dataIndex: prefix("quantityTaxRateAmount"),
            width: 90,
            align: "right",
            className: colorClass,
            render: ({ record }) =>
              formatMoney(
                qc.calculateQuantityTaxRateAmount(
                  getEntry(record),
                  record,
                  Number(record.rawUnitPrice) || 0,
                ),
              ),
          },
        );
      }

      return {
        title: (
          <div className="flex items-center justify-center gap-3 px-3 relative">
            <span className="flex justify-center">{`HH ${index + 1}:`}</span>
            <span className="font-semibold">{name || "--"}</span>
            <span className="text-xs text-gray-500">S�T: {phone || "--"}</span>

            <button
              type="button"
              title="X�a hoa h?ng"
              className="ml-3 text-red-500 hover:text-red-700"
              onClick={() => handleRemoveCommission(commission)}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ),
        dataIndex: `commission_${id}`,
        align: "center",
        className: colorClass,
        children,
      };
    });
  }, [commissions, commissionMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: FormColumn<QuotationLine>[] = [
    {
      title: "STT",
      dataIndex: "__idx",
      width: 40,
      align: "center",
      render: (ctx) => ctx.index + 1,
    },
    {
      title: "T�n h�ng h�a / d?ch v?",
      dataIndex: "name",
      width: 220,
      fixed: "left",
      render: ({ record }) =>
        record.type === SaleLineType.PRODUCT
          ? resolveByPath(record, ["product", "name"])
          : resolveByPath(record, ["service", "name"]),
    },
    {
      title: "M? h�ng",
      dataIndex: "code",
      width: 100,
      render: ({ record }) =>
        record.type === SaleLineType.PRODUCT
          ? resolveByPath(record, ["product", "code"])
          : resolveByPath(record, ["service", "code"]),
    },
    {
      title: "�VT",
      dataIndex: "unitId",
      width: 100,
      align: "center",
      render: ({ record, form, name }) => {
        const p = record?.product;
        const s = record?.service;
        if (!p && !s) return null;
        const units =
          record.type === SaleLineType.PRODUCT && p
            ? collectProductUnits(p, record?.unit)
            : s
              ? collectServiceUnits(s, record?.unit)
              : [];

        return (
          <AppSelect
            className={`text-center w-full`}
            options={units.map((u) => ({ value: u.id, label: u.name }))}
            suffixIcon={null}
            value={record?.unitId}
            onChange={(value: string) => {
              const unit = units.find((u: any) => u.id === value);
              form.setFieldValue(["lines", name, "unitId"], value);
              form.setFieldValue(["lines", name, "unit"], unit);
            }}
            variant="borderless"
            allowClear={false}
          />
        );
      },
    },
    {
      title: "S? l�?ng",
      dataIndex: "quantity",
      width: 80,
      align: "right",
      render: ({ record }) => formatQuantity(calcQuantity(record)),
    },
    {
      title: "��n gi�",
      dataIndex: "price",
      children: [
        {
          title: <span className="text-xs font-normal">Vn�</span>,
          dataIndex: "unitPrice",
          width: 80,
          align: "right",
          render: ({ record }) => formatMoney(calcUnitPrice(record)),
        },
      ],
    },

    {
      title: "Th�nh ti?n",
      dataIndex: "subTotal",
      children: [
        {
          title: <span className="text-xs font-normal">Vn�</span>,
          dataIndex: "subTotal",
          width: 120,
          align: "right",
          render: ({ record }) => formatMoney(calcSubTotal(record)),
        },
      ],
    },
    {
      title: "VAT",
      dataIndex: "tax",
      children: [
        {
          title: <span className="text-xs font-normal">%</span>,
          dataIndex: "taxRate",
          width: 40,
          align: "right",
          editable: true,
          fillable: true,
          className: "green-column",
          render: () => <InputPercentage variant="borderless" />,
        },
        {
          title: <span className="text-xs font-normal">Vn�</span>,
          dataIndex: "taxAmount",
          width: 90,
          align: "right",
          render: ({ record }) => formatMoney(calcTaxAmount(record)),
        },
      ],
    },

    {
      title: "T?ng ti?n",
      dataIndex: "grossAmount",
      children: [
        {
          title: <span className="text-xs font-normal">Vn�</span>,
          dataIndex: "grossAmount",
          width: 130,
          align: "right",
          render: ({ record }) => formatMoney(calcGrossAmount(record)),
        },
      ],
    },
    {
      title: "V?t t� ch�nh",
      dataIndex: "materialId",
      width: 150,
      className: "green-column",
      editable: true,
      render: ({ record, form, name }) => {
        if (record.type === SaleLineType.SERVICE) {
          const type = record.service?.type;
          return (
            <span className="text-center text-gray-500">{type ? serviceTypeMap[type] : "--"}</span>
          );
        }
        const material = record.material;
        return (
          <ProductSelect
            className="w-full"
            defaultData={material}
            query={{
              type: ProductType.MAIN_MATERIAL,
              sortBy: "type",
              sortOrder: SortOrder.ASC,
            }}
            variant="borderless"
            placeholder="Ch?n NVL ch�nh"
            onChangeData={(data) => {
              if (!data) return;
              form.setFieldValue(["lines", name, "materialId"], data.id);
              form.setFieldValue(["lines", name, "material"], data);
              form.setFieldValue(["lines", name, "materialSnapshot"], data);
              // Gi� nh?p hi?n t?i = gi� theo Kg c?a NVL
              form.setFieldValue(["lines", name, "rawMaterialUnitPrice"], getPriceInKg(data) || 0);
            }}
          />
        );
      },
    },
    {
      title: <span className="text-wrap">Gi� nh?p hi?n t?i</span>,
      dataIndex: "rawMaterialUnitPrice",
      width: 90,
      align: "right",
      className: "green-column",
      editable: true,
      fillable: true,
      render: () => <InputMoney variant="borderless" />,
    },
    {
      title: <span className="text-wrap">Chi ph� t?m t�nh</span>,
      dataIndex: "rawAdditionalCost",
      width: 80,
      align: "right",
      className: "green-column",
      editable: true,
      fillable: true,
      render: () => <InputMoney variant="borderless" />,
    },
    {
      title: "L?i nhu?n",
      dataIndex: "profit",
      width: 120,
      align: "right",
      render: ({ record }) => formatMoney(calcProfit(record)),
    },
    {
      title: "Th?c t? ch�a VAT",
      dataIndex: "rawGroup",
      children: [
        {
          title: <span className="text-xs">Gi� (kg)</span>,
          dataIndex: "mainPrice",
          width: 80,
          align: "right",
          visible: ({ record }) => record.type === SaleLineType.PRODUCT,
          render: ({ record }) => formatMoney(calcMainPrice(record)),
        },
        {
          title: <span className="text-xs">L�?ng (Kg)</span>,
          dataIndex: "rawMaterialQuantity",
          width: 80,
          align: "right",
          className: "green-column",
          visible: ({ record }) => record.type === SaleLineType.PRODUCT,
          editable: true,
          render: () => <InputQuantity variant="borderless" />,
        },
        {
          title: <span className="text-xs">L�?ng (�vt)</span>,
          dataIndex: "rawQuantity",
          width: 80,
          align: "right",
          editable: true,
          className: "green-column",
          render: () => <InputQuantity variant="borderless" />,
        },
        {
          title: <span className="text-xs">Gi� (�vt)</span>,
          dataIndex: "rawUnitPrice",
          width: 90,
          align: "right",
          editable: true,
          className: "green-column",
          render: () => <InputMoney variant="borderless" />,
        },
        {
          title: <span className="text-xs">Th�nh ti?n</span>,
          dataIndex: "rawSubTotal",
          width: 120,
          align: "right",
          render: ({ record }) => formatMoney(calcRawSubTotal(record)),
        },
      ],
    },
    ...commissionColumns,
  ];

  return (
    <div className="mt-4">
      <Form.Item name="commissionMode" hidden />
      <Form.Item name="commissions" hidden />

      <FormListTable
        form={form}
        fieldName="lines"
        columns={columns}
        records={lines}
        errorCells={errorCells}
        showDelete
        sortable
        title="Danh s�ch h�ng h�a / d?ch v?"
        addWidth={"fit-content"}
        renderAdd={(add) => (
          <div className="flex items-center gap-3">
            {commissions.length > 1 && (
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold">Ch? �? hoa h?ng:</span>
                <AppSelect
                  style={{ width: 120 }}
                  className="h-8"
                  value={commissionMode || CommissionMode.PRICE}
                  onChange={(val) => form.setFieldValue("commissionMode", val)}
                  options={commissionModeOptions}
                />
              </span>
            )}
            <div className="flex w-60">
              <ProductMultipleSelect
                value={defaultProduct ? [defaultProduct.id] : undefined}
                defaultData={defaultProduct ? [defaultProduct] : undefined}
                query={{ sortBy: "type", sortOrder: SortOrder.ASC }}
                placeholder="Ch?n h�ng h�a �? th�m"
                hideOptions={hideProducts}
                prefix={<MagnifyingGlassIcon className="w-6 h-6 text-secondary" />}
                suffixIcon={null}
                onChangeData={(data) => {
                  const item = data?.[0];
                  setDefaultProduct(item);
                  if (!item) return;

                  add({
                    tempId: randomId(),
                    productId: item.id,
                    product: item,
                    unitId: item.baseUnitId,
                    unit: item.baseUnit,
                    unitPrice: item.price,
                    taxRate: item.taxRate,
                    type: SaleLineType.PRODUCT,
                  });
                }}
              />
            </div>
            <div className="w-60">
              <ServiceMultipleSelect
                value={defaultService ? [defaultService.id] : undefined}
                defaultData={defaultService ? [defaultService] : undefined}
                query={{ sortBy: "type", sortOrder: SortOrder.ASC }}
                placeholder="Ch?n d?ch v? �? th�m"
                hideOptions={hideServices}
                prefix={<MagnifyingGlassIcon className="w-6 h-6 text-secondary" />}
                suffixIcon={null}
                onChangeData={(data) => {
                  const item = data?.[0];
                  setDefaultService(item);
                  if (!item) return;

                  const firstUnit = item.units?.[0];
                  const priceData = getPricePerUnit(item, firstUnit?.id);
                  add({
                    tempId: randomId(),
                    serviceId: item.id,
                    service: item,
                    unitId: firstUnit?.id,
                    unit: firstUnit,
                    unitPrice: priceData?.unitPrice ?? 0,
                    taxRate: item.taxRate,
                    type: SaleLineType.SERVICE,
                  });
                }}
              />
            </div>
            <div className="w-60">
              <PartnerContactMultipleSelect
                value={defaultPartnerContact ? [defaultPartnerContact.id] : undefined}
                defaultData={defaultPartnerContact ? [defaultPartnerContact] : undefined}
                query={{ sortBy: "type", sortOrder: SortOrder.ASC }}
                placeholder="Ch?n ng�?i li�n h? �? th�m"
                hideOptions={hidePartnerContacts}
                prefix={<MagnifyingGlassIcon className="w-6 h-6 text-secondary" />}
                suffixIcon={null}
                onChangeData={(data) => {
                  const item = data?.[0];
                  setDefaultPartnerContact(item);
                  if (!item) return;

                  // Th�m ng�?i h�?ng hoa h?ng v�o commissions
                  // m?i ph?n t? commission ? 1 nh�m c?t hoa h?ng ngang
                  const current = form.getFieldValue("commissions") || [];
                  form.setFieldValue("commissions", [
                    ...current,
                    {
                      tempId: randomId(),
                      partnerContactId: item.id,
                      partnerContact: item,
                      partnerContactSnapshot: item,
                    },
                  ]);
                }}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};
