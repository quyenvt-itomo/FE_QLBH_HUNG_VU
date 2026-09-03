import { BaseStoreReturn } from "@/shared/base/createBaseStore";
import { usePageState } from "@/shared/hooks/usePageState";

import { getFilterUses, Partner, PartnerQuery, PartnerType } from "./partner.model";
import { usePartnerHandlers } from "./partner.handlers";
import { SortOrder } from "@/shared/constants";
import { Gender } from "@/shared/constants/enum";
import { useState } from "react";

type PartnerStoreHook = (params?: PartnerQuery, onSuccess?: () => void) => BaseStoreReturn<Partner>;

export interface PartnerBusinessPageModel {
  pageState: ReturnType<typeof usePageState<Partner>>;
  store: BaseStoreReturn<Partner>;
  handlers: ReturnType<typeof usePartnerHandlers>;
  partnerFilter: {
    organization?: boolean;
    gender: Gender[];
    states: string[];
    wards: string[];
    isActive: boolean;
    setOrganization: (value?: boolean) => void;
    setGender: (value: Gender[]) => void;
    setStates: (value: string[]) => void;
    setWards: (value: string[]) => void;
    reset: () => void;
  };
}

export const usePartnerBusinessPage = (
  storeHook: PartnerStoreHook,
  type: PartnerType,
): PartnerBusinessPageModel => {
  const [organization, setOrganization] = useState<boolean | undefined>();
  const [gender, setGender] = useState<Gender[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const filterUses = getFilterUses(type);
  const pageState = usePageState<Partner>({
    filterUses,
    sortBy: "createdAt",
    sortOrder: SortOrder.DESC,
  });
  const { page, size, keyword, sortBy, sortOrder, filter, ranger, reload, pageAction } = pageState;
  const store = storeHook(
    {
      page,
      size: type === PartnerType.SHIPPER ? 999 : size,
      keyword,
      sortBy,
      sortOrder,
      reload,
      type,
      ...filter,
      ...ranger,
      isOrganization: organization,
      gender: gender.length ? gender : undefined,
      states: states.length ? states : undefined,
      wards: wards.length ? wards : undefined,
    },
    pageAction.handleClose,
  );
  const handlers = usePartnerHandlers({
    getById: store.getById,
    create: store.create,
    update: store.update,
    remove: store.remove,
    setOpen: pageState.setOpen,
    setOpenDetail: pageState.setOpenDetail,
    setRowData: pageState.setRowData,
  });

  const resetPartnerFilters = () => {
    pageAction.resetFilter();
    setOrganization(undefined);
    setGender([]);
    setStates([]);
    setWards([]);
  };

  const updatePartnerFilter = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    pageState.setPage(1);
  };

  return {
    pageState,
    store,
    handlers,
    partnerFilter: {
      organization,
      gender,
      states,
      wards,
      isActive:
        organization !== undefined ||
        gender.length > 0 ||
        states.length > 0 ||
        wards.length > 0,
      setOrganization: (value) => updatePartnerFilter(setOrganization, value),
      setGender: (value) => updatePartnerFilter(setGender, value),
      setStates: (value) => updatePartnerFilter(setStates, value),
      setWards: (value) => updatePartnerFilter(setWards, value),
      reset: resetPartnerFilters,
    },
  };
};
