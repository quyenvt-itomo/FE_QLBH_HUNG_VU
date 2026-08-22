import { SelectProps } from "@/shared/interfaces/common";
import { JobPosition, JobPositionQuery } from "../jobPosition.model";
import { useJobPositionStore } from "../jobPosition.store";
import { DropdownColumn } from "@/shared/components/core/CustomSelectLayout";
import { SmartSelect } from "@/shared/components/core/SmartSelect";
import { useRemoteSelect } from "@/shared/hooks/useRemoteSelect";

export const JobPositionSelect: React.FC<SelectProps<JobPosition, JobPositionQuery>> = ({
  value,
  defaultData,
  query,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const { list, loading, setKeywordTemp, unlock, handlePopupScroll } = useRemoteSelect<
    JobPosition,
    JobPositionQuery
  >({
    defaultData,
    queryHook: useJobPositionStore,
    buildParams: ({ keyword, page, isLocked }) => ({
      ...(query || {}),
      keyword,
      page,
      size: 10,
      isLocked,
    }),
  });

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = list.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const columns: DropdownColumn<JobPosition>[] = [
    { label: "Tên vị trí", dataIndex: "name", className: "w-52" },
    {
      label: "Chức danh",
      dataIndex: "jobTitle",
      className: "w-28",
      render: (record) => record.jobTitle?.name,
    },
  ];

  return (
    <SmartSelect<JobPosition>
      dataSource={list}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      placeholder={"Chọn vị trí công việc"}
      loading={loading}
      onSearch={setKeywordTemp}
      onFocus={(e) => {
        unlock();
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};
