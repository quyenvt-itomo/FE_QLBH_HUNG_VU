import { useAppMessage } from "@/shared/hooks/useAppMessage";

export const ZaloButton: React.FC<{ zaloLink?: string | null }> = ({ zaloLink }) => {
  const { message } = useAppMessage();
  if (!zaloLink) return null;

  return (
    <button
      type="button"
      className="
        truncate border-slate-200 dark:border-slate-800 border bg-panel 
        px-3 rounded-lg text-blue-500
      "
      onClick={(e) => {
        e.stopPropagation();

        const stringValue = String(zaloLink || "").trim();

        // URL zalo hợp lệ
        const isZaloUrl = stringValue.includes("zalo.me") || stringValue.includes("zaloapp.com");

        // số điện thoại VN cơ bản
        const isPhone = /^(0|\+84)\d{9,10}$/.test(stringValue);

        let finalUrl: string | null = null;

        if (isZaloUrl) {
          finalUrl = stringValue;
        } else if (isPhone) {
          // chuyển +84 -> 84 cho đúng format zalo.me
          const phone = stringValue.replace(/^\+/, "");

          finalUrl = `https://zalo.me/${phone}`;
        }

        if (finalUrl) {
          window.open(finalUrl, "_blank");
        } else {
          message.error("Liên kết Zalo không hợp lệ");
        }
      }}
    >
      {zaloLink}
    </button>
  );
};
