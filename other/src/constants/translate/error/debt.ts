export const debtAdjustment = {};
export const debtOffset = {
  add: {
    code: {
      exists: "Số phiếu đã tồn tại.",
    },
    offsetAmount: {
      max: "Không được lớn hơn số tiền nợ phải thu hoặc phải trả",
    },
    partnerId: {
      not_found: "Đối tác không tồn tại hoặc đã bị xóa.",
    },
    offsetById: {
      not_found: "Người thực hiện không tồn tại hoặc đã bị xóa.",
    },
  },
  update: {
    code: {
      exists: "Số phiếu đã tồn tại.",
    },
    offsetAmount: {
      max: "Không được lớn hơn số tiền nợ phải thu hoặc phải trả",
    },
    partnerId: {
      not_found: "Đối tác không tồn tại hoặc đã bị xóa.",
    },
    offsetById: {
      not_found: "Người thực hiện không tồn tại hoặc đã bị xóa.",
    },
  },
};
