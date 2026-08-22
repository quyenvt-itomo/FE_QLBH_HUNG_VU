import { Progress } from "antd";

interface ProgressDetailProps {
  items: {
    label: string;
    percent: number;
  }[];
}

export const ProgressDetail: React.FC<ProgressDetailProps> = ({ items }) => {
  // nếu có 2 item mà item thứ nhất > item thứ 2 thì cảnh báo
  const hasDanger = items.length === 2 && items[0].percent > items[1].percent;

  return (
    <div className="flex flex-col">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 justify-between h-4">
          <span className="text-[10px] text-gray-500">{item.label}</span>
          <div className="w-52">
            <Progress
              size="small"
              percent={item.percent}
              showInfo={false}
              strokeColor={hasDanger && idx === 0 ? "#ff4d4f" : undefined}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
