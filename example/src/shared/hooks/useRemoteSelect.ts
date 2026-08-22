import { UIEvent, useEffect, useMemo, useRef, useState } from "react";
import { Entity } from "@/shared/base/entity";
import { PaginationProps } from "@/shared/interfaces/api";
import useDebounce from "@/shared/hooks/useDebounce";
import { mergePaginatedEntities } from "@/shared/utils/common.util";

interface UseRemoteSelectContext {
  keyword: string;
  page: number;
  isLocked: boolean;
}

interface UseRemoteSelectOptions<T extends Entity, TParams> {
  defaultData?: T | T[] | null;
  queryHook: (params: TParams) => {
    isSuccess: boolean;
    data: T[];
    loading: boolean;
    pagination?: PaginationProps;
  };
  buildParams: (ctx: UseRemoteSelectContext) => TParams;
  initialLocked?: boolean;
  initialPage?: number;
  debounceDelay?: number;
  loadMoreOffset?: number;
  mergeFn?: (prev: T[], incoming: T[], currentPage?: number) => T[];
  shouldAppendDefault?: (prev: T[], item: T) => boolean;
  canLoadMore?: (args: { pagination?: PaginationProps; list: T[] }) => boolean;
  resetPageDeps?: unknown[];
  hideOptions?: T[] | null;
}

export function useRemoteSelect<T extends Entity, TParams>({
  defaultData,
  queryHook,
  buildParams,
  initialLocked = true,
  initialPage = 1,
  debounceDelay = 300,
  loadMoreOffset = 20,
  mergeFn = mergePaginatedEntities,
  shouldAppendDefault,
  canLoadMore,
  resetPageDeps,
  hideOptions,
}: UseRemoteSelectOptions<T, TParams>) {
  const [list, setList] = useState<T[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(initialLocked);
  const [page, setPage] = useState<number>(initialPage);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const didInitResetPageDeps = useRef<boolean>(false);

  const keyword = useDebounce(keywordTemp, debounceDelay, () => setPage(initialPage));

  const params = useMemo(
    () =>
      buildParams({
        keyword,
        page,
        isLocked,
      }),
    [buildParams, isLocked, keyword, page],
  );

  const resetPageDepsKey = useMemo(() => JSON.stringify(resetPageDeps || []), [resetPageDeps]);

  useEffect(() => {
    if (!didInitResetPageDeps.current) {
      didInitResetPageDeps.current = true;
      return;
    }

    setPage(initialPage);
    setList([]);
  }, [initialPage, resetPageDepsKey]);

  const { isSuccess, data, loading, pagination } = queryHook(params);

  useEffect(() => {
    if (isLocked || !isSuccess) return;

    setList((prev) => mergeFn(prev, data, pagination?.currentPage));
  }, [data, isSuccess, isLocked, mergeFn, pagination?.currentPage]);

  useEffect(() => {
    if (Array.isArray(defaultData)) {
      if (!defaultData?.length) return;

      const newItems = defaultData.filter((d) => !list.some((p) => p.id === d.id));
      if (newItems.length > 0) {
        setList((prev) => [...newItems, ...prev]);
      }
    } else {
      if (!defaultData?.id) return;

      setList((prev) => {
        const shouldAdd = shouldAppendDefault
          ? shouldAppendDefault(prev, defaultData)
          : !prev.some((item) => item.id === defaultData.id);

        return shouldAdd ? [defaultData, ...prev] : prev;
      });
    }
  }, [defaultData, shouldAppendDefault]);

  const handlePopupScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight < scrollHeight - loadMoreOffset || loading) return;

    const hasMore = canLoadMore
      ? canLoadMore({ pagination, list })
      : Boolean(pagination && list.length < pagination.totalRecords);

    if (!hasMore) return;

    setPage((prev) => prev + 1);
  };

  const unlock = () => setIsLocked(false);

  const finalList = useMemo(() => {
    if (!hideOptions?.length) return list;
    const hideIds = hideOptions.map((item) => item.id);
    return list.filter((item) => !hideIds.includes(item.id));
  }, [hideOptions, list]);

  return {
    finalList,
    list,
    setList,
    page,
    setPage,
    keyword,
    keywordTemp,
    setKeywordTemp,
    isLocked,
    setIsLocked,
    unlock,
    loading,
    pagination,
    handlePopupScroll,
  };
}
