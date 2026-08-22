import React, { useEffect, useState } from "react";
import { Anchor } from "antd";
import "./index.css";

const { Link } = Anchor;

const AnchorInfo: React.FC = () => {
  const [activeLink, setActiveLink] = useState<string>("");

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLElement>,
    link: { href: string },
  ) => {
    e.preventDefault();

    const targetId = link.href.replace("#", "");
    const el = document.getElementById(targetId);

    if (el) {
      window.history.replaceState(null, "", link.href);

      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <Anchor
      affix
      offsetTop={100}
      style={{ width: 260 }} // tăng container
      className="custom-anchor"
      onClick={handleAnchorClick}
      onChange={(currentLink) => {
        setActiveLink(currentLink);
      }}
      getCurrentAnchor={() => activeLink}
    >
      <Link href="#info" title="Thông tin chung" />
      <Link href="#representative" title="Người đại diện" />
      <Link href="#contacts" title="Người liên hệ" />
    </Anchor>
  );
};

export default AnchorInfo;
