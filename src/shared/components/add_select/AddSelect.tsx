import { Select } from "antd";
import { AddSelectButton } from "./AddButton";
import { buildDropdownOptions, DropdownColumn, DropdownHeader } from "../core/CustomSelectLayout";
import { SelectProps } from "@/shared/interfaces/common";
import { CLASSNAME } from "@/shared/constants/ui";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
interface AddSelectProps<T> extends SelectProps<T> {
  ref?: React.Ref<any>;
  columns: DropdownColumn<T>[];
  modal?: React.ReactNode;
  showAddButton?: boolean;
  onOpen?: () => void;
}
const AddSelect = <T extends { id: string; name: string }>({
  ref,
  options = [],
  columns,
  modal,
  showAddButton = true,
  disabled,
  hideOptions,
  value,
  onOpen,
  ...rest
}: AddSelectProps<T>) => {
  const hideOptionKeys = hideOptions?.map((item) => item.id);

  const finalDataSource =
    hideOptionKeys && hideOptionKeys.length > 0
      ? options.filter((item) => hideOptionKeys.includes(item.id) === false || item.id === value)
      : options;

  return (
    <div className="flex w-full z-0">
      <Select
        ref={ref}
        allowClear
        showSearch
        value={value}
        className={`${CLASSNAME.inputHeight} ${showAddButton ? "!w-[calc(100%-36px)] rounded-e-none" : "w-full"} z-10`}
        suffixIcon={<ChevronDownIcon className="h-3.5" />}
        dropdownRender={(menu) => (
          <>
            {columns?.length > 1 ? <DropdownHeader columns={columns} /> : <></>}
            {menu}
          </>
        )}
        disabled={disabled}
        filterOption={false}
        options={buildDropdownOptions(finalDataSource || [], columns)}
        {...rest}
      />

      {showAddButton && (
        <>
          <AddSelectButton onClick={onOpen} disabled={disabled} />
          {modal}
        </>
      )}
    </div>
  );
};
export { AddSelect };
