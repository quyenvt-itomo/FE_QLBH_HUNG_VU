import React, { useEffect } from "react";
import { Typography } from "antd";
import { matchPath } from "react-router-dom";
import { routeTitleMap } from "@/shared/constants/routerName";
import { getPageTitle } from "@/shared/utils/common.util";

const { Title } = Typography;

const CustomTitle: React.FC = () => {
  const currentUrl = location.pathname;
  const matchedRoute = Object.values(routeTitleMap).find(
    (route) => typeof route.path === "string" && matchPath(route.path, currentUrl),
  );

  useEffect(() => {
    const pageTitle = getPageTitle(matchedRoute?.title);
    document.title = pageTitle;
  }, [matchedRoute]);

  return (
    <div
      style={{
        margin: 0,
        height: "100%",
        maxHeight: "44px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div className="flex gap-1 items-center">
        <Title
          level={5}
          style={{
            fontSize: "1.3rem",
            marginBottom: 0,
            lineHeight: "1.3rem",
            fontWeight: 500,
          }}
        >
          {matchedRoute?.title || ""}
        </Title>
      </div>
    </div>
  );
};

export default CustomTitle;
