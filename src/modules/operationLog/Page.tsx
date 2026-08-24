import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared";
import { AppSelect } from "@/shared";
import { UserSelect } from "@/modules/user";
import { useOperationLogStore } from "./operationLog.store";
import { OperationLog, logActionMapping, targetEntityMapping } from "./operationLog.model";
import { Panel } from "@/shared";
import { checkSelection } from "@/shared/utils/common.util";
import { PanelFilter } from "@/shared";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { SortOrder } from "@/shared/constants/enum";
import { ClipboardDocumentListIcon } from "@/shared/icons";
import { OperationLogTable } from "./components/OperationLogTable";
import { DateRangeFilter } from "@/shared";

export const OperationLogPage: React.FC = () => {
  const [targetEntity, setTargetEntity] = useState<string | undefined>();
  const [action, setAction] = useState<string | undefined>();
  const [creatorId, setCreatorId] = useState<string | undefined>();

  const {
    keyword,
    page,
    size,
    startAt,
    endAt,
    sortBy,
    sortOrder,
    filter,
    ranger,
    reload,
    setPage,
    setSize,
    pageAction,
  } = usePageState<OperationLog>({
    sortBy: "createdAt",
    sortOrder: SortOrder.DESC,
    filterUses,
  });

  const { data, loading, pagination } = useOperationLogStore({
    keyword,
    page,
    size,
    startAt,
    endAt,
    reload,
    sortBy,
    sortOrder,
    targetEntity,
    action,
    creatorId,
    ...filter,
    ...ranger,
  });

  const moduleOptions = Object.entries(targetEntityMapping).map(([value, label]) => ({
    value,
    label,
  }));

  const actionOptions = Object.entries(logActionMapping).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto gap-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-col xl:flex-row xl:items-center gap-3 flex-shrink-0">
          <DateRangeFilter
            startDate={startAt}
            endDate={endAt}
            onRangeChange={pageAction.handleDateRangerChange}
          />
          <PanelFilter
            filterUses={filterUses}
            filterActive={
              Object.values(filter).some((v) => v && v.length > 0) ||
              !!targetEntity ||
              !!action ||
              !!creatorId
            }
            onClearFilter={() => {
              setTargetEntity(undefined);
              setAction(undefined);
              setCreatorId(undefined);
              pageAction.resetFilter();
            }}
            rangerItems={rangerItems}
            rangerValue={ranger}
            onRangerChange={pageAction.handleRangerChange}
            sortItems={sortItems}
            sortValue={sortBy ? { sortBy, sortOrder: sortOrder || SortOrder.DESC } : undefined}
            onSortChange={(val) => {
              pageAction.handleSortChange(val);
              setPage(1);
            }}
            filterContent={
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500">Module</span>
                  <AppSelect
                    placeholder="Chọn module"
                    value={targetEntity}
                    onChange={(val) => {
                      setTargetEntity(val);
                      setPage(1);
                    }}
                    options={moduleOptions}
                    allowClear
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500">Hành động</span>
                  <AppSelect
                    placeholder="Chọn hành động"
                    value={action}
                    onChange={(val) => {
                      setAction(val);
                      setPage(1);
                    }}
                    options={actionOptions}
                    allowClear
                  />
                </div>
                {/*  thêm cho tôi lọc theo user */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500">Người dùng</span>
                  <UserSelect
                    placeholder="Chọn người dùng"
                    value={creatorId}
                    onChange={(val) => {
                      setCreatorId(val);
                      setPage(1);
                    }}
                    allowClear
                  />
                </div>
              </div>
            }
          />
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
        </div>
      </div>

      {/* Bộ lọc nâng cao */}

      <Panel>
        <OperationLogTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onRow={(record: any) => ({
            onClick: () => {
              if (record.isSummary || checkSelection()) return;
            },
          })}
        />
      </Panel>
    </div>
  );
};
