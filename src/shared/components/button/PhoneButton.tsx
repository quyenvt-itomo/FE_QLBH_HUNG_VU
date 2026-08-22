export const PhoneButton: React.FC<{ phone?: string | null }> = ({ phone }) => {
  if (!phone) return null;

  return (
    <button
      type="button"
      className="
            truncate border-slate-200 border bg-white 
            dark:bg-slate-800 dark:border-slate-700
            px-3 rounded-lg text-blue-500"
      onClick={(e) => {
        e.stopPropagation();
        window.location.href = `tel:${phone}`;
      }}
    >
      {phone}
    </button>
  );
};
