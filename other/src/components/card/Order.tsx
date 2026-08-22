import { OrderStatusEnum, orderStatusMap } from "../../constants/enum";
import { Icon } from "@iconify/react";
import { IOrder } from "../../models/store/order";

interface StatusTagProps {
  status?: OrderStatusEnum;
}

export const OrderTab: React.FC<{
  order: IOrder | any;
  active?: boolean;
  selectCache: (id: string) => void;
  removeFromCache?: (id: string) => void;
}> = ({ order, active, selectCache, removeFromCache }) => {
  if (active) {
    return (
      <div
        className="
      bg-primary rounded-lg pl-4 pr-2 pt-px h-8 flex items-center flex-shrink-0 cursor-pointer
        border border-primary
        "
      >
        <span className="text-white font-semibold">{order.code ? order.code : "Đơn hàng mới"}</span>
        {removeFromCache && (
          <button
            type="button"
            onClick={() => removeFromCache(order.id!)}
            className="text-white hover:text-red-500 ml-2 transition-all ease-in-out"
          >
            <Icon icon="material-symbols:close-rounded" width="22" height="22" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="
      bg-white rounded-lg pl-4 pr-2 pt-px h-8 flex items-center flex-shrink-0 cursor-pointer
      hover:bg-gray-100 transition-all ease-in-out border
      "
      onClick={() => selectCache(order.id!)}
    >
      <span className="text-gray-700 font-semibold">
        {order.code ? order.code : "Đơn hàng mới"}
      </span>
      {removeFromCache && (
        <button
          type="button"
          onClick={() => removeFromCache(order.id!)}
          className="text-gray-500 hover:text-red-500 ml-2 transition-all ease-in-out"
        >
          <Icon icon="material-symbols:close-rounded" width="22" height="22" />
        </button>
      )}
    </div>
  );
};
