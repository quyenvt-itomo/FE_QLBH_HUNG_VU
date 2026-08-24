import { Cog6ToothIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  addTitle?: string;
  editTitle?: string;
  deleteTitle?: string;
  style?: React.CSSProperties;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetting?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  addTitle,
  editTitle,
  deleteTitle,
  style,
  onAdd,
  onEdit,
  onDelete,
  onSetting,
}) => {
  return (
    <div
      className={`absolute right-4 flex gap-2 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 ease-in-out`}
      style={style}
    >
      {onAdd && (
        <button
          className="p-1 text-primary/80 hover:text-primary"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          title={addTitle}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      )}
      {onEdit && (
        <button
          className="p-1 text-blue-600 hover:text-blue-800"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title={editTitle}
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
          title={deleteTitle}
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

export { ActionButtons };
