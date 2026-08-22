import React from "react";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { Typography, Descriptions } from "antd";

const { Text } = Typography;

interface Props {
  open?: boolean;
  onClose?: () => void;
}

const AccountInformation: React.FC<Props> = ({ open, onClose }) => {
  const { info } = useGlobalData();

  if (!open || !info) return null;

  return (
    <div style={{ padding: "8px 16px" }}>
      <Descriptions column={1} size="small" colon={false}>
        <Descriptions.Item label="Tên">
          <Text strong>{info.name || "-"}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Tên đăng nhập">{info.username || "-"}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default AccountInformation;
