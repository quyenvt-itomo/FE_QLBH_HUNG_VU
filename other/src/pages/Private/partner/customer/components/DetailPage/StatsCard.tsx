import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { formatMoney, formatQuantity } from "../../../../../../utils/formatNumber";

interface StatsCardProps {
  type?: "quantity" | "money";
  value: number;
  label: string;
  icon?: React.ReactNode;
  loading?: boolean;
  warning?: boolean;
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

export const StatsCard: React.FC<StatsCardProps> = ({
  type = "quantity",
  value,
  label,
  icon,
  loading,
  warning = false,
  onClick,
}) => {
  const color = warning ? "text-red-500" : "text-green-500";

  return (
    <div
      className="
      flex justify-between items-center bg-white shadow-sm px-6 py-2 rounded-md
      cursor-pointer hover:shadow transition-shadow ease-in-out"
    >
      <div className="flex flex-col">
        <span
          className={`text-base font-bold ${warning && value ? "text-red-500" : "text-gray-800"}`}
        >
          {(type === "quantity" ? formatQuantity(value) : formatMoney(value)) || "0"}
        </span>
        <span className="text-[10px] text-gray-500">{label}</span>
      </div>

      {icon || <DefaultIcon warning={warning && value > 0} />}
    </div>
  );
};
