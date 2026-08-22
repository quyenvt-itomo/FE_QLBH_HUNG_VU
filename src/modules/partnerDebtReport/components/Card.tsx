import { formatMoney } from "@/shared/utils/number.util";

const fmtQty = (n: number) => Number(n || 0).toLocaleString("vi-VN");

interface PartnerDebtSummaryCardProps {
  closingQuantity?: number;
  closingAmount?: number;
  increaseQuantity?: number;
  decreaseQuantity?: number;
}

export const PartnerDebtSummaryCard: React.FC<PartnerDebtSummaryCardProps> = ({
  closingQuantity = 0,
  closingAmount = 0,
  increaseQuantity = 0,
  decreaseQuantity = 0,
}) => {
  return (
    <div className="mx-3 mt-2 mb-1 rounded-xl border border-blue-200 dark:border-blue-700/40 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 p-3 grid grid-cols-2 gap-x-4 gap-y-2 flex-shrink-0">
      <div>
        <div className="text-blue-500/70 dark:text-blue-400/70 text-[11px] font-medium uppercase tracking-wide">
          Tồn cuối kỳ
        </div>
        <div className="font-bold text-blue-700 dark:text-blue-300 text-base leading-tight">
          {fmtQty(closingQuantity)}
        </div>
      </div>
      <div>
        <div className="text-blue-500/70 dark:text-blue-400/70 text-[11px] font-medium uppercase tracking-wide">
          Giá trị tồn
        </div>
        <div className="font-bold text-blue-700 dark:text-blue-300 text-base leading-tight">
          {formatMoney(closingAmount)}đ
        </div>
      </div>
      <div>
        <div className="text-emerald-600/70 dark:text-emerald-400/70 text-[11px] font-medium uppercase tracking-wide">
          Nhập kỳ
        </div>
        <div className="font-semibold text-emerald-700 dark:text-emerald-300 leading-tight">
          +{fmtQty(increaseQuantity)}
        </div>
      </div>
      <div>
        <div className="text-rose-500/70 dark:text-rose-400/70 text-[11px] font-medium uppercase tracking-wide">
          Xuất kỳ
        </div>
        <div className="font-semibold text-rose-600 dark:text-rose-400 leading-tight">
          -{fmtQty(decreaseQuantity)}
        </div>
      </div>
    </div>
  );
};
