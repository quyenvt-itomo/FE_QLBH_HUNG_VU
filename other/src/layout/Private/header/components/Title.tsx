import React, { useEffect, useRef } from "react";
import { Typography } from "antd";
import { matchPath } from "react-router-dom";
import { routeTitleMap } from "../../../../constants/routeTitleMap";
import { useClientData } from "../../../../hooks/core/useClientData";

const { Title, Text } = Typography;

const CustomTitle: React.FC = () => {
  const { totalUnreadNotifications, customTitle, handleSetCustomTitle } = useClientData();
  const currentUrl = location.pathname;
  const matchedRoute = Object.values(routeTitleMap)
    .sort((a, b) => {
      const aScore = a.path?.includes(":") ? 1 : 0;
      const bScore = b.path?.includes(":") ? 1 : 0;
      return aScore - bScore;
    })
    .find((route) =>
      typeof route.path === "string"
        ? matchPath({ path: route.path, end: true }, currentUrl)
        : false,
    );

  const blinkRef = useRef<number | null>(null);
  const showingUnread = useRef(false);

  const pageTitle =
    matchedRoute?.title || customTitle
      ? `QUAN LY BAN HANG | ${customTitle || matchedRoute?.title}`
      : "QUAN LY BAN HANG";

  useEffect(() => {
    document.title = pageTitle;

    if (totalUnreadNotifications > 0) {
      // Bật blinking title
      blinkRef.current = window.setInterval(() => {
        document.title = showingUnread.current
          ? `(${totalUnreadNotifications}) Thông báo chưa đọc`
          : pageTitle;
        showingUnread.current = !showingUnread.current;
      }, 1000);
    }

    return () => {
      if (blinkRef.current) {
        window.clearInterval(blinkRef.current);
      }
      document.title = customTitle || pageTitle; // reset title khi unmount
    };
  }, [matchedRoute, customTitle, totalUnreadNotifications]);

  return (
    <div
      className="h-full max-h-11 flex flex-col justify-center fade-in"
      title={customTitle || matchedRoute?.title || ""}
    >
      <div className="flex gap-2 items-center">
        <div className="w-[25px] h-[25px] flex items-center justify-center flex-shrink-0">
          {matchedRoute?.icon}
        </div>
        <Title
          level={5}
          style={{
            fontSize: "1.4rem",
            marginBottom: 0,
            lineHeight: "1.4rem",
            fontWeight: 500,
          }}
        >
          {customTitle || matchedRoute?.title || ""}
        </Title>
      </div>

      {matchedRoute?.subtitle ? (
        <Text
          type="secondary"
          className="xl:hidden block"
          style={{
            fontSize: "0.8rem",
            lineHeight: "0.8rem",
            marginTop: "4px",
          }}
        >
          {matchedRoute.subtitle}
        </Text>
      ) : (
        ""
      )}
    </div>
  );
};

export default CustomTitle;
