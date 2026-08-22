export const EmailButton: React.FC<{ email?: string | null }> = ({ email }) => {
  if (!email) return null;

  return (
    <button
      className="
            truncate border-slate-200 border bg-white
            dark:bg-slate-800 dark:border-slate-700
            px-3 rounded-lg text-blue-500"
      onClick={(e) => {
        e.stopPropagation();
        window.location.href = `mailto:${email}`;
      }}
    >
      {email}
    </button>
  );
};
