import React from "react";
import { Descriptions, Modal } from "antd";
import { DetailModalProps } from "@/shared/interfaces/common";
import { Store } from "@/shared/base/entity";
export const StoreDetailModal: React.FC<DetailModalProps<Store>> = ({ open, data, onClose }) => <Modal open={open} title="Chi tiết cửa hàng" onCancel={onClose} footer={null}><Descriptions column={1} items={[{ key: "code", label: "Mã", children: data?.code }, { key: "name", label: "Tên", children: data?.name }, { key: "phone", label: "Điện thoại", children: data?.phone || "-" }, { key: "address", label: "Địa chỉ", children: data?.address?.detail || "-" }]} /></Modal>;
