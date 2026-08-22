import { PurchaseLine } from "./purchaseLine.model";

export const collectPurchaseLine = <
  T extends {
    purchaseLine?: PurchaseLine | null;
  },
>(
  lines: T[],
): PurchaseLine[] => {
  return lines
    .map((l) => l.purchaseLine)
    .filter((p): p is PurchaseLine => !!p?.id) as unknown as PurchaseLine[];
};
