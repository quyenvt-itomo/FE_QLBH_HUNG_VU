import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { DEFAULT_ERROR } from "./constants/enum";

i18n
  .use(Backend) // Load file JSON
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ
  .use(initReactI18next) // Kết nối với React
  .init({
    fallbackLng: "vn", // Ngôn ngữ mặc định
    // debug: true, // Bật log để debug

    interpolation: {
      escapeValue: false, // Không escape HTML (nếu cần)
    },
    supportedLngs: ["vn", "cn"], // Chỉ hỗ trợ VN & CN
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Đường dẫn đến file JSON
    },
    detection: {
      order: ["localStorage", "navigator"], // Ưu tiên lấy từ localStorage, nếu không thì lấy từ trình duyệt
      caches: ["localStorage"], // Lưu ngôn ngữ vào localStorage
    },
    parseMissingKeyHandler: (key: string) => {
      if (key.includes("ERROR")) {
        return DEFAULT_ERROR;
      }
      return key;
    },
  });

export default i18n;
