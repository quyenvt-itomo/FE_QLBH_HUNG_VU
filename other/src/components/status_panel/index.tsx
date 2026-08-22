import { formatQuantity } from "../../utils/formatNumber";
import "./index.css";

export interface StatusItem {
  label: string;
  value: string;
  total?: number;
  icon: React.ReactNode;
}

export interface StatusPanelProps {
  status?: string;
  statusItems?: StatusItem[];
  onChangeStatus?: (status: string) => void;
}

const StatusPanel: React.FC<StatusPanelProps> = ({
  status,
  statusItems,
  onChangeStatus,
}) => {
  return (
    <div className="itomo-filter flex flex-col gap-4 w-[280px] h-fit">
      {statusItems?.length && (
        <div className="card">
          <span className="title">Trạng thái</span>
          <div className="flex flex-col w-full gap-3">
            {statusItems.map((item) => (
              <div
                key={item.value}
                className={`status-item ${
                  status === item.value ? "active" : ""
                }`}
                onClick={() =>
                  status !== item.value
                    ? onChangeStatus?.(item.value)
                    : undefined
                }
              >
                <span className="icon">{item.icon}</span>
                <div className="flex flex-col">
                  <span className="label">{item.label}</span>
                  <span className="total">
                    {formatQuantity(item.total) || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPanel;
