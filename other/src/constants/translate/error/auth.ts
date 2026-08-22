export const auth = {
  add: {
    email: {
      invalid: "Email không hợp lệ",
      not_register: "Không tìm thấy tài khoản",
      not_found: "Không tìm thấy tài khoản với email này",
      exists: "Email đã được sử dụng",
    },
    identifier: {
      exists: "Tên đăng nhập đã được sử dụng",
      not_found: "Không tìm thấy tài khoản với tên đăng nhập này",
    },
    password: {
      min_length: "Mật khẩu phải dài hơn 6 ký tự",
      incorrect: "Mật khẩu không chính xác",
    },
    otp: { incorrect: "Mã OTP không chính xác" },
  },
  update: {
    oldPassword: {
      incorrect: "Mật khẩu hiện tại không chính xác",
    },
  },
};
