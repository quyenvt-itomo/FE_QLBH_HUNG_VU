import { AddButton, ButtonFilter } from "@/shared";
import { Panel } from "@/shared";
import { SearchInput } from "@/shared";
import { useUserStore } from "./user.store";
import { usePageState } from "@/shared/hooks/usePageState";
import { filterUses, sortItems, User } from "./user.model";
import { AddUpdateModal, UserTable } from "./components";
import { useUserHandlers } from "./user.handlers";

export const UserPage: React.FC = () => {
  const {
    isFilterActive,
    keyword,
    page,
    size,
    sortBy,
    sortOrder,
    filter,
    reload,
    setPage,
    setSize,

    open,
    setOpen,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<User>();

  const { data, errors, loading, creating, updating, pagination, create, update, remove, getById } =
    useUserStore(
      {
        keyword,
        page,
        size,
        reload,
        ...filter,
      },
      () => {
        pageAction.handleClose();
      },
    );

  const { handleOpenAdd, handleOpenEdit, handleDelete } = useUserHandlers({
    create,
    update,
    remove,
    getById,
    setOpen,
    setRowData,
  });

  return (
    <div className="flex flex-col h-full w-full gap-3">
      <div className="flex items-center justify-between gap-3 flex-shrink-0">
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
        <div className="flex items-center gap-3">
          <ButtonFilter
            filterActive={isFilterActive}
            sortItems={sortItems}
            sortValue={{ sortBy, sortOrder }}
            onSortChange={pageAction.handleSortChange}
            filterUses={filterUses}
            onClearFilter={pageAction.resetFilter}
          />
          <AddButton onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <UserTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      </Panel>

      <AddUpdateModal
        open={open}
        errors={errors}
        loading={creating || updating}
        editData={rowData}
        onAdd={create}
        onEdit={update}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
