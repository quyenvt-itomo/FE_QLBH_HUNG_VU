import { Cog6ToothIcon, PencilIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onSetting?: () => void;
  onDelete?: () => void;
}

export const OrganizationActionButtons: React.FC<ActionButtonsProps> = ({
  onAdd,
  onEdit,
  onSetting,
  onDelete,
}) => {
  return (
    <div
      className={`absolute flex flex-col bottom-2 right-2 gap-1 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 ease-in-out`}
    >
      {onAdd && (
        <button
          className="p-1 text-blue-400 hover:text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
        >
          <PlusCircleIcon className="w-5 h-5" />
        </button>
      )}
      {onEdit && (
        <button
          className="p-1 text-yellow-400 hover:text-yellow-600"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <PencilIcon className="w-5 h-5" />
        </button>
      )}
      {onDelete && (
        <button
          className="p-1 text-red-400 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}
      {onSetting && (
        <button
          className="p-1 text-gray-600 hover:text-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            onSetting();
          }}
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
