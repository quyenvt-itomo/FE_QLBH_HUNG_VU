import AddButton from "./button/AddButton";
import { SearchInput, SearchInputProps } from "./input";

interface SearchAddProps extends SearchInputProps {
  title?: string;
  onOpenAdd?: () => void;
}

const SearchAdd: React.FC<SearchAddProps> = ({
  title,
  placeholder,
  value,
  height,
  onSearch,
  onOpenAdd,
  ...rest
}) => {
  return (
    <div
      className="flex flex-grow gap-4 justify-between"
      style={{
        height,
      }}
    >
      <div className="flex items-center custom-search flex-1">
        <SearchInput
          value={value}
          onSearch={(value: string) => onSearch(value)}
          placeholder={placeholder}
          height={height}
          {...rest}
        />
      </div>

      {onOpenAdd && (
        <AddButton height={height} title={title} onOpenAdd={onOpenAdd} />
      )}
    </div>
  );
};

export default SearchAdd;
