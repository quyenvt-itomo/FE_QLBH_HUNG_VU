import React, { useEffect } from "react";
import { Typography } from "antd";
import { matchPath } from "react-router-dom";
import { routeTitleMap } from "../../../../constants/routeTitleMap";

const { Title, Text } = Typography;

const CustomTitle: React.FC = () => {
  const currentUrl = location.pathname;
  const matchedRoute = Object.values(routeTitleMap).find(
    (route) => typeof route.path === "string" && matchPath(route.path, currentUrl),
  );

  useEffect(() => {
    const pageTitle = matchedRoute?.title
      ? `QUAN LY BAN HANG | ${matchedRoute.title}`
      : "QUAN LY BAN HANG";
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
        {matchedRoute?.icon}
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
