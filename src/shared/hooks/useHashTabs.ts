import { useEffect, useState } from "react";

export const useHashTabs = <T = any>({
  items,
}: {
  items: {
    key: T;
    label: React.ReactNode;
  }[];
}) => {
  const [activeTab, setActiveTab] = useState<T | undefined>();

  useEffect(() => {
    if (activeTab || !items.length) return;

    const hash = window.location.hash.replace("#", "");
    const isValid = items.some((item) => item.key === hash);

    if (isValid) {
      setActiveTab(hash as T);
    } else {
      const defaultKey = items[0].key;
      setActiveTab(defaultKey);
      window.history.replaceState(null, "", `#${defaultKey}`);
    }
  }, [activeTab, items]);

  const onTabChange = (key: T) => {
    setActiveTab(key);
    window.history.replaceState(null, "", `#${key}`);
  };

  return {
    activeTab,
    onTabChange,
    setActiveTab, // optional nếu muốn control ngoài
  };
};
