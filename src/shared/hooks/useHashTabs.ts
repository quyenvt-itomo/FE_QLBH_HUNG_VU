import { useEffect, useState } from "react";

interface HashTabItem<T> {
  key: T;
  label: React.ReactNode;
}

interface UseHashTabsProps<T> {
  items: HashTabItem<T>[];
}

const getHash = () => decodeURIComponent(window.location.hash.replace(/^#/, ""));

const replaceHash = (key: unknown) => {
  const url = `${window.location.pathname}${window.location.search}#${String(key)}`;
  window.history.replaceState(null, "", url);
};

export const useHashTabs = <T = string>({ items }: UseHashTabsProps<T>) => {
  const [activeTab, setActiveTab] = useState<T | undefined>();

  useEffect(() => {
    if (!items.length) {
      setActiveTab(undefined);
      return;
    }

    const syncFromHash = () => {
      const hash = getHash();
      const matchedItem = items.find((item) => String(item.key) === hash);

      if (matchedItem) {
        setActiveTab(matchedItem.key);
        return;
      }

      const defaultKey = items[0].key;
      setActiveTab(defaultKey);
      replaceHash(defaultKey);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, [items]);

  const onTabChange = (key: T) => {
    if (!items.some((item) => item.key === key)) return;

    const nextHash = `#${String(key)}`;
    if (window.location.hash !== nextHash) {
      const url = `${window.location.pathname}${window.location.search}${nextHash}`;
      window.history.pushState(null, "", url);
    }
    setActiveTab(key);
  };

  return {
    activeTab,
    onTabChange,
    setActiveTab,
  };
};
