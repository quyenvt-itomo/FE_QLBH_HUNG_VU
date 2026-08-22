import { Badge, Button, List, Spin, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { icons } from "../../../../assets/icons";

import { useClientData } from "../../../../hooks/core/useClientData";
import { useNotificationData } from "../../../../hooks/core/useNotificationData";
import { useHandleNotification } from "../../../../hooks/core/useHandleNotification";
import { NotificationData } from "../../../../models/base/notification";
import socket from "../../../../services/socket";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import { LoadingOutlined } from "@ant-design/icons";
import { formatDateDDMMYYYY } from "../../../../utils/dateUtils";

const Highlight: React.FC<{ value: string }> = ({ value }) => (
  <span className="px-2 bg-primary/5 text-primary rounded-md">{value}</span>
);

const renderContent = (item: NotificationData) => {
  if (!item.content) return null;

  const parts = item.content.split(/\$\{\}/); // tách theo ${}
  const highlights = item.metadata?.highlightValues || [];

  // Chỉ lấy số lượng highlight vừa đủ với placeholder
  const limitedHighlights = highlights.slice(0, parts.length - 1);

  const result: React.ReactNode[] = [];
  parts.forEach((part, index) => {
    result.push(part);
    if (limitedHighlights[index] !== undefined) {
      result.push(<Highlight key={index} value={limitedHighlights[index]} />);
    }
  });

  return result;
};

function formatNotificationText(item: NotificationData): string {
  if (!item.content) return "";

  const parts = item.content.split(/\$\{\}/);
  const highlights = item.metadata?.highlightValues || [];

  const limitedHighlights = highlights.slice(0, parts.length - 1);

  let result = "";

  parts.forEach((part, index) => {
    result += part;
    if (limitedHighlights[index] !== undefined) {
      result += limitedHighlights[index]; // ✅ chèn text thuần
    }
  });

  return result;
}

// Sử dụng trong JSX
export const NotificationComponent: React.FC<{ item: NotificationData }> = ({ item }) => (
  <div>{renderContent(item)}</div>
);

const Notification: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [reload, setReload] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const { info, handleSetTotalUnread, totalUnreadNotifications } = useClientData();

  const {
    notificationData,
    loading,
    totalUnread,
    pagination,
    seenNotifications,
    seenAllNotifications,
  } = useNotificationData({
    page,
    size: 10,
    reload,
    onCloseModal: () => {},
  });

  const { handleNotificationType } = useHandleNotification();

  const bellIconRef = useRef<HTMLDivElement>(null);
  const notifyTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (totalUnread !== totalUnreadNotifications) {
      handleSetTotalUnread(totalUnread);
      setPage(1);
      setReload((prev) => !prev);
    }
  }, [totalUnread]);

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setNotifications(notificationData);
      return;
    }

    setNotifications((prevList) => {
      const newValues = new Set(notificationData.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...notificationData];
    });
  }, [notificationData]);

  // useEffect(() => {
  //   if (info?.id) {
  //     socket.emit("register", info.id);
  //   }

  //   const handleNewNotification = (newNotification: NotificationData) => {
  //     setNotifications((prevList) => [newNotification, ...prevList]);
  //     handleSetTotalUnread(totalUnreadNotifications + 1);
  //   };

  //   socket.on("notification", handleNewNotification);

  //   return () => {
  //     socket.off("notification", handleNewNotification);
  //   };
  // }, [info?.id]);

  useEffect(() => {
    if (!info?.id) return;

    socket.emit("register", info.id);

    const handleConnect = () => {
      console.log("Socket connected");
      socket.emit("register", info.id);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    const handleReconnect = () => {
      console.log("Socket reconnected");
      socket.emit("register", info.id);
    };

    const handleNewNotification = (newNotification: NotificationData) => {
      setNotifications((prevList) => [newNotification, ...prevList]);
      handleSetTotalUnread(totalUnreadNotifications + 1);
    };

    socket.on("notification", handleNewNotification);
    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect", handleReconnect);

    // If already connected, register immediately
    if (socket.connected) {
      socket.emit("register", info.id);
    }

    return () => {
      socket.off("notification", handleNewNotification);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect", handleReconnect);
    };
  }, [info?.id]);

  const handleViewMore = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPage((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bellIconRef.current &&
        !bellIconRef.current.contains(event.target as Node) &&
        notifyTableRef.current &&
        !notifyTableRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Dọn dẹp listener khi component unmount hoặc khi showNotifications thay đổi
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleClickNotification = (item: NotificationData) => {
    if (!item.isRead) {
      handleSetTotalUnread(totalUnreadNotifications > 0 ? totalUnreadNotifications - 1 : 0);
      setNotifications((prevList) =>
        prevList.map((notif) => {
          if (notif.id === item.id) {
            return { ...notif, isRead: true };
          }
          return notif;
        }),
      );
      seenNotifications([item.id]);
    }

    handleNotificationType(item);
  };

  const handleSeenAll = () => {
    if (totalUnreadNotifications === 0) return;
    handleSetTotalUnread(0);
    setNotifications((prevList) => prevList.map((notif) => ({ ...notif, isRead: true })));
    seenAllNotifications();
  };

  return (
    <div className="flex gap-4 items-center">
      <section
        className="flex items-center cursor-pointer relative select-none h-16"
        ref={bellIconRef}
        onClick={() => setShowNotifications((prev) => !prev)}
      >
        <Badge count={totalUnreadNotifications} size="small">
          <img src={icons.Bell} />
        </Badge>
        {showNotifications && (
          <div
            className="absolute -right-4 w-[520px] max-w-[calc(100vw-32px)] top-16 -mt-2 bg-white drop-shadow-2xl rounded-xl z-10 notify__table max-h-[80vh] flex flex-col"
            ref={notifyTableRef}
          >
            <div className=" flex items-center justify-between px-4 py-3 border-b bg-primary rounded-xl rounded-b-none relative">
              <div className="h-4 w-4 rotate-45 bg-primary absolute right-[18px] -top-1"></div>
              <Typography.Title level={5} className="p-0 m-0">
                <span className="text-white">Thông báo</span>
              </Typography.Title>

              {totalUnreadNotifications > 0 && (
                <button
                  className="text-white/90 hover:text-white transition-all ease-in-out"
                  onClick={handleSeenAll}
                >
                  Đọc tất cả
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              <List
                loading={loading}
                dataSource={notifications}
                size="small"
                className="notify__all"
                renderItem={(item) => (
                  <List.Item
                    className={
                      item?.isRead
                        ? "hover:bg-blue-100 cursor-pointer"
                        : "bg-blue-50 hover:bg-blue-100 cursor-pointer"
                    }
                    onClick={() => handleClickNotification(item)}
                  >
                    <List.Item.Meta
                      title={
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-bold truncate">{item?.title}</span>
                          <span className="text-gray-500 text-xs whitespace-nowrap">
                            {formatDateDDMMYYYY(item?.createdAt)}
                          </span>
                        </div>
                      }
                      description={
                        <div className="text-black line-clamp-2">
                          <NotificationComponent item={item} />
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>

            <div className="flex justify-center border-t py-2">
              {!!notifications?.length &&
                notifications?.length < (pagination?.totalRecords || 10) && (
                  <Button
                    type="link"
                    icon={
                      !loading ? (
                        <ChevronDoubleDownIcon className="w-5 h-4" />
                      ) : (
                        <Spin indicator={<LoadingOutlined spin />} size="small" />
                      )
                    }
                    iconPosition="end"
                    onClick={handleViewMore}
                    className="text-primary"
                  >
                    Xem thêm
                  </Button>
                )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Notification;
