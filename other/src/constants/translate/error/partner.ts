export const partner = {};
export const customer = {
  get: {
    id: {
      not_found: "Không tìm thấy khách hàng",
    },
  },
  add: {
    email: {
      exists: "Email đã được sử dụng.",
    },
    phone: {
      exists: "Số điện thoại đã được sử dụng.",
    },
  },
  update: {
    email: {
      exists: "Email đã được sử dụng.",
    },
    phone: {
      exists: "Số điện thoại đã được sử dụng.",
    },
  },
};
export const supplier = {
  get: {
    id: {
      not_found: "Không tìm thấy nhà cung cấp",
    },
  },
};
export const customerContact = {};
export const supplierContact = {
  get: {
    id: {
      not_found: "Không tìm thấy nhà cung cấp",
    },
  },
};
export const customerSubType = {};
export const supplierSubType = {};
