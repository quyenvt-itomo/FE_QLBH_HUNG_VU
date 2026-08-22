import { Select } from "antd";
import AddButton from "./AddButton";
import { DropdownColumn, DropdownHeader, renderDropdownBody } from "../core/CustomSelectLayout";
import { CLASSNAME } from "@/shared/constants/ui";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { SmartMultipleSelect } from "../core/SmartMultipleSelect";
interface AddMultipleSelectProps<T> extends SmartMultipleSelect<T> {
  ref?: React.Ref<any>;
  columns: DropdownColumn<T>[];
  modal?: React.ReactNode;
  showAddButton?: boolean;
  onOpen?: () => void;
}
const AddMultipleSelect = <T extends { id: string; name: string }>({
  ref,
  modal,
  showAddButton = true,
  disabled,
  onOpen,
  dataSource,
  columns,
  keyField = "id",
  labelField = "name",
  value,
  loading,
  className,
  hideOptions,
  ...rest
}: AddMultipleSelectProps<T>) => {
  const hideOptionKeys = hideOptions?.map((item) => item[keyField]);

  const finalDataSource =
    hideOptionKeys && hideOptionKeys.length > 0
      ? dataSource.filter(
          (item) => hideOptionKeys.includes(item[keyField]) === false || item[keyField] === value,
        )
      : dataSource;

  return (
    <div className="flex w-full z-0">
      <Select
        mode="multiple"
        maxTagCount="responsive"
        ref={ref}
        allowClear
        showSearch
        value={value}
        className={`${CLASSNAME.inputHeight} ${showAddButton ? "w-[calc(100%-36px)] rounded-e-none" : "w-full"} z-10`}
        suffixIcon={<ChevronDownIcon className="h-3.5" />}
        dropdownRender={(menu) => (
          <>
            {columns?.length > 1 ? <DropdownHeader columns={columns} /> : <></>}
            {menu}
          </>
        )}
        disabled={disabled}
        filterOption={false}
        {...rest}
      >
        {renderDropdownBody({
          dataSource: finalDataSource || [],
          columns: columns,
        })}
      </Select>

      {showAddButton && (
        <>
          <AddButton onClick={onOpen} disabled={disabled} />
          {modal}
        </>
      )}
    </div>
  );
};
export default AddMultipleSelect;
