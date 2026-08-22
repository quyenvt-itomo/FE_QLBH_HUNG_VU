import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export const EmptyCell: React.FC = () => <span className="text-slate-400">--</span>;

export const Colgroup: React.FC<{
  styles?: (number | React.CSSProperties)[];
}> = ({ styles }) => {
  return (
    <colgroup>
      {styles?.map((style, idx) => (
        <col key={idx} style={typeof style === "number" ? { width: style } : style} />
      ))}
    </colgroup>
  );
};

const textAlignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};
export const TableHeader: React.FC<{
  columns: {
    title: string;
    width?: number | string;
    align?: "left" | "center" | "right";
    className?: string;
    style?: React.CSSProperties;
  }[];
}> = ({ columns }) => {
  return (
    <thead>
      <tr className="border-b bg-slate-100 dark:bg-slate-800">
        {columns.map((col, idx) => (
          <th
            key={idx}
            className={`px-2 py-1.5 font-semibold text-slate-600 dark:text-slate-300 ${textAlignMap[col.align || "left"]} ${col.className || ""}`}
            style={{ width: col.width, ...col.style }}
          >
            {col.title}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export const TableDataCell: React.FC<{
  children?: React.ReactNode | null;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className, style }) => {
  return (
    <td className={`px-2 py-1.5 ${className || ""}`} style={style}>
      {children || <EmptyCell />}
    </td>
  );
};

export const TableBooleanCell: React.FC<{
  value?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({ value, className, style }) => {
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className || ""}`}
      style={style}
    >
      {value && <CheckBadgeIcon className="w-5 h-5 text-green-500 dark:text-green-400" />}
    </div>
  );
};
