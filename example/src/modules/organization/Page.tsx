import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { SearchInput } from "@/shared/components/input";
import { checkSelection } from "@/shared/utils/common.util";
import { useOrganizationStore } from "./organization.store";
import { App, Tabs, TabsProps } from "antd";
import { usePageState } from "@/shared/hooks/usePageState";
import { Organization } from "./organization.model";
import { AddUpdateModal, OrganizationTable, UpdateSortDrawer } from "./components";
import { useHashTabs } from "@/shared/hooks/useHashTabs";
import { OrganizationChart } from "./components/OrganizationChart";
import { getAvailableOrganizationTypes } from "./organization.util";
import { useState } from "react";
import { OrganizationTypeEnum, organizationTypeMap } from "./organization.enum";
import { useAuth } from "@/shared/hooks/useAuth";
import { parseFormDataDates } from "@/shared/utils/date.util";
import { setFormCode } from "@/shared/utils/form.util";

type TabsType = "chart" | "list";

export const OrganizationPage: React.FC = () => {
  const { modal } = App.useApp();

  const tabItems: TabsProps["items"] = [
    {
      key: "chart",
      label: "Sơ đồ tổ chức",
    },
    {
      key: "list",
      label: "Danh sách đơn vị",
    },
  ];

  const { getInfo } = useAuth();
  const { activeTab, onTabChange } = useHashTabs<TabsType>({
    items: tabItems.map((item) => ({ value: item.key as TabsType, label: item.label })),
  });

  const [openSetting, setOpenSetting] = useState<boolean>(false);

  const {
    keyword,
    page,
    size,
    filter,
    reload,
    setPage,
    setSize,

    form,
    __unCloseAfterSucess,
    open,
    setOpen,
    rowData,
    setRowData,
    defaultData,
    setDefaultData,

    pageAction,
  } = usePageState<Organization>();

  const [type, setType] = useState<"all" | OrganizationTypeEnum>("all");

  const {
    data,
    errors,
    loading,
    creating,
    updating,
    pagination,
    create,
    update,
    remove,
    updateSortOrder,
  } = useOrganizationStore(
    {
      keyword: activeTab === "list" ? keyword : undefined,
      page: activeTab === "list" ? page : 1,
      size: activeTab === "list" ? size : 999999,
      reload,
      type: type === "all" ? undefined : type,
      ...filter,
    },
    () => {
      if (__unCloseAfterSucess && open) {
        if (rowData) return;

        const parent = form.getFieldValue("parent");
        const parentId = form.getFieldValue("parentId");
        const type = form.getFieldValue("type");
        form.resetFields();
        form.setFieldsValue({ parent, parentId, type, __unCloseAfterSucess: true });
        if (defaultData) {
          const parsedData = parseFormDataDates(defaultData);
          form.setFieldsValue(parsedData);
        }
        setFormCode({ form, type: "organization" });
        return;
      }
      pageAction.handleClose();
      getInfo?.();
    },
  );

  const handleOpenDetailModal = (record: Organization) => {};

  const handleOpenAddModal = create
    ? (defaultData?: Partial<Organization>) => {
        setOpen(true);
        setRowData(undefined);
        setDefaultData(defaultData);
      }
    : undefined;

  const handleOpenUpdate = update
    ? (record: Organization) => {
        setOpen(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = remove
    ? (record: Organization) => {
        modal.confirm({
          title: "Xóa cửa hàng",
          content: `Bạn có chắc chắn muốn xóa cửa hàng "${record.name}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            remove(record.id);
          },
        });
      }
    : undefined;

  const handleOpenSetting = updateSortOrder
    ? (record: Organization) => {
        setOpenSetting(true);
        setRowData(record);
      }
    : undefined;

  const typeTabs = [
    { key: "all", label: "Tất cả" },
    ...Object.values(OrganizationTypeEnum).map((value) => ({
      key: value,
      label: organizationTypeMap[value],
    })),
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <Tabs
        activeKey={activeTab}
        items={tabItems}
        onChange={(key) => onTabChange(key as TabsType)}
        className="w-full tab-custom"
      />
      <div className="h-[calc(100%-36px)] w-full flex flex-col gap-2 p-3 bg-panel rounded-xl">
        {activeTab === "chart" ? (
          <OrganizationChart
            dataSource={data}
            loading={loading}
            pagination={pagination}
            onAdd={
              handleOpenAddModal
                ? (parent) => {
                    const availableTypes = getAvailableOrganizationTypes(parent);
                    handleOpenAddModal({ parent, parentId: parent?.id, type: availableTypes[0] });
                  }
                : undefined
            }
            setPage={setPage}
            setSize={setSize}
            onEdit={handleOpenUpdate}
            onDelete={handleDelete}
            onSetting={handleOpenSetting}
          />
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 flex-shrink-0">
              <Tabs
                activeKey={type}
                items={typeTabs}
                onChange={(key) => setType(key as "all" | OrganizationTypeEnum)}
                className="w-full tab-custom"
              />
              <div className="flex items-center gap-3">
                <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={320} />
                <AddButton onOpenAdd={handleOpenAddModal} />
              </div>
            </div>
            <Panel>
              <OrganizationTable
                dataSource={data}
                loading={loading}
                pagination={pagination}
                setPage={setPage}
                setSize={setSize}
                onEdit={handleOpenUpdate}
                onDelete={handleDelete}
                onRow={(record: any) => {
                  return {
                    onClick: () => {
                      if (record.isSummary || checkSelection()) return;
                      handleOpenDetailModal(record);
                    },
                  };
                }}
              />
            </Panel>
          </>
        )}
      </div>

      <AddUpdateModal
        form={form}
        open={open}
        errors={errors}
        loading={creating || updating}
        editData={rowData}
        defaultData={defaultData}
        onAdd={create}
        onEdit={update}
        onClose={pageAction.handleClose}
      />

      <UpdateSortDrawer
        open={openSetting}
        parent={rowData}
        onClose={() => setOpenSetting(false)}
        onSubmit={updateSortOrder}
      />
    </div>
  );
};
