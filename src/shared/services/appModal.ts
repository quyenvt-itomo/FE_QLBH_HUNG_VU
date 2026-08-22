import { Modal } from "antd";

type ModalApi = {
  info: (...args: any[]) => any;
  success: (...args: any[]) => any;
  error: (...args: any[]) => any;
  warning: (...args: any[]) => any;
  confirm: (...args: any[]) => any;
  destroyAll?: (...args: any[]) => any;
};

let currentModal: ModalApi | null = null;

export const setAppModalInstance = (modalApi: ModalApi | null) => {
  currentModal = modalApi;
};

const getModalApi = (): ModalApi => currentModal ?? (Modal as unknown as ModalApi);

type RequiredModalMethod = "info" | "success" | "error" | "warning" | "confirm";

const callModal = (method: RequiredModalMethod, ...args: any[]) => {
  return getModalApi()[method](...args);
};

export const appModalApi = {
  info: (...args: any[]) => callModal("info", ...args),
  success: (...args: any[]) => callModal("success", ...args),
  error: (...args: any[]) => callModal("error", ...args),
  warning: (...args: any[]) => callModal("warning", ...args),
  confirm: (...args: any[]) => callModal("confirm", ...args),
  destroyAll: (...args: any[]) => getModalApi().destroyAll?.(...args),
};
