import { message as staticMessage } from "antd";

type MessageApi = {
  open: (...args: any[]) => any;
  success: (...args: any[]) => any;
  error: (...args: any[]) => any;
  info: (...args: any[]) => any;
  warning: (...args: any[]) => any;
  loading: (...args: any[]) => any;
  destroy: (...args: any[]) => any;
};

let currentMessage: MessageApi | null = null;

export const setAppMessageInstance = (messageApi: MessageApi | null) => {
  currentMessage = messageApi;
};

const getMessageApi = (): MessageApi => currentMessage ?? (staticMessage as unknown as MessageApi);

const callMessage = (method: keyof MessageApi, ...args: any[]) => {
  return getMessageApi()[method](...args);
};

export const appMessageApi = {
  open: (...args: any[]) => callMessage("open", ...args),
  success: (...args: any[]) => callMessage("success", ...args),
  error: (...args: any[]) => callMessage("error", ...args),
  info: (...args: any[]) => callMessage("info", ...args),
  warning: (...args: any[]) => callMessage("warning", ...args),
  loading: (...args: any[]) => callMessage("loading", ...args),
  destroy: (...args: any[]) => callMessage("destroy", ...args),
};
