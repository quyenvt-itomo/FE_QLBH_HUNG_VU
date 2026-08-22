import { TagSize, TagStyleValue } from "../interfaces/common";

export const COLORS = {
  PRIMARY: "#16A34A",
  SECONDARY: "#747E76",
  ERROR: "#FF0000",
  BACKGROUND: "#F3F7F4",
  TEXT: "#333333",

  BLACK: "#16151C",

  // side bar
  // SIDEBAR_BG: "#C4DAEB",
  SIDEBAR_BG: "#0B2B1C",

  BORDER: "#CCC",

  ORANGE: "#FF5400",
};

export const FONT_SIZES = {
  SMALL: ".75rem",
  MEDIUM: "1rem",
  LARGE: "1.125rem",
};

export const TAG_COLORS = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

export const CSS = {
  container: {
    // padding: "20px",
    border: ".5px solid #EAEAEA",
    borderRadius: "8px",
    backgroundColor: "#FFF",
  },
  center_column: {
    onHeaderCell: () => ({
      style: {
        position: "relative",
        textAlign: "center",
        borderRightWidth: 0.5,
        borderStyle: "solid",
        borderColor: "#EAEAEA",
      },
    }),
    ellipsis: true,
  },
};

export const CLASSNAME = {
  table: `
    table-h-full
    no-radius-table
    table-custom-row
    `,
  detailTable: `
    table-h-full
    no-radius-table
    table-custom-row
    detail-table
    highlight-table
    `,
  inputHeight: "h-8",
};

export const HEIGHT = {
  input: 32,
};

export const tagSizeStyleMap: Record<TagSize, string> = {
  sm: "rounded px-1.5 pt-0.5 pb-px text-[10px]",
  md: "rounded-md px-2 py-0.5 text-[11px]",
  lg: "rounded-lg px-3  pt-1 pb-[3px] text-[12px]",
};

/** Các màu Tailwind được hỗ trợ trong tagStyle() */
export type TagColor = keyof typeof _TAG_STYLES;

/**
 * Static lookup map — full string literal để Tailwind JIT scan được.
 * @internal Dùng qua hàm `tagStyle(color)` thay vì truy cập trực tiếp.
 */
const _TAG_STYLES = {
  amber: {
    default: "bg-amber-100/50 text-amber-700 border-amber-200",
    outline: "bg-amber-400/10 text-amber-200 border-amber-300/30 backdrop-blur-sm",
    solid: "bg-amber-600 text-white border-amber-600",
  },
  blue: {
    default: "bg-blue-100/50 text-blue-700 border-blue-200",
    outline: "bg-blue-400/10 text-blue-200 border-blue-300/30 backdrop-blur-sm",
    solid: "bg-blue-600 text-white border-blue-600",
  },
  cyan: {
    default: "bg-cyan-100/50 text-cyan-700 border-cyan-200",
    outline: "bg-cyan-400/10 text-cyan-200 border-cyan-300/30 backdrop-blur-sm",
    solid: "bg-cyan-600 text-white border-cyan-600",
  },
  emerald: {
    default: "bg-emerald-100/50 text-emerald-700 border-emerald-200",
    outline: "bg-emerald-400/10 text-emerald-200 border-emerald-300/30 backdrop-blur-sm",
    solid: "bg-emerald-600 text-white border-emerald-600",
  },
  gray: {
    default: "bg-gray-100/50 text-gray-700 border-gray-200",
    outline: "bg-gray-400/10 text-gray-200 border-gray-300/30 backdrop-blur-sm",
    solid: "bg-gray-600 text-white border-gray-600",
  },
  geekblue: {
    default: "bg-indigo-100/50 text-indigo-700 border-indigo-200",
    outline: "bg-indigo-400/10 text-indigo-200 border-indigo-300/30 backdrop-blur-sm",
    solid: "bg-indigo-600 text-white border-indigo-600",
  },
  green: {
    default: "bg-green-100/50 text-green-700 border-green-200",
    outline: "bg-green-400/10 text-green-200 border-green-300/30 backdrop-blur-sm",
    solid: "bg-green-600 text-white border-green-600",
  },
  lime: {
    default: "bg-lime-100/50 text-lime-700 border-lime-200",
    outline: "bg-lime-400/10 text-lime-200 border-lime-300/30 backdrop-blur-sm",
    solid: "bg-lime-600 text-white border-lime-600",
  },
  orange: {
    default: "bg-orange-100/50 text-orange-700 border-orange-200",
    outline: "bg-orange-400/10 text-orange-200 border-orange-300/30 backdrop-blur-sm",
    solid: "bg-orange-600 text-white border-orange-600",
  },
  purple: {
    default: "bg-purple-100/50 text-purple-700 border-purple-200",
    outline: "bg-purple-400/10 text-purple-200 border-purple-300/30 backdrop-blur-sm",
    solid: "bg-purple-600 text-white border-purple-600",
  },
  red: {
    default: "bg-red-100/50 text-red-700 border-red-200",
    outline: "bg-red-400/10 text-red-200 border-red-300/30 backdrop-blur-sm",
    solid: "bg-red-600 text-white border-red-600",
  },
  rose: {
    default: "bg-rose-100/50 text-rose-700 border-rose-200",
    outline: "bg-rose-400/10 text-rose-200 border-rose-300/30 backdrop-blur-sm",
    solid: "bg-rose-600 text-white border-rose-600",
  },
  teal: {
    default: "bg-teal-100/50 text-teal-700 border-teal-200",
    outline: "bg-teal-400/10 text-teal-200 border-teal-300/30 backdrop-blur-sm",
    solid: "bg-teal-600 text-white border-teal-600",
  },
  yellow: {
    default: "bg-yellow-100/50 text-yellow-700 border-yellow-200",
    outline: "bg-yellow-400/10 text-yellow-200 border-yellow-300/30 backdrop-blur-sm",
    solid: "bg-yellow-600 text-white border-yellow-600",
  },
} as const satisfies Record<string, TagStyleValue>;

/**
 * Tra cứu Tag style theo tên màu Tailwind.
 * Dùng full string literal nên Tailwind JIT scan được, IntelliSense hiển thị ô màu.
 *
 * @example tagStyle("blue") → { default: "bg-blue-100 text-blue-700 ...", ... }
 */
export function tagStyle(color: TagColor): TagStyleValue {
  return _TAG_STYLES[color];
}

export function textColorStyle(value: number): string {
  let className = "";
  if (value > 0) className = "text-green-600";
  else if (value < 0) className = "text-red-600";
  return className;
}
