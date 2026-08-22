import { useGlobalData } from "@/shared/hooks/useGlobalData";
import React, { useState } from "react";

const ThemeToggle: React.FC = () => {
  const { themeMode, handleSetThemeMode } = useGlobalData();
  const [animated, setAnimated] = useState(false);

  const applyTheme = (mode: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", mode);

    if (mode === "dark") {
      document.body.classList.add("darkmode");
    } else {
      document.body.classList.remove("darkmode");
    }

    localStorage.setItem("theme", mode);
  };

  const handleToggle = () => {
    const newTheme = themeMode === "light" ? "dark" : "light";

    setAnimated(true);
    handleSetThemeMode(newTheme);
    applyTheme(newTheme);

    setTimeout(() => setAnimated(false), 500);
  };

  return (
    <div
      onClick={handleToggle}
      className="
        relative
        w-[60px] h-[32px]
        rounded-full
        p-[2px]
        cursor-pointer
        transition-all duration-300
        bg-gray-200 dark:bg-gray-700
        shadow-inner
      "
    >
      {/* Indicator */}
      <div
        className={`
          absolute top-[2px]
          w-[28px] h-[28px]
          rounded-full
          flex items-center justify-center
          bg-panel dark:bg-black
          shadow-md
          transition-transform duration-300
          ${themeMode === "dark" ? "translate-x-[28px]" : "translate-x-0"}
        `}
      >
        <span
          className={`
            text-xs
            transition-transform duration-500
            ${animated ? "rotate-180" : ""}
          `}
        >
          {themeMode === "light" ? "☀️" : "🌙"}
        </span>
      </div>
    </div>
  );
};

export default ThemeToggle;
