import { useCallback } from "react";

import type { Product } from "@/modules/product/product.model";
import { collectUnits, getDefaultPricePerUnit } from "@/modules/product/product.util";
import type { PosLine } from "../components/OrderLineTable";

interface Options {
  isSaleReturn: boolean;
  isReadOnlyReturn: boolean;
  lines: PosLine[];
  exchangeLines: PosLine[];
  updateLines: (lines: PosLine[]) => void;
  updateExchangeLines: (lines: PosLine[]) => void;
  onError: (message: string) => void;
}

export const usePosLineActions = ({
  isSaleReturn,
  isReadOnlyReturn,
  lines,
  exchangeLines,
  updateLines,
  updateExchangeLines,
  onError,
}: Options) => {
  const updateQuantity = useCallback(
    (lineId: string, quantity: number | null) => {
      if (isReadOnlyReturn) return;
      if (!quantity || quantity <= 0) {
        if (isSaleReturn) {
          updateLines(
            lines.map((line) =>
              line.id === lineId ? { ...line, quantity: 0, subTotal: 0 } : line,
            ),
          );
        } else {
          updateLines(lines.filter((line) => line.id !== lineId));
        }
        return;
      }

      const target = lines.find((line) => line.id === lineId);
      const max = Number(target?.maxReturnQuantity ?? Number.POSITIVE_INFINITY);
      if (isSaleReturn && quantity > max) {
        onError("Số lượng hoàn không được vượt quá số lượng có thể hoàn");
        quantity = max;
      }
      updateLines(
        lines.map((line) =>
          line.id === lineId
            ? { ...line, quantity, subTotal: quantity * Number(line.unitPrice || 0) }
            : line,
        ),
      );
    },
    [isReadOnlyReturn, isSaleReturn, lines, onError, updateLines],
  );

  const updateUnitPrice = useCallback(
    (lineId: string, unitPrice: number | null) => {
      if (isReadOnlyReturn) return;
      const nextUnitPrice = Math.max(0, Number(unitPrice || 0));
      updateLines(
        lines.map((line) =>
          line.id === lineId
            ? {
                ...line,
                unitPrice: nextUnitPrice,
                subTotal: Number(line.quantity || 0) * nextUnitPrice,
              }
            : line,
        ),
      );
    },
    [isReadOnlyReturn, lines, updateLines],
  );

  const updateExchangeQuantity = useCallback(
    (lineId: string, quantity: number | null) => {
      if (isReadOnlyReturn) return;
      if (!quantity || quantity <= 0) {
        updateExchangeLines(exchangeLines.filter((line) => line.id !== lineId));
        return;
      }
      updateExchangeLines(
        exchangeLines.map((line) =>
          line.id === lineId
            ? { ...line, quantity, subTotal: quantity * Number(line.unitPrice || 0) }
            : line,
        ),
      );
    },
    [exchangeLines, isReadOnlyReturn, updateExchangeLines],
  );

  const updateExchangeUnitPrice = useCallback(
    (lineId: string, unitPrice: number | null) => {
      if (isReadOnlyReturn) return;
      const value = Math.max(0, Number(unitPrice || 0));
      updateExchangeLines(
        exchangeLines.map((line) =>
          line.id === lineId
            ? { ...line, unitPrice: value, subTotal: Number(line.quantity || 0) * value }
            : line,
        ),
      );
    },
    [exchangeLines, isReadOnlyReturn, updateExchangeLines],
  );

  const updateUnit = useCallback(
    (lineId: string, unitId: string) => {
      if (isReadOnlyReturn) return;
      const line = lines.find((item) => item.id === lineId);
      const product = line?.product as Product | undefined;
      if (!line || !product || !unitId) return;

      const unit = collectUnits(product, line.unit || line.unitSnapshot).find(
        (item) => item.id === unitId,
      );
      if (!unit) return;

      const extraUnit = product.extraUnits?.find((item) => item.unitId === unitId);
      const conversionRateAtTime =
        unitId === product.baseUnitId ? 1 : Number(extraUnit?.conversionRate || 1);
      const unitPrice = Number(getDefaultPricePerUnit(product, unitId) ?? line.unitPrice ?? 0);

      updateLines(
        lines.map((item) =>
          item.id === lineId
            ? {
                ...item,
                unitId,
                unit,
                unitSnapshot: { id: unit.id, name: unit.name },
                conversionRateAtTime,
                unitPrice,
                subTotal: Number(item.quantity || 0) * unitPrice,
              }
            : item,
        ),
      );
    },
    [isReadOnlyReturn, lines, updateLines],
  );

  const updateExchangeUnit = useCallback(
    (lineId: string, unitId: string) => {
      if (isReadOnlyReturn) return;
      const line = exchangeLines.find((item) => item.id === lineId);
      const product = line?.product as Product | undefined;
      if (!line || !product || !unitId) return;
      const unit = collectUnits(product, line.unit || line.unitSnapshot).find(
        (item) => item.id === unitId,
      );
      if (!unit) return;
      const extraUnit = product.extraUnits?.find((item) => item.unitId === unitId);
      const conversionRateAtTime =
        unitId === product.baseUnitId ? 1 : Number(extraUnit?.conversionRate || 1);
      const unitPrice = Number(getDefaultPricePerUnit(product, unitId) ?? line.unitPrice ?? 0);
      updateExchangeLines(
        exchangeLines.map((item) =>
          item.id === lineId
            ? {
                ...item,
                unitId,
                unit,
                unitSnapshot: { id: unit.id, name: unit.name },
                conversionRateAtTime,
                unitPrice,
                subTotal: Number(item.quantity || 0) * unitPrice,
              }
            : item,
        ),
      );
    },
    [exchangeLines, isReadOnlyReturn, updateExchangeLines],
  );

  return {
    updateQuantity,
    updateUnitPrice,
    updateExchangeQuantity,
    updateExchangeUnitPrice,
    updateUnit,
    updateExchangeUnit,
  };
};
