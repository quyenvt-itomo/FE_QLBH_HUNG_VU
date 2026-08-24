import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// TODO: Global
import Global from "./global.slice";
import OrderCache from "./orderCache.slice";
import Excel from "./excel.slice";

const orderCacheReducer = persistReducer(
  { key: "orderCache", storage },
  OrderCache,
);

export const rootReducer = combineReducers({ Global, OrderCache: orderCacheReducer, Excel });
