import React, { useEffect, useRef } from "react";
import { Typography } from "antd";
import { matchPath } from "react-router-dom";
import { routeTitleMap } from "@/shared/constants/routerName";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { getPageTitle } from "@/shared/utils/common.util";

const { Title, Text } = Typography;

export const CustomTitle: React.FC = () => {
  const { totalUnreadNotifications, customTitle, currentCompany } = useGlobalData();
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

  const pageTitle = getPageTitle(matchedRoute?.title || customTitle, currentCompany?.name);

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
      className="h-full max-h-11 flex items-center fade-in"
      title={customTitle || matchedRoute?.title || ""}
    >
      <div className="flex flex-col">
        <Title
          level={5}
          style={{
            fontSize: "1rem",
            marginBottom: 0,
            lineHeight: "1.4rem",
            fontWeight: 500,
          }}
        >
          {customTitle || matchedRoute?.title || ""}
        </Title>

        {matchedRoute?.subtitle ? (
          <Text
            type="secondary"
            style={{
              fontSize: "0.7rem",
              lineHeight: "0.8rem",
            }}
          >
            {matchedRoute.subtitle}
          </Text>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
