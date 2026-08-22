import { useEffect, useRef, useState } from "react";
import { getSessionEndDate, getSessionStartDate } from "../../utils/dateUtils";
import { useParams } from "react-router-dom";
import socket from "../../services/socket";
import { SortOrderEnum } from "../../constants/enum";
import { Filter, FilterKey, Ranger, Search, SortValue } from "../../models/base/interface";
import { useClientData } from "./useClientData";
import useDebounce from "./useDebounce";

export type TypeShow = "view" | "edit";

interface UsePageStateProps {
  open?: boolean;
  openDetail?: boolean;
  openDelete?: boolean;
  typeShow?: TypeShow;
  page?: number;
  size?: number;
  keyword?: string;
  rowData?: any;
  sortBy?: string;
  sortOrder?: SortOrderEnum;
  startAt?: string;
  endAt?: string;
  filter?: Filter;

  filterUses?: FilterKey[];
}

export function usePageState<T extends { id: string } = any>(params?: UsePageStateProps) {
  const { filter, handleSetFilter } = useClientData();
  const { id } = useParams<{ id: string }>();
  const [storeId, setStoreId] = useState<string | undefined>();
  const [open, setOpen] = useState<boolean>(params?.open || false);
  const [openDetail, setOpenDetail] = useState<boolean>(params?.openDetail || false);
  const [openDelete, setOpenDelete] = useState<boolean>(params?.openDelete || false);
  const [typeShow, setTypeShow] = useState<TypeShow>(params?.typeShow || "edit");
  const [page, setPage] = useState<number>(params?.page || 1);
  const [size, setSize] = useState<number>(params?.size || 20);
  const [keyword, setKeyword] = useState<string>(params?.keyword || "");
  const [rowData, setRowData] = useState<T | undefined>(params?.rowData || undefined);
  const [status, setStatus] = useState<string>("all");
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [sortBy, setSortField] = useState<string | undefined>(params?.sortBy || undefined);
  const [sortOrder, setsortOrder] = useState<SortOrderEnum | undefined>(
    params?.sortOrder || undefined,
  );
  const [startAt, setStartAt] = useState<string | undefined>(
    params?.startAt || getSessionStartDate(),
  );
  const [endAt, setEndAt] = useState<string | undefined>(params?.endAt || getSessionEndDate());

  const [reload, setReload] = useState<boolean>(false);

  const [ranger, setRanger] = useState<Ranger>({});

  const [search, setSearch] = useState<Search>({});

  const containerRef = useRef<HTMLDivElement>(null);

  const checkFilterActive = () => {
    // kiểm tra xem các biến filter, sortBy, sortOrder có giá trị khác mặc định hay không
    // ngoại trừ các biến keyword, page, size
    if (params?.filterUses?.length) {
      for (const key of params.filterUses) {
        const v = filter[key];
        if (v !== undefined && v.length > 0) {
          return true;
        }
      }
    }

    for (const key in ranger) {
      if (ranger[key as keyof Ranger]) return true;
    }

    // kiểm tra search
    for (const key in search) {
      if (search[key as keyof Search]) return true;
    }

    if (sortBy !== params?.sortBy) return true;
    if (sortOrder !== params?.sortOrder) return true;
    return false;
  };

  const isFilterActive = checkFilterActive();

  useEffect(() => {
    if (endAt) sessionStorage.setItem("dateRangeEnd", endAt);
    if (startAt) sessionStorage.setItem("dateRangeStart", startAt);
  }, [startAt, endAt]);

  useEffect(() => {
    sessionStorage.setItem("filter", JSON.stringify(filter));
  }, [filter]);

  useEffect(() => {
    socket.on("notification", () => setReload((prev) => !prev));

    return () => {
      socket.off("notification", () => setReload((prev) => !prev));
    };
  }, []);

  function handleStoreChange(newStoreId: string) {
    setStoreId(newStoreId);
    setPage(1);
  }

  function updateDataSource(newData: T[], page?: number) {
    if (page === 1) {
      setDataSource(newData);
      return;
    }
    setDataSource((prevList) => {
      const updatedList = [...prevList];

      newData.forEach((item) => {
        const index = updatedList.findIndex((i) => i.id === item.id);
        if (index !== -1) updatedList[index] = item;
        else updatedList.push(item);
      });

      return updatedList;
    });
  }

  function handleSortChange(value: SortValue) {
    const isSame = sortBy === value.sortBy && sortOrder === value.sortOrder;
    if (isSame) return;
    setSortField(value.sortBy);
    setsortOrder(value.sortOrder);
    setPage(1);
    setDataSource([]);
  }

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus);
    setPage(1);
  }

  function handleFilterChange(newFilter?: Filter) {
    handleSetFilter(newFilter || {});
    setPage(1);
  }

  function handleRangerChange(newRanger: Ranger) {
    setRanger(newRanger);
    setPage(1);
  }

  function handleSearchChange(newSearch: Search) {
    setSearch(newSearch);
    setPage(1);
  }

  function handleSearch(value: string) {
    if (value === keyword) return;
    setKeyword(value);
    setPage(1);
  }

  function handleDateRangerChange(startDate?: string, endDate?: string) {
    const isSame = startAt === startDate && endAt === endDate;
    if (isSame) return;
    setStartAt(startDate);
    setEndAt(endDate);
    setPage(1);
  }

  function handleStartAtChange(date: string | undefined) {
    if (date === startAt) return;
    setStartAt(date);
    setPage(1);
  }

  function handleEndAtChange(date: string | undefined) {
    if (date === endAt) return;
    setEndAt(date);
    setPage(1);
  }

  function handleClose(closeDetail: boolean = true) {
    setOpen(false);
    setOpenDelete(false);
    if (!closeDetail) return;
    setOpenDetail(false);
    setRowData(undefined);
  }

  function resetFilter() {
    handleSetFilter({});
    setRanger({});
    setSearch({});
    setSortField(params?.sortBy || undefined);
    setsortOrder(params?.sortOrder || undefined);
    setPage(1);
  }

  function handleReload() {
    setReload((prev) => !prev);
  }

  const pageAction = {
    handleStoreChange,
    handleFilterChange,
    handleRangerChange,
    handleSearchChange,
    handleSearch,
    handleDateRangerChange,
    handleStartAtChange,
    handleEndAtChange,
    handleSortChange,
    handleStatusChange,
    handleClose,
    resetFilter,
    handleReload,
  };

  // debounce sort
  const debounceSortBy = useDebounce(sortBy, 500);
  const debounceSortOrder = useDebounce(sortOrder, 500);
  // debounce filter
  const debounceFilter = useDebounce(filter, 500);
  // debounce ranger
  const debounceRanger = useDebounce(ranger, 500);

  return {
    id,
    storeId,
    setStoreId,
    open,
    setOpen,
    openDetail,
    setOpenDetail,
    openDelete,
    setOpenDelete,
    typeShow,
    setTypeShow,
    page,
    setPage,
    size,
    setSize,
    keyword,
    setKeyword,
    rowData,
    setRowData,
    status,
    setStatus,
    dataSource,
    setDataSource,
    sortBy: debounceSortBy,
    setSortField,
    sortOrder: debounceSortOrder,
    setsortOrder,
    handleSortChange,
    startAt,
    setStartAt,
    endAt,
    setEndAt,

    filter: debounceFilter,
    setFilter: handleSetFilter,

    ranger: debounceRanger,
    setRanger,

    search,
    setSearch,

    reload,
    setReload,

    containerRef,

    updateDataSource,
    isFilterActive,
    pageAction,
  };
}
