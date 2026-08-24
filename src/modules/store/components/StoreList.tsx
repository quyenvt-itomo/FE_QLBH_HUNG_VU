import { ObjectTableProps } from "@/shared";
import { StoreCardBase } from "./Card";

export const StoreList: React.FC<ObjectTableProps> = ({ dataSource, onEdit, onDelete }) => {
  return (
    <div className="max-w-6xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 sm:gap-6 p-3 md:p-0 md:pb-6">
      {dataSource.map((item) => (
        <StoreCardBase key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
