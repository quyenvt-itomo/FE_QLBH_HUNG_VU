import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnalysisTab,
  AnalysisTabGroup,
  analysisTabGroups,
  AnalysisSection,
} from "../analysis.navigation";

interface TabBarProps {
  section: AnalysisSection;
  tabActive: string;
  onTabChange: (tab: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ section, tabActive, onTabChange }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleTabClick = (group: AnalysisTabGroup, tab: AnalysisTab) => {
    if (group.key === section) {
      onTabChange(tab.key);
      return;
    }

    navigate(`${group.path}#${tab.key}`);
  };

  const handleSectionClick = (group: AnalysisTabGroup) => {
    const firstTab = group.tabs[0];
    if (group.key === section) {
      onTabChange(firstTab.key);
      return;
    }

    navigate(`${group.path}#${firstTab.key}`);
  };

  return (
    <div
      className={`sticky top-0 flex h-fit min-h-[calc(100vh-80px)] flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all ease-in-out ${collapsed ? "w-14" : "w-60"}`}
    >
      <div
        className={`flex h-14 items-center ${collapsed ? "justify-center" : "justify-between"} border-b border-slate-100 px-3 gap-3`}
      >
        {!collapsed && (
          <span className="text-sm font-semibold text-slate-800 block truncate flex-1">
            Phân tích
          </span>
        )}
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Mở rộng menu phân tích" : "Thu gọn menu phân tích"}
        >
          <Icon icon={collapsed ? "mdi:chevron-right" : "mdi:chevron-left"} className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 p-2 pb-8">
        {analysisTabGroups.map((group) => {
          const isCurrentSection = group.key === section;

          return (
            <div key={group.key}>
              <button
                type="button"
                className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition ${
                  isCurrentSection ? "text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => handleSectionClick(group)}
                title={collapsed ? group.label : undefined}
              >
                <Icon icon={group.icon} className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <span className="min-w-0 flex-1 truncate font-medium">{group.label}</span>
                )}
                {!collapsed && <Icon icon="mdi:chevron-down" className="h-4 w-4 shrink-0" />}
              </button>

              {!collapsed && (
                <div className="ml-7 space-y-1">
                  {group.tabs.map((tab) => {
                    const isActive = isCurrentSection && tab.key === tabActive;

                    return (
                      <button
                        key={`${group.key}-${tab.key}`}
                        type="button"
                        className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                          isActive
                            ? "bg-blue-50 font-medium text-blue-600"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                        onClick={() => handleTabClick(group, tab)}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
