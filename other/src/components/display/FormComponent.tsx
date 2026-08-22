import { formatMoney } from "../../utils/formatNumber";

export const SectionCustom: React.FC<{
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div className={`mb-6 ${className}`}>
    <div className="font-semibold uppercase mb-2">{title}</div>
    {children}
  </div>
);

export const InfoCustom: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div>
    <span className="font-medium">{label}: </span>
    <span>{children}</span>
  </div>
);

export const RowCustom: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
  title?: string;
}> = ({ label, value, highlight = false, title }) => (
  <div
    className={`flex items-center gap-2 py-1 hover:text-primary ${
      highlight ? "font-semibold" : ""
    }`}
  >
    {/* Left text */}
    <span className="whitespace-nowrap">{label}</span>

    {/* Leader dots */}
    <span className="flex-1 border-b border-dotted border-gray-300 translate-y-[2px]" />

    {/* Right value */}
    <span className="whitespace-nowrap" title={title}>
      {value}
    </span>
  </div>
);

export const SummaryRowCustom: React.FC<{
  label: string;
  value?: number | null;
  highlight?: boolean;
  color?: string;
}> = ({ label, value, highlight, color = "" }) => (
  <div
    className={`flex justify-between py-2 ${
      highlight ? "font-semibold text-base border-t mt-2" : ""
    }
    ${color}
    `}
  >
    <span>{label}</span>
    <span>{formatMoney(value)}</span>
  </div>
);
