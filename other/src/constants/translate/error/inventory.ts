export const inventoryAdjustment = {};

export const inventoryAdjustmentLine = {};
export const storeTransfer = {};

export const storeTransferLine = {
  add: {
    max: "Không đủ hàng trong kho để chuyển.",
  },
  update: {
    quantity: { insufficient_stock: "Không đủ hàng trong kho." },
  },
};
