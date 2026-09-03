import { BaseStoreReturn } from "@/shared/base/createBaseStore";
import { usePageState } from "@/shared/hooks/usePageState";

import { getFilterUses, Partner, PartnerQuery, PartnerType } from "./partner.model";
import { usePartnerHandlers } from "./partner.handlers";
import { SortOrder } from "@/shared/constants";

type PartnerStoreHook = (params?: PartnerQuery, onSuccess?: () => void) => BaseStoreReturn<Partner>;

export interface PartnerBusinessPageModel {
  pageState: ReturnType<typeof usePageState<Partner>>;
  store: BaseStoreReturn<Partner>;
  handlers: ReturnType<typeof usePartnerHandlers>;
}

export const usePartnerBusinessPage = (
  storeHook: PartnerStoreHook,
  type: PartnerType,
): PartnerBusinessPageModel => {
  const filterUses = getFilterUses(type);
  const pageState = usePageState<Partner>({
    filterUses,
    sortBy: "createdAt",
    sortOrder: SortOrder.DESC,
  });
  const { page, size, keyword, sortBy, sortOrder, filter, reload, pageAction, status } = pageState;
  const store = storeHook(
    {
      page,
      size: type === PartnerType.SHIPPER ? 999 : size,
      keyword,
      sortBy,
      sortOrder,
      reload,
      type,
      isOrganization: status === "organization" ? true : status === "individual" ? false : undefined,
      ...filter,
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

  return { pageState, store, handlers };
};
