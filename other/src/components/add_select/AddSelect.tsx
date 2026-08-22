import { Select } from "antd";
import { IconArrowDown } from "../icon/ArrowDown";
import AddButton from "./AddButton";
import { SelectProps } from "../../models/base/select";
import { DropdownColumn, DropdownHeader, renderDropdownBody } from "../core/CustomSelectLayout";
interface AddSelectProps<T> extends SelectProps<T> {
  ref?: React.Ref<any>;
  columns: DropdownColumn<T>[];
  modal?: React.ReactNode;
  showAddButton?: boolean;
  onOpen?: () => void;
}
const AddSelect = <T extends { id: string; name: string }>({
  ref,
  options,
  columns,
  modal,
  showAddButton = true,
  disabled,
  onOpen,
  ...rest
}: AddSelectProps<T>) => {
  return (
    <div className="flex w-full z-0">
      <Select
        ref={ref}
        allowClear
        showSearch
        className={`h-8 ${showAddButton ? "w-[calc(100%-36px)] rounded-e-none" : "w-full"} z-10`}
        suffixIcon={<IconArrowDown />}
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
          dataSource: options || [],
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
export default AddSelect;
