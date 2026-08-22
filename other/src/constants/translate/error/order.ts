export const purchase = {
  add: {
    payment: {
      fundId: {
        required: "Vui lòng chọn quỹ thực hiện",
        insufficient_balance: "Số dư quỹ không đủ để thanh toán",
      },
    },
  },
};
export const purchaseLine = {};
export const sale = {
  add: {
    quantity: {
      max: "Sản phẩm không tủ tồn kho để bán",
    },
    paymentAmount: {
      max: "Số tiền thanh toán không được lớn hơn tổng tiền đơn hàng",
    },
  },
  update: {
    quantity: {
      max: "Sản phẩm không tủ tồn kho để bán",
    },
  },
};
export const saleLine = {
  add: {
    quantity: {
      max: "Sản phẩm không tủ tồn kho để bán",
    },
  },
  update: {
    quantity: {
      max: "Sản phẩm không tủ tồn kho để bán",
    },
  },
};
export const saleReturn = {
  add: {
    quantity: {
      max: "Số lượng vượt quá số lượng trong đơn bán hàng",
    },
    payment: {
      fundId: {
        required: "Vui lòng chọn quỹ thực hiện",
        insufficient_balance: "Số dư quỹ không đủ để thanh toán",
      },
    },
  },
  update: {
    quantity: {
      max: "Số lượng vượt quá số lượng trong đơn bán hàng",
    },
  },
};
export const saleReturnLine = {
  add: {
    quantity: {
      max: "Số lượng vượt quá số lượng trong đơn bán hàng",
    },
  },
  update: {
    quantity: {
      max: "Số lượng vượt quá số lượng trong đơn bán hàng",
    },
  },
};
export const purchaseReturn = {
  add: {
    quantity: {
      max: "Số lượng vượt quá số lượng trong đơn nhập hàng",
    },
  },
  update: {
    quantity: {
      max: "Số lượng vượt quá số lượng trong đơn nhập hàng",
    },
  },
};
export const purchaseReturnLine = {
  add: {
    quantity: {
      max: "Số lượng vượt quá số lượng trong đơn nhập hàng",
    },
  },
  update: {
    quantity: {
      max: "Số lượng vượt quá số lượng trong đơn nhập hàng",
    },
  },
};
