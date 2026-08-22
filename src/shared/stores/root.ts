import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// TODO: Global
import Global from "./global.slice";
import Excel from "./excel.slice";
import OrderCache from "./orderCache.slice";

const orderCacheReducer = persistReducer(
  { key: "orderCache", storage },
  OrderCache,
);

export const rootReducer = combineReducers({ Global, Excel, OrderCache: orderCacheReducer });
