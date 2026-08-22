import { apiEndpoint } from "../../constants/ApiEndpoint";
import { FormatData } from "../../models/base/format";
import { createBaseSettingSaga } from "../createBaseSettingSaga";
import * as SettingActions from "./slice";

const { getItemSuccess, getItemFailure, updateItemSuccess, updateItemFailure } = SettingActions;

export const SettingSaga = createBaseSettingSaga<FormatData>({
  name: "setting",
  api: apiEndpoint.settings.base,
  actions: {
    getItemSuccess,
    getItemFailure,
    updateItemSuccess,
    updateItemFailure,
  },
});
