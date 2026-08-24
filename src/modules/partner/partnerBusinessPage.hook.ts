import { BaseStoreReturn } from "@/shared/base/createBaseStore";
import { usePageState } from "@/shared/hooks/usePageState";

import { Partner, PartnerQuery, PartnerType } from "./partner.model";
import { usePartnerHandlers } from "./partner.handlers";

type PartnerStoreHook = (
  params?: PartnerQuery,
  onSuccess?: () => void,
) => BaseStoreReturn<Partner>;

export interface PartnerBusinessPageModel {
  pageState: ReturnType<typeof usePageState<Partner>>;
  store: BaseStoreReturn<Partner>;
  handlers: ReturnType<typeof usePartnerHandlers>;
}

export const usePartnerBusinessPage = (
  storeHook: PartnerStoreHook,
  type: PartnerType,
): PartnerBusinessPageModel => {
  const pageState = usePageState<Partner>();
  const { page, size, keyword, sortBy, sortOrder, reload, pageAction } = pageState;
  const store = storeHook(
    {
      page,
      size: type === PartnerType.SHIPPER ? 999 : size,
      keyword,
      sortBy,
      sortOrder,
      reload,
      type,
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

