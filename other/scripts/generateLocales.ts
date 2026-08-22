import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ERROR } from "../src/constants/translate";

// ✅ Lấy __dirname tương tự CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Hàm làm phẳng object
const flattenObject = (obj: any, prefix = ""): Record<string, string> => {
  return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {});
};

// ✅ Hợp nhất và làm phẳng dữ liệu
const translations = flattenObject({ error: ERROR });

// ✅ Xác định thư mục đầu ra
const localesDir = path.join(__dirname, "../public/locales");

// ✅ Kiểm tra thư mục tồn tại, nếu chưa có thì tạo
if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

const filePath = path.join(localesDir, "vn", "translation.json");

// Tạo thư mục nếu chưa có
if (!fs.existsSync(path.dirname(filePath))) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), "utf-8");
console.log(`✔️ Đã tạo: ${filePath}`);

console.log("✨ Hoàn thành việc tạo file JSON!");
