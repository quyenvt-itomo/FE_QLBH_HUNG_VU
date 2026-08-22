import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { publicRoutesName } from "../constants/routerName";

type NetworkCheckerProps = {
  children: React.ReactNode;
};

const NetworkChecker: React.FC<NetworkCheckerProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (!navigator.onLine) {
        navigate(publicRoutesName.errorNetwork); // Đường dẫn trang No Internet
      }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [navigate]);

  if (!isOnline) {
    return null; // Ẩn nội dung nếu không có mạng
  }

  return <>{children}</>;
};

export default NetworkChecker;
