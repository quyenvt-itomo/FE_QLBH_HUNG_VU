import { Rule } from "antd/es/form";

export const phoneRule = {
  pattern: /^\d{8,12}$/,
  message: "Số điện thoại phải gồm từ 8 đến 12 chữ số",
};

export const taxCodeRule = {
  pattern: /^\d{10,13}$/,
  message: "Mã số thuế phải gồm từ 10 đến 13 chữ số",
};

export const emailRule = {
  type: "email" as const,
  message: "Email không hợp lệ",
};

export const getPhoneRules = (required?: boolean): Rule[] => {
  const phoneRules: Rule[] = [phoneRule];
  if (required) {
    phoneRules.unshift({
      required: true,
      message: "Vui lòng nhập số điện thoại",
    });
  }
  return phoneRules;
};

export const getTaxCodeRules = (required?: boolean): Rule[] => {
  const rules: Rule[] = [taxCodeRule];
  if (required) {
    rules.unshift({
      required: true,
      message: "Vui lòng nhập mã số thuế",
    });
  }
  return rules;
};

export const getEmailRules = (required?: boolean): Rule[] => {
  const rules: Rule[] = [emailRule];
  if (required) {
    rules.unshift({
      required: true,
      message: "Vui lòng nhập email",
    });
  }
  return rules;
};
