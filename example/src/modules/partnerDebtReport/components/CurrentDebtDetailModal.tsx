import React, { useMemo, useState } from "react";
import { Button, Modal, Table } from "antd";
import {
  PartnerCurrentDebt,
  PartnerDebtInvoice,
  partnerDebtRefTypeMap,
} from "../partnerDebtReport.model";
import { PaginationProps } from "@/shared/interfaces/api";
import { CLASSNAME } from "@/shared/constants/ui";
import { formatMoney } from "@/shared/utils/number.util";
import { formatDateDDMMYYYY } from "@/shared/utils/date.util";
import { PartnerCardLite } from "@/modules/partner";
import { InvoiceType, invoiceStatusMap, invoiceTypeMap } from "@/modules/invoice";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import CustomPagination from "@/shared/components/CustomPagination";
import { TransactionTypeEnum } from "@/shared/constants/enum";
import { InputMoney } from "@/shared/components/input";
import {
  AddUpdatePaymentRequestModal,
  PaymentRequest,
  PaymentRequestTypeEnum,
  usePaymentRequestStore,
} from "@/modules/paymentRequest";
import { checkPermission } from "@/shared/utils/permission.util";

interface Props {
  open: boolean;
  partner?: PartnerCurrentDebt;
  dataSource: PartnerDebtInvoice[];
  pagination?: PaginationProps | null;
  setPage?: (page: number) => void;
  setSize?: (size: number) => void;
  invoiceType: InvoiceType;
  onClose: () => void;
}

interface LedgerRow {
  key: string;
  isInvoiceRow?: boolean;
  isSummaryRow?: boolean;
  invoiceId?: string;
  totalRemainingAmount?: number;
  stt?: number;
  invoiceDate?: string | Date | null;
  invoiceNumber?: string;
  content?: string;
  totalAmount?: number;
  paymentAmount?: number;
  paymentDate?: string | Date | null;
  bank?: string;
  remaining?: number;
  refCode?: string;
  refDate?: string | Date | null;
}

/**
 * Rải phẳng dữ liệu: mỗi hóa đơn = 1 dòng hóa đơn (ít nhất 1 dòng)
 * + N dòng giảm trừ, với N = số giao dịch reductions có type = OUT,
 * được sắp xếp theo ngày (occurredAt).
 * "Còn nợ" là số dư chạy dần từ tổng hóa đơn sau từng bút toán giảm trừ.
 * "Ngân hàng" được tra cứu từ phiếu thu/chi (incomeExpense) qua số chứng từ.
 */
const buildLedgerRows = (invoices: PartnerDebtInvoice[]): LedgerRow[] => {
  const rows: LedgerRow[] = [];

  invoices.forEach((inv, index) => {
    // Các giao dịch giảm trừ của hóa đơn: type = OUT, sắp theo ngày
    const reductions = (inv.reductions || [])
      .filter((r) => r.type === TransactionTypeEnum.OUT)
      .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());

    // Tra cứu ngân hàng theo số chứng từ từ các phiếu thu/chi phân bổ
    const bankByRefCode = new Map<string, string>();
    (inv.allocations || []).forEach((alloc) => {
      const ie = alloc.incomeExpense;
      if (ie?.code && ie.fundSnapshot?.name) {
        bankByRefCode.set(ie.code, ie.fundSnapshot.name);
      }
    });

    // Dòng hóa đơn (ít nhất 1 dòng)
    rows.push({
      key: `inv-${inv.id}`,
      isInvoiceRow: true,
      invoiceId: inv.id,
      stt: index + 1,
      invoiceDate: inv.invoiceDate,
      invoiceNumber: inv.invoiceNumber,
      content: invoiceStatusMap[inv.status] || inv.status,
      totalAmount: inv.totalAmount,
      totalRemainingAmount: inv.totalRemainingAmount,
      remaining: inv.totalAmount,
    });

    // Các dòng giảm trừ (số dư còn nợ chạy dần)
    let remaining = inv.totalAmount;
    reductions.forEach((r, ri) => {
      remaining -= r.amount;
      rows.push({
        key: `red-${inv.id}-${ri}`,
        isInvoiceRow: false,
        content: partnerDebtRefTypeMap[r.refType] || r.refType,
        paymentAmount: r.amount,
        paymentDate: r.occurredAt,
        bank: r.refCode ? bankByRefCode.get(r.refCode) || undefined : undefined,
        remaining,
        refCode: r.refCode || undefined,
        refDate: r.occurredAt,
      });
    });
  });

  return rows;
};

export const CurrentDebtDetailModal: React.FC<Props> = ({
  open,
  partner,
  dataSource,
  pagination,
  setPage,
  setSize,
  invoiceType,
  onClose,
}) => {
  const { isMobile, permissions } = useGlobalData();
  const { create, errors, creating } = usePaymentRequestStore();

  const [inputValues, setInputValues] = useState<Record<string, number>>({});
  const [openRequest, setOpenRequest] = useState(false);

  const data = useMemo(() => buildLedgerRows(dataSource || []), [dataSource]);

  // Dòng tổng: Thành tiền | Số tiền thanh toán | Còn nợ
  const summary = useMemo(() => {
    const invoiceRows = data.filter((r) => r.isInvoiceRow);
    return {
      totalAmount: invoiceRows.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
      paymentAmount: data.reduce((sum, r) => sum + (r.paymentAmount || 0), 0),
      remaining: invoiceRows.reduce((sum, r) => sum + (r.totalRemainingAmount || 0), 0),
    };
  }, [data]);

  const summaryRow: LedgerRow = {
    key: "summary",
    isSummaryRow: true,
    invoiceNumber: "Tổng",
    totalAmount: summary.totalAmount,
    paymentAmount: summary.paymentAmount,
    remaining: summary.remaining,
  };

  const tableData = data.length > 0 ? [summaryRow, ...data] : [];

  const totalRequestAmount = useMemo(
    () => Object.values(inputValues).reduce((sum, val) => sum + (val || 0), 0),
    [inputValues],
  );

  const canCreatePaymentRequest = checkPermission(permissions, "paymentRequest", "create");

  if (!partner) return null;

  const handleInputChange = (invoiceId: string, amount: number) => {
    setInputValues((prev) => ({ ...prev, [`invoice-${invoiceId}`]: amount }));
  };

  const handleCreatePaymentRequest = (values: Partial<PaymentRequest>) => {
    const lines: any[] = Object.entries(inputValues)
      .map(([key, amount]) => ({
        invoiceId: key.replace("invoice-", ""),
        amount: amount || 0,
      }))
      .filter((line) => line.amount > 0);

    create?.(
      {
        ...values,
        type: PaymentRequestTypeEnum.INVOICE,
        partnerId: partner?.id,
        totalAmount: totalRequestAmount,
        lines,
      },
      {
        onSuccess: () => {
          setInputValues({});
          setOpenRequest(false);
        },
      },
    );
  };

  const columns: any[] = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      fixed: isMobile ? undefined : "left",
      width: 50,
      ellipsis: true,
      className: "index-column",
    },
    {
      title: "Ngày hóa đơn",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      width: 130,
      ellipsis: true,
      render: (value: string | Date) => formatDateDDMMYYYY(value),
    },
    {
      title: "Số hóa đơn",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 150,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: 160,
    },
    {
      title: "Thành tiền",
      key: "totalAmount",
      children: [
        {
          title: "Vnđ",
          dataIndex: "totalAmount",
          key: "totalAmountValue",
          width: 130,
          align: "right",
          render: (value: number) => formatMoney(value),
        },
      ],
    },
    {
      title: "Thanh toán",
      key: "payment",
      children: [
        {
          title: "Số tiền",
          dataIndex: "paymentAmount",
          key: "paymentAmount",
          width: 130,
          align: "right",
          render: (value: number) => formatMoney(value),
        },
        {
          title: "Ngày",
          dataIndex: "paymentDate",
          key: "paymentDate",
          width: 110,
          render: (value: string | Date) => formatDateDDMMYYYY(value),
        },
        {
          title: "Ngân hàng",
          dataIndex: "bank",
          key: "bank",
          width: 140,
        },
      ],
    },
    {
      title: "Còn nợ",
      key: "remaining",
      children: [
        {
          title: "Vnđ",
          dataIndex: "remaining",
          key: "remainingValue",
          width: 130,
          align: "right",
          render: (value: number) => formatMoney(value),
        },
      ],
    },
    {
      title: "Số chứng từ",
      dataIndex: "refCode",
      key: "refCode",
      width: 130,
    },
    {
      title: "Ngày chứng từ",
      dataIndex: "refDate",
      key: "refDate",
      width: 120,
      render: (value: string | Date) => formatDateDDMMYYYY(value),
    },
  ].filter(Boolean);

  if (canCreatePaymentRequest) {
    columns.push({
      title: "Đề nghị thanh toán",
      key: "requestAmount",
      width: 170,
      align: "right",
      render: (_: any, record: LedgerRow) => {
        if (record.isSummaryRow) {
          return (
            <div className="px-2 text-right font-semibold">{formatMoney(totalRequestAmount)}</div>
          );
        }
        if (!record.isInvoiceRow || !record.invoiceId) return null;
        const max = record.totalRemainingAmount || 0;
        if (max <= 0) return null;
        return (
          <InputMoney
            className="h-8"
            max={max}
            min={0}
            value={inputValues[`invoice-${record.invoiceId}`] ?? undefined}
            onChange={(val) => handleInputChange(record.invoiceId!, val || 0)}
          />
        );
      },
    });
  }

  return (
    <Modal
      title={`Hóa đơn còn nợ (${invoiceTypeMap[invoiceType]}) - ${partner?.name || ""}`}
      open={open}
      footer={null}
      destroyOnClose
      maskClosable={false}
      centered
      width={"100vw"}
      className="fullscreen-modal"
      onCancel={onClose}
    >
      <div className="flex flex-col h-full gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="w-full sm:w-96">
            <PartnerCardLite item={partner} />
          </div>
          {canCreatePaymentRequest && (
            <Button
              type="primary"
              htmlType="button"
              onClick={() => setOpenRequest(true)}
              disabled={totalRequestAmount === 0}
              className="flex-shrink-0"
            >
              Tạo đề nghị TT
            </Button>
          )}
        </div>

        <div className="flex flex-col h-[calc(100%-76px)] rounded-lg border overflow-hidden">
          <Table
            columns={columns}
            dataSource={tableData}
            className={CLASSNAME.table + " double-floor"}
            pagination={false}
            tableLayout="fixed"
            scroll={{
              x: "max-content",
              y: "max-content",
            }}
            rowKey="key"
            rowClassName={(record: LedgerRow) => {
              if (record.isSummaryRow) return "bg-slate-100 dark:bg-slate-800 font-semibold";
              if (record.isInvoiceRow) return "bg-blue-50 dark:bg-blue-900/10 font-medium";
              return "";
            }}
            footer={() =>
              pagination === undefined ? (
                <></>
              ) : (
                <CustomPagination
                  pagination={pagination}
                  itemName={"hóa đơn"}
                  length={tableData.length > 0 ? tableData.length - 1 : 0}
                  showTotal={true}
                  setPage={setPage}
                  setSize={setSize}
                />
              )
            }
          />
        </div>
      </div>

      <AddUpdatePaymentRequestModal
        open={openRequest}
        loading={creating}
        errors={errors}
        onAdd={handleCreatePaymentRequest}
        onClose={() => setOpenRequest(false)}
      />
    </Modal>
  );
};
