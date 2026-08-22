import { Card } from "antd";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Panel: React.FC<PanelProps> = ({
  title,
  children,
  className = "h-[calc(100%-44px)]",
  ...rest
}) => {
  return (
    <Card className={className} classNames={{ body: "flex flex-col !p-0 h-full" }} {...rest}>
      {children}
    </Card>
  );
};
