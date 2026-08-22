interface TopShadowProps {
  children?: React.ReactNode;
  className?: string;
  color?: string;
}

const TopShadow: React.FC<TopShadowProps> = ({ children, className, color = "#f8f9fd" }) => {
  return (
    <div
      className={`sticky top-[-0.5px] z-10  flex items-center justify-between pt-3
          bg-gradient-to-t from-[#f8f9fd0A] to-[#f8f9fd] ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default TopShadow;
