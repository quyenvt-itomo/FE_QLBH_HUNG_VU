import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// TODO: Global
import Global from "../stores/global.slice";
import OrderCache from "../stores/orderCache.slice";

const orderCacheReducer = persistReducer(
  { key: "orderCache", storage },
  OrderCache,
);

export const rootReducer = combineReducers({ Global, OrderCache: orderCacheReducer });
