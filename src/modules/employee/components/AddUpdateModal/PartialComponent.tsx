interface PartialPanelProps {
  id: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const PartialTitle: React.FC<PartialPanelProps> = ({ title, id, className = "" }) => (
  <div
    id={id}
    className={`
  flex justify-center items-center w-full h-9 font-semibold bg-gray-200
  ${className}
  `}
  >
    {title}
  </div>
);

export const PartialPanel: React.FC<PartialPanelProps> = ({
  id,
  title,
  children,
  className = "",
}) => {
  return (
    <>
      <h1 id={id} className="font-semibold mt-4">
        {title}
      </h1>
      <div
        className={`
        grid grid-cols-1 lg:grid-cols-2 w-full gap-x-48 px-2 my-4
        ${className}
        `}
      >
        {children}
      </div>
    </>
  );
};
