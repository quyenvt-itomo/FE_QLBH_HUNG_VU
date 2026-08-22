import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsNoHoverProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ActionButtonsNoHover: React.FC<ActionButtonsNoHoverProps> = ({
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="absolute right-4 top-2 flex gap-2">
      {onAdd && (
        <button
          type="button"
          className="p-1 text-primary/80 hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          className="p-1 text-blue-600 hover:text-blue-800"
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
          type="button"
          className="p-1 text-red-600 hover:text-red-800"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ActionButtonsNoHover;
