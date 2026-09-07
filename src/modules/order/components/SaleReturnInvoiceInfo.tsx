import { PrinterOutlined } from "@ant-design/icons";
import { Button, Segmented } from "antd";
import React, { useEffect, useMemo, useRef } from "react";

import { CustomerAddSelect } from "@/modules/partner/components/Select";
import { Partner } from "@/modules/partner/partner.model";
import { FundSelect } from "@/modules/fund/components/Select";
import { FundTypeEnum } from "@/modules/fund/fund.model";
import { OrderValueInput, InputMoney } from "@/shared/components";
import { DiscountTypeEnum } from "@/shared/constants/enum";
import { CachedOrder } from "@/shared/stores/orderCache.slice";
import { formatMoney, getCashSuggestions } from "@/shared/utils/number.util";
import { PosPayment, PosTotals } from "./PosInvoiceInfo";

interface Props {
  activeOrder: CachedOrder;
  returnTotals: PosTotals;
  exchangeTotals: PosTotals;
  payment?: PosPayment;
  customerSelectRef: React.RefObject<HTMLDivElement>;
  updateActive: (values: Partial<CachedOrder>) => void;
  updatePayment: (values: Record<string, unknown>) => void;
  changePaymentMode: (mode: FundTypeEnum) => void;
  onSubmit: (print?: boolean) => void;
  loading?: boolean;
  readOnly?: boolean;
}

const getLineQuantity = (lines: CachedOrder["lines"] | CachedOrder["returnLines"]) =>
  (lines || []).reduce((sum, line) => sum + Number((line as any).quantity || 0), 0);

const SummaryRow: React.FC<{
  label: string;
  value: number;
  quantity?: number;
  strong?: boolean;
}> = ({ label, value, quantity, strong = false }) => (
  <div
    className={`flex items-center justify-between gap-3 py-2 text-sm ${strong ? "font-semibold" : ""}`}
  >
    <span>{label}</span>
    <span className="flex items-center gap-6">
      {quantity !== undefined && <span>{quantity}</span>}
      <b className={strong ? "text-lg text-primary" : ""}>{formatMoney(value)}</b>
    </span>
  </div>
);

const EditableMoneyRow: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
}> = ({ label, value, onChange, readOnly = false }) => (
  <div className="flex items-center justify-between gap-3 py-2 text-sm">
    <span>{label}</span>
    {readOnly ? (
      <span>{formatMoney(value)}</span>
    ) : (
      <InputMoney
        min={0}
        value={value}
        onChange={(next) => onChange(Number(next || 0))}
        className="w-56"
      />
    )}
  </div>
);

export const SaleReturnInvoiceInfo: React.FC<Props> = ({
  activeOrder,
  returnTotals,
  exchangeTotals,
  payment,
  customerSelectRef,
  updateActive,
  updatePayment,
  changePaymentMode,
  onSubmit,
  loading,
  readOnly = false,
}) => {
  const settlementAmount = exchangeTotals.totalAmount - returnTotals.totalAmount;
  const paymentDue = Math.abs(settlementAmount);
  const paidAmount = Number(payment?.amount || 0);
  const paymentMode = (activeOrder.paymentMode || FundTypeEnum.CASH) as FundTypeEnum;
  const returnLines = useMemo(() => activeOrder.returnLines || [], [activeOrder.returnLines]);
  const exchangeLines = activeOrder.lines || [];
  const hasExchange = exchangeLines.length > 0;
  const hasLines =
    returnLines.some((line) => Number((line as any).quantity || 0) > 0) || hasExchange;
  const returnQuantity = getLineQuantity(returnLines);
  const exchangeQuantity = getLineQuantity(exchangeLines);
  const returnCost = useMemo(
    () =>
      returnLines.reduce(
        (sum, line) =>
          sum + Number((line as any).quantity || 0) * Number((line as any).costPriceAtTime || 0),
        0,
      ),
    [returnLines],
  );
  const previousPaymentDue = useRef<{ orderId: string; amount: number }>();

  useEffect(() => {
    const previous = previousPaymentDue.current;
    previousPaymentDue.current = { orderId: activeOrder.id, amount: paymentDue };
    if (
      readOnly ||
      (previous && previous.orderId === activeOrder.id && previous.amount === paymentDue)
    ) {
      return;
    }
    if (!previous && activeOrder.mode !== "create" && payment) return;
    if (Number(payment?.amount || 0) !== paymentDue) updatePayment({ amount: paymentDue });
  }, [activeOrder.id, activeOrder.mode, payment, paymentDue, readOnly, updatePayment]);

  const cashAmountOptions = useMemo(() => getCashSuggestions(paymentDue), [paymentDue]);
  const customer = activeOrder.partner as Partner | undefined;
  const sourceCode = activeOrder.refOrder?.code || activeOrder.code || "Trả nhanh";
  const isCustomerPaying = settlementAmount > 0;

  return (
    <aside className="flex w-[520px] shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white">
      <section className="border-b border-gray-200 px-4 py-2">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <span className="font-semibold uppercase tracking-wide">Cửa hàng</span>
          <span>
            {activeOrder.orderAt
              ? new Date(String(activeOrder.orderAt)).toLocaleString("vi-VN")
              : ""}
          </span>
        </div>
        <div ref={customerSelectRef}>
          {readOnly ? (
            <div className="rounded-md bg-gray-100 px-3 py-2 font-semibold text-primary">
              {customer?.name || activeOrder.refOrder?.partnerSnapshot?.name || "Khách lẻ"}
            </div>
          ) : (
            <CustomerAddSelect
              value={activeOrder.partnerId || undefined}
              defaultData={customer}
              onChangeData={(partner) => updateActive({ partnerId: partner?.id || null, partner })}
              placeholder="Tìm khách hàng (F4) — bỏ trống là Khách lẻ"
            />
          )}
        </div>
      </section>

      <section className="border-b border-gray-200 px-4 py-3">
        <div className="mb-3 text-base font-semibold text-primary">
          <span className="text-green-600">Trả hàng</span>
          <span className="mx-1 text-gray-400">/</span>
          <span>{sourceCode}</span>
        </div>
        <SummaryRow
          label="Tổng tiền hàng trả"
          value={returnTotals.grossAmount}
          quantity={returnQuantity}
        />
        {readOnly ? (
          <SummaryRow label="Giảm giá" value={returnTotals.discountAmount} />
        ) : (
          <div className="flex items-center justify-between gap-3 py-2 text-sm">
            <span>Giảm giá</span>
            <div className="w-56">
              <OrderValueInput
                type="discount"
                discountValue={Number(activeOrder.returnDiscountValue || 0)}
                discountType={
                  (activeOrder.returnDiscountType || DiscountTypeEnum.AMOUNT) as DiscountTypeEnum
                }
                onChange={(value, discountType) =>
                  updateActive({ returnDiscountValue: value, returnDiscountType: discountType })
                }
              />
            </div>
          </div>
        )}

        <SummaryRow label="Tổng tiền trả" value={returnTotals.totalAmount} strong />
      </section>

      {hasExchange && (
        <section className="border-b border-dashed border-gray-300 px-4 py-3">
          <div className="mb-2 text-base font-semibold text-green-600">Mua hàng</div>
          <SummaryRow
            label="Tổng tiền hàng"
            value={exchangeTotals.grossAmount}
            quantity={exchangeQuantity}
          />
          {readOnly ? (
            <>
              <SummaryRow label="Giảm giá" value={exchangeTotals.discountAmount} />
              <SummaryRow label="VAT" value={exchangeTotals.taxAmount} />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 py-2 text-sm">
                <span>Giảm giá</span>
                <OrderValueInput
                  type="discount"
                  discountValue={Number(activeOrder.discountValue || 0)}
                  discountType={
                    (activeOrder.discountType || DiscountTypeEnum.AMOUNT) as DiscountTypeEnum
                  }
                  onChange={(value, discountType) =>
                    updateActive({ discountValue: value, discountType })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-3 py-2 text-sm">
                <span>VAT</span>
                <OrderValueInput
                  type="tax"
                  discountValue={Number(activeOrder.taxValue || 0)}
                  discountType={
                    (activeOrder.taxType || DiscountTypeEnum.PERCENT) as DiscountTypeEnum
                  }
                  onChange={(value, taxType) => updateActive({ taxValue: value, taxType })}
                />
              </div>
            </>
          )}
          <SummaryRow label="Tổng tiền mua" value={exchangeTotals.totalAmount} strong />
        </section>
      )}

      <section className="px-4 py-3">
        <SummaryRow
          label={isCustomerPaying ? "Khách cần trả" : "Cần trả khách"}
          value={paymentDue}
          strong
        />
        {paymentDue > 0 && (
          <>
            <div className="flex items-center justify-between gap-3 py-2 text-sm">
              <span>{isCustomerPaying ? "Khách thanh toán" : "Hoàn tiền khách"}</span>
              <InputMoney
                min={0}
                value={paidAmount}
                disabled={readOnly}
                onChange={(amount) => updatePayment({ amount: Number(amount || 0) })}
                className="w-56"
              />
            </div>
            {!readOnly && (
              <>
                <Segmented
                  block
                  value={paymentMode}
                  options={[
                    { label: "Tiền mặt", value: FundTypeEnum.CASH },
                    { label: "Chuyển khoản", value: FundTypeEnum.BANK },
                  ]}
                  onChange={(value) => changePaymentMode(value as FundTypeEnum)}
                />
                <div className="mt-3">
                  <FundSelect
                    query={{ type: paymentMode }}
                    value={payment?.fundId || undefined}
                    defaultData={payment?.fund}
                    onChangeData={(fund) => updatePayment({ fundId: fund?.id || null, fund })}
                  />
                </div>
                {paymentMode === FundTypeEnum.CASH && (
                  <div className="mt-3 flex flex-wrap gap-1.5 rounded-md bg-gray-100 p-3">
                    {cashAmountOptions.map((amount) => (
                      <Button
                        key={amount}
                        className="rounded-full"
                        type={paidAmount === amount ? "primary" : "default"}
                        onClick={() => updatePayment({ amount })}
                      >
                        {formatMoney(amount)}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>

      {!readOnly && (
        <div className="sticky bottom-0 mt-auto flex gap-2 border-t border-gray-200 bg-white p-4 pt-1.5">
          <Button
            className="flex h-12 w-14 items-center justify-center p-0 text-lg"
            disabled={!hasLines}
            onClick={() => onSubmit(true)}
          >
            <PrinterOutlined />
          </Button>
          <Button
            type="primary"
            block
            className="h-12"
            disabled={!hasLines}
            loading={loading}
            onClick={() => onSubmit(false)}
          >
            <span className="text-lg font-semibold">
              {activeOrder.mode === "edit" ? "CẬP NHẬT" : "TRẢ HÀNG"}
            </span>
          </Button>
        </div>
      )}
    </aside>
  );
};
