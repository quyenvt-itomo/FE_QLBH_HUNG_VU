import { useCallback } from "react";

import type { Product } from "@/modules/product/product.model";
import { randomId } from "@/shared/utils/common.util";
import type { CachedOrder, PosOrderType } from "@/shared/stores/orderCache.slice";
import type { PosLine } from "../components/OrderLineTable";
import { OrderType } from "../order.model";
import { getProductPrice } from "../pos.utils";

interface Options {
  type: PosOrderType;
  activeOrder?: CachedOrder;
  isSaleReturn: boolean;
  isReadOnlyReturn: boolean;
  returnLines: PosLine[];
  exchangeLines: PosLine[];
  updateLines: (lines: PosLine[]) => void;
  updateExchangeLines: (lines: PosLine[]) => void;
  onError: (message: string) => void;
}

const createProductLine = (product: Product): PosLine => {
  const price = getProductPrice(product);
  const unit = product.baseUnit;

  return {
    id: randomId(),
    productId: product.id,
    productSnapshot: { id: product.id, code: product.code, name: product.name },
    product,
    unitId: product.baseUnitId,
    unit: unit || null,
    unitSnapshot: unit ? { id: unit.id, name: unit.name } : null,
    conversionRateAtTime: 1,
    quantity: 1,
    unitPrice: price,
    subTotal: price,
  };
};

const incrementLine = (line: PosLine): PosLine => {
  const quantity = Number(line.quantity || 0) + 1;
  return { ...line, quantity, subTotal: quantity * Number(line.unitPrice || 0) };
};

export const usePosProductActions = ({
  type,
  activeOrder,
  isSaleReturn,
  isReadOnlyReturn,
  returnLines,
  exchangeLines,
  updateLines,
  updateExchangeLines,
  onError,
}: Options) => {
  const addProduct = useCallback(
    (product: Product) => {
      if (!activeOrder || isReadOnlyReturn) return;

      if (isSaleReturn && activeOrder.refOrderId) {
        const sourceLine = returnLines.find((line) => line.productId === product.id);
        const max = Number(sourceLine?.maxReturnQuantity ?? 0);
        if (!sourceLine || max <= 0) {
          onError("Sản phẩm không nằm trong hóa đơn gốc hoặc đã hoàn đủ số lượng");
          return;
        }
        if (Number(sourceLine.quantity || 0) >= max) {
          onError("Số lượng hoàn không được vượt quá số lượng đã bán");
          return;
        }
        updateLines(returnLines.map((line) =>
          line.id === sourceLine.id ? incrementLine(line) : line,
        ));
        return;
      }

      const targetLines = type === OrderType.SALE ? exchangeLines : returnLines;
      const found = targetLines.find(
        (line) => line.productId === product.id && line.unitId === product.baseUnitId,
      );
      if (found) {
        const nextLines = targetLines.map((line) =>
          line.id === found.id ? incrementLine(line) : line,
        );
        (type === OrderType.SALE ? updateExchangeLines : updateLines)(nextLines);
        return;
      }

      const line = createProductLine(product);
      (type === OrderType.SALE ? updateExchangeLines : updateLines)([line, ...targetLines]);
    },
    [
      activeOrder,
      exchangeLines,
      isReadOnlyReturn,
      isSaleReturn,
      onError,
      returnLines,
      type,
      updateExchangeLines,
      updateLines,
    ],
  );

  const addExchangeProduct = useCallback(
    (product: Product) => {
      if (!isSaleReturn || isReadOnlyReturn) return;
      const found = exchangeLines.find(
        (line) => line.productId === product.id && line.unitId === product.baseUnitId,
      );
      if (found) {
        updateExchangeLines(exchangeLines.map((line) =>
          line.id === found.id ? incrementLine(line) : line,
        ));
        return;
      }
      updateExchangeLines([createProductLine(product), ...exchangeLines]);
    },
    [exchangeLines, isReadOnlyReturn, isSaleReturn, updateExchangeLines],
  );

  return { addProduct, addExchangeProduct };
};
