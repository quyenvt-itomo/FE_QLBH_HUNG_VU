import { IconRechartSurface } from "../icon/RechartSurface";

interface CustomLegendProps {
  title: string;
  color?: string;
}

export const CustomLegend: React.FC<CustomLegendProps> = ({
  title,
  color = "#323832",
}) => {
  return (
    <li
      className="recharts-legend-item legend-item-0"
      style={{
        display: "inline-block",
        marginRight: 10,
      }}
    >
      <IconRechartSurface color={color} />
      <span
        className="recharts-legend-item-text"
        style={{
          color,
        }}
      >
        {title}
      </span>
    </li>
  );
};
