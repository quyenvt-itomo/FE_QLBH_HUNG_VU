import { App } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import type { Sale } from "@/modules/sale";
import { DiscountType } from "@/shared/constants/enum";
import { CachedOrder, setCurrentOrderCache } from "@/shared/stores/orderCache.slice";
import { randomId } from "@/shared/utils/common.util";
import { privateRoutesName } from "@/shared/constants/routerName";
import { OrderType } from "../order.model";

interface SourceStore {
  getById?: (id: string, options?: { onSuccess?: (data: Sale | null) => void }) => void;
  getAll?: (params?: Record<string, unknown>) => Promise<any[]>;
}

interface Options {
  saleStore: SourceStore;
  saleReturnStore: SourceStore;
  cachedOrders: Record<string, CachedOrder>;
  onClosePicker: () => void;
}

export const usePosReturnSource = ({
  saleStore,
  saleReturnStore,
  cachedOrders,
  onClosePicker,
}: Options) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const openReturnFromSale = (sale: Sale) => {
    saleStore.getById?.(sale.id, {
      onSuccess: (source) => {
        if (!source) {
          message.error("Không tìm thấy hóa đơn bán hàng");
          return;
        }

        const cached = Object.values(cachedOrders).find(
          (item) => item.type === OrderType.SALE_RETURN && item.refOrderId === source.id,
        );
        if (cached) {
          dispatch(setCurrentOrderCache(cached.id));
          onClosePicker();
          navigate(`${privateRoutesName.pos}?type=${OrderType.SALE_RETURN}`);
          return;
        }

        void saleReturnStore
          .getAll?.({ page: 1, size: 10000, useFullDetail: true })
          .then((returns) => {
            const existing = returns.find((item) => item.refOrderId === source.id);
            if (existing) {
              const existingBySourceLine = new Map(
                (existing.returnLines || []).map((line: any) => [line.refOrderLineId, line]),
              );
              const returnLines = (source.lines || []).map((sourceLine) => {
                const currentLine = existingBySourceLine.get(sourceLine.id) as any;
                return {
                  ...sourceLine,
                  ...(currentLine || {}),
                  id: currentLine?.id || randomId(),
                  orderId: null,
                  returnOrderId: existing.id,
                  refOrderLineId: sourceLine.id,
                  quantity: Number(currentLine?.quantity || 0),
                  subTotal: Number(currentLine?.subTotal || 0),
                  maxReturnQuantity: Number(sourceLine.quantity || 0),
                };
              });

              onClosePicker();
              navigate(
                `${privateRoutesName.pos}?type=${OrderType.SALE_RETURN}&editId=${existing.id}`,
                {
                  state: { order: { ...existing, refOrder: source, returnLines } },
                },
              );
              return;
            }

            const returnedByLine = new Map<string, number>();
            (source.returnLines || []).forEach((line) => {
              if (!line.refOrderLineId) return;
              returnedByLine.set(
                line.refOrderLineId,
                (returnedByLine.get(line.refOrderLineId) || 0) + Number(line.quantity || 0),
              );
            });
            const returnLines = (source.lines || []).map((line) => ({
              ...line,
              id: randomId(),
              orderId: null,
              returnOrderId: null,
              quantity: 0,
              subTotal: 0,
              refOrderLineId: line.id,
              maxReturnQuantity: Math.max(
                0,
                Number(line.quantity || 0) - (returnedByLine.get(line.id) || 0),
              ),
            }));

            onClosePicker();
            navigate(`${privateRoutesName.pos}?type=${OrderType.SALE_RETURN}`, {
              state: {
                order: {
                  refOrderId: source.id,
                  refOrder: source,
                  partnerId: source.partnerId,
                  partner: source.partner,
                  returnDiscountType: source.discountType,
                  returnDiscountValue:
                    source.discountType === DiscountType.PERCENT ? source.discountValue : 0,
                  returnTaxType: source.taxType,
                  returnTaxValue: source.taxType === DiscountType.PERCENT ? source.taxValue : 0,
                  returnLines,
                },
              },
            });
          });
      },
    });
  };

  return { openReturnFromSale };
};
