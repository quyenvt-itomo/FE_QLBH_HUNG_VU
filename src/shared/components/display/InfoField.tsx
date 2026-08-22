import React from "react";

export interface InfoFieldProps {
  icon?: React.ReactNode;
  label: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const InfoField: React.FC<InfoFieldProps> = ({
  icon,
  label,
  children,
  fullWidth = false,
  className = "",
}) => (
  <div
    className={`flex items-start gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800 ${fullWidth ? "col-span-2" : ""} ${className}`}
  >
    {icon && <div className="flex-shrink-0 w-5 text-gray-400 mt-0.5">{icon}</div>}
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-400 leading-tight">{label}</p>
      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-0.5">
        {children || <span className="text-gray-300 italic">—</span>}
      </div>
    </div>
  </div>
);
