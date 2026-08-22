import {
  CreditCardIcon,
  HomeIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import ActionButtons from "../button/ActionButtons";
import { IBank, IPartner } from "../../models/partner";

interface BankCardProps {
  item: IBank;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (item: IBank) => void;
  onEdit?: (item: IBank) => void;
  onDelete?: (item: IBank) => void;
}

export const BankCardBase: React.FC<BankCardProps> = ({
  item,
  className = "",
  style,
  onClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onClick?.(item)}
      className={`
        relative w-full max-w-[494px] min-h-[220px] bg-[#121926] text-white rounded-[24px] p-8
        flex flex-col justify-between shadow-md group overflow-hidden
        transition-all duration-300 hover:scale-[1.01]
        ${className}
      `}
      style={style}
    >
      {/* Background Overlay (Tùy chọn để tạo độ bóng như ảnh) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Header: Ngân hàng & Icon thẻ */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">
            NGÂN HÀNG
          </span>
          <h3 className="text-xl font-semibold tracking-tight">
            {item?.bankName} - {item?.branch}
          </h3>
        </div>
        <CreditCardIcon className="w-10 h-10 opacity-40" />
      </div>

      {/* Footer: Số tài khoản & Chủ tài khoản */}
      <div className="flex justify-between items-end relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">
            SỐ TÀI KHOẢN
          </span>
          <span className="text-2xl font-medium tracking-[0.15em] font-mono">
            {item?.accountNumber}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-right">
          <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">
            CHỦ TÀI KHOẢN
          </span>
          <span className="text-lg font-bold uppercase">{item?.accountHolder}</span>
        </div>
      </div>

      {/* Action Buttons: Hiện khi hover hoặc cố định ở một góc */}
      <div className="absolute top-4 right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <ActionButtons
          onEdit={() => {
            onEdit?.(item);
          }}
          onDelete={() => {
            onDelete?.(item);
          }}
        />
      </div>
    </div>
  );
};
