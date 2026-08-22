import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { formatMoney, formatPercentage, formatQuantity } from "../../../../utils/formatNumber";

interface GrowthCardProps {
  type?: "quantity" | "money" | "percentage";
  value: number;
  label: string;
  growth?: number;
  loading?: boolean;
  warning?: boolean;
  borderLeft?: boolean;
  onClick?: () => void;
}

const DefaultIcon: React.FC<{
  warning?: boolean;
}> = ({ warning = false }) => {
  const className = warning ? "bg-red-500" : "bg-green-500";
  return (
    <div className="flex items-end h-11 gap-[3px]">
      <div
        className={`h-4 w-2.5 rounded opacity-20 hover:opacity-30 transition-all ease-in-out ${className}`}
      ></div>
      <div
        className={`h-6 w-2.5 rounded opacity-20 hover:opacity-30 transition-all ease-in-out ${className}`}
      ></div>
      <div
        className={`h-9 w-2.5 rounded opacity-30 hover:opacity-40  transition-all ease-in-out ${className}`}
      ></div>
      <div
        className={`h-11 w-2.5 rounded opacity-80 hover:opacity-100 transition-all ease-in-out ${className}`}
      ></div>
      <div
        className={`h-[25px] w-2.5 rounded opacity-20 hover:opacity-30 transition-all ease-in-out ${className}`}
      ></div>
      <div
        className={`h-[31px] w-2.5 rounded opacity-40 hover:opacity-50 transition-all ease-in-out ${className}`}
      ></div>
    </div>
  );
};

export const GrowthCard: React.FC<GrowthCardProps> = ({
  type = "quantity",
  value,
  label,
  growth,
  loading,
  warning = false,
  onClick,
  borderLeft = true,
}) => {
  const color = warning
    ? growth && growth >= 0
      ? "text-red-500"
      : "text-green-500"
    : growth && growth >= 0
      ? "text-green-500"
      : "text-red-500";
  const growthContent = growth ? (
    <span className={`text-[10px] flex gap-1 items-center ${color}`}>
      {growth >= 0 ? (
        <ArrowTrendingUpIcon className="h-4" />
      ) : (
        <ArrowTrendingDownIcon className="h-4" />
      )}
      {formatPercentage(growth)}
    </span>
  ) : (
    <span className="text-[10px]">--</span>
  );

  if (loading) {
    return (
      <div
        className="
          flex justify-between items-center bg-white shadow-sm px-6 rounded-md
          animate-pulse
        "
      >
        <div className="flex flex-col gap-1 w-full">
          <div className="h-6 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        flex justify-between items-center bg-white px-6
        cursor-pointer transition-all ease-in-out ${borderLeft ? "border-l" : ""}
        ${onClick ? "cursor-pointer" : ""}
        `}
      onClick={onClick}
    >
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-500">{label}</span>
        <span
          className={`text-base font-bold ${warning && value ? "text-red-500" : "text-gray-800"}`}
        >
          {(type === "quantity"
            ? formatQuantity(value)
            : type === "money"
              ? formatMoney(value)
              : formatPercentage(value)) || "0"}
        </span>
        {growthContent}
      </div>
    </div>
  );
};
