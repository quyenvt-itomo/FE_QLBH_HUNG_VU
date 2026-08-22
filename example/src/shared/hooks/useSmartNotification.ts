import { App } from "antd";
import { useRef } from "react";
import { normalizeNoticeKey } from "@/shared/utils/search.util";

const useSmartNotification = () => {
  const { notification } = App.useApp();
  const cacheRef = useRef<Record<string, boolean>>({});

  const notify = (
    type: "success" | "error" | "info" | "warning",
    message: string,
    key?: string,
  ) => {
    const rawKey = key || message;
    const normalizedKey = normalizeNoticeKey(rawKey);
    const customClass = `notify-${normalizedKey}`;

    if (cacheRef.current[rawKey]) {
      const noticeEl = document.querySelector(`.ant-notification-notice.${customClass}`);

      const container = noticeEl?.closest(".ant-notification");

      if (container instanceof HTMLElement) {
        container.classList.remove("shake");
        void container.offsetWidth; // Trigger reflow
        container.classList.add("shake");
      }
    } else {
      cacheRef.current[rawKey] = true;
    }

    notification.open({
      message,
      key: rawKey,
      className: customClass,
      duration: 3,
      type,
    });
  };

  return { notify };
};

export default useSmartNotification;
