import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { Store } from "@/shared/base/entity";
import { StoreQuery } from "./store.model";
export const useStoreStore = createBaseStore<Store, StoreQuery>({ key: "stores", apiUrl: apiEndpoint.store.base, permissionModule: "store" });
