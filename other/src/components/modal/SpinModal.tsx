import { Spin } from "antd";
import React from "react";

type SpinModalProps = {
  loading: boolean;
};

const SpinModal: React.FC<SpinModalProps> = ({ loading }) => {
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
        <Spin />
      </div>
    );
  }
  return null;
};

export default SpinModal;
