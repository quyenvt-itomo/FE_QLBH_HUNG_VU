const HeaderTooltip: React.FC<{
  title: string;
  required?: boolean;
}> = ({ title, required }) => {
  return (
    <div className="flex items-center w-fit">
      <span className="ellipsis-cell">
        {title} {required && <span className="required">*</span>}
      </span>
    </div>
  );
};

export { HeaderTooltip };
