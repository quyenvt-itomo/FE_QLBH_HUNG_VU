interface FormSectionProps {
  title?: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 h-6 items-center pr-6">
        <div className="h-full flex w-1 rounded-full bg-primary"></div>
        <h1 className="font-semibold min-w-[154px]">{title}</h1>
        {subtitle}
      </div>
      <div className="flex flex-col w-full mt-3 mb-2 px-6">{children}</div>
    </div>
  );
};
