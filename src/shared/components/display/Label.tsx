export const Label: React.FC<{
  title?: string;
  required?: boolean;
  width?: number;
  height?: number;
  bold?: boolean;
  subtitle?: string;
  style?: React.CSSProperties;
  className?: string;
}> = ({ title, required, className, style, height = 32, width = 144, bold, subtitle }) => {
  return (
    <span
      className={`flex items-center flex-shrink-0 ${className || ""}`}
      style={{
        ...style,
        height,
        width,
        fontWeight: bold ? 600 : undefined,
      }}
      title={subtitle}
    >
      {title} {required && <span className="required">*</span>}
    </span>
  );
};
