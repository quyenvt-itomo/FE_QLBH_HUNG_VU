export const WebsiteButton: React.FC<{ website?: string | null }> = ({ website }) => {
  if (!website) return null;

  return (
    <button
      type="button"
      className="
            truncate border-slate-200 border bg-white 
            dark:bg-slate-800 dark:border-slate-700
            px-3 rounded-lg text-blue-500"
      onClick={(e) => {
        e.stopPropagation();
        window.open(website, "_blank");
      }}
    >
      {website}
    </button>
  );
};
