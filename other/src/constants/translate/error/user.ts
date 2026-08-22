export const user = {
  get: {
    id: {
      not_found: "Không tìm thấy người dùng",
    },
  },
  add: {
    code: {
      exists: "Mã người dùng đã tồn tại.",
    },
    email: {
      exists: "Email đã được sự dụng.",
    },
    username: {
      exists: "Tên đăng nhập đã tồn tại.",
    },
    phone: {
      exists: "Số điện thoại đã được sử dụng.",
    },
  },
  update: {
    code: {
      exists: "Mã người dùng đã tồn tại.",
    },
    email: {
      exists: "Email đã được sự dụng.",
    },
    username: {
      exists: "Tên đăng nhập đã tồn tại.",
    },
    phone: {
      exists: "Số điện thoại đã được sử dụng.",
    },
  },
};
