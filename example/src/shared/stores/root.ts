import { combineReducers } from "redux";

// TODO: Global
import Global from "./global.slice";
import Excel from "./excel.slice";

export const rootReducer = combineReducers({ Global, Excel });
