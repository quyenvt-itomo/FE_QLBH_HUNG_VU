interface EntityInfoProps {
  title?: string | null;
  subTitle?: string | null;
  onClick?: () => void;
}

export const EntityInfo: React.FC<EntityInfoProps> = ({ title, subTitle, onClick }) => {
  if (!title && !subTitle) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <span
        className={`leading-4 ${onClick ? "text-blue-600 font-medium font-mono hover:underline cursor-pointer" : ""}`}
        onClick={onClick}
      >
        {title || ""}
      </span>

      <span className="text-xs text-slate-400 leading-3">{subTitle || ""}</span>
    </div>
  );
};
