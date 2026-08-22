const Label: React.FC<{
  title: string;
  required?: boolean;
  width?: number;
  height?: number;
  bold?: boolean;
  subtitle?: string;
}> = ({ title, required, height = 32, width = 144, bold, subtitle }) => {
  return (
    <span
      className="flex items-center flex-shrink-0"
      style={{
        height,
        width,
        fontWeight: bold ? 400 : undefined,
      }}
      title={subtitle}
    >
      {title} {required && <span className="required">*</span>}
    </span>
  );
};

export default Label;
