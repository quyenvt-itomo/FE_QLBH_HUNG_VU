interface TitleProps {
  level?: number; // Optional level for heading, default is 1
  content?: string;
  color?: string; // Optional color for the title
  width?: number | string;
  className?: string; // Optional className for additional styling
}

/**
 *
 * @param param0
 * @returns
 */
const Title: React.FC<TitleProps> = ({
  level = 1,
  content = "Tiêu đề",
  color = "",
  width = "fit-content",
  className = "",
}) => {
  const levelMap: Record<number, string> = {
    1: "text-[15px]",
    2: "text-xl",
    3: "text-lg",
    4: "text-base",
    5: "text-sm",
    6: "text-xs",
  };
  return (
    <span
      className={`${levelMap[level]} text-[${color}] truncate font-medium ${className}`}
      style={{ width: typeof width === "number" ? `${width}px` : width }}
    >
      {content}
    </span>
  );
};

export { Title };
