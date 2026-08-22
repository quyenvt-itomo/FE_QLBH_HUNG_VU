export const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export const normalizeNoticeKey = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
    .replace(/[^a-zA-Z0-9\s]/g, "") // Loại bỏ ký tự đặc biệt
    .replace(/\s+/g, "-") // Khoảng trắng => dấu gạch ngang
    .toLowerCase();
};
