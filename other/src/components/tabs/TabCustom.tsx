import { TabsProps } from "antd";
import { getDelayStyle } from "../../utils/style.util";

export const TabCustom: React.FC<TabsProps> = ({
  activeKey,
  items = [],
  onChange,
}) => {
  return (
    <div className="flex gap-2">
      {items.map((item, index) => (
        <button
          key={item.key}
          onClick={() => onChange?.(item.key)}
          className={`
          relative overflow-hidden
          px-6 py-2.5 rounded-lg font-semibold text-sm
          transition-all duration-300 ease-in-out
          shadow-md
           
          after:content-['']
          after:absolute
          after:left-1/2
          after:bottom-0
          after:h-[2px]
          after:w-full
          after:bg-primary
          after:-translate-x-1/2
          after:scale-x-0
          after:origin-center
          after:transition-transform
          after:duration-300
          after:ease-out
          ${
            activeKey === item.key
              ? "text-primary shadow-lg after:scale-x-100 bg-white"
              : "text-gray-400 hover:text-gray-500 hover:after:scale-x-100 bg-white/40 hover:bg-white/70"
          }
          `}
          style={getDelayStyle(index)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
