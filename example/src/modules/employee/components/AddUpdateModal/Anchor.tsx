import React, { useEffect, useMemo, useRef, useState } from "react";
import { Anchor, Collapse } from "antd";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const { Link } = Anchor;
const { Panel } = Collapse;

interface AnchorInfoProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const AnchorInfo: React.FC<AnchorInfoProps> = ({ scrollContainerRef }) => {
  const [currentAnchor, setCurrentAnchor] = useState<string>("");
  const [inkStyle, setInkStyle] = useState<{
    top: number;
    left: number;
    height: number;
    opacity: number;
  }>({
    top: 0,
    left: 0,
    height: 0,
    opacity: 0,
  });
  const anchorWrapperRef = useRef<HTMLDivElement>(null);

  const sectionIds = useMemo(
    () => [
      "basic-info",
      "personal-info",
      "identity-info",
      "education-info",
      "contact-info",
      "contact-phone-email",
      "contact-permanent-address",
      "contact-current-address",
      "contact-emergency",
      "job-info",
      "job-general",
      "job-contracts",
      "job-allowances",
      "job-deductions",
      "job-bank-account",
      "job-insurance",
    ],
    [],
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateCurrentAnchor = () => {
      const containerTop = container.getBoundingClientRect().top;
      const threshold = 24;
      let nextAnchor = "";

      sectionIds.forEach((sectionId) => {
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) return;

        const offsetTop = sectionElement.getBoundingClientRect().top - containerTop;
        if (offsetTop <= threshold) {
          nextAnchor = `#${sectionId}`;
        }
      });

      if (!nextAnchor) {
        const firstExistingSection = sectionIds.find((sectionId) =>
          document.getElementById(sectionId),
        );
        nextAnchor = firstExistingSection ? `#${firstExistingSection}` : "";
      }

      setCurrentAnchor(nextAnchor);
    };

    updateCurrentAnchor();
    container.addEventListener("scroll", updateCurrentAnchor, { passive: true });

    return () => {
      container.removeEventListener("scroll", updateCurrentAnchor);
    };
  }, [scrollContainerRef, sectionIds]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const wrapper = anchorWrapperRef.current;
      if (!wrapper || !currentAnchor) {
        setInkStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      const anchorTitle = wrapper.querySelector<HTMLAnchorElement>(
        `.ant-anchor-link-title[href="${currentAnchor}"]`,
      );
      const anchorLink = anchorTitle?.closest(".ant-anchor-link") as HTMLElement | null;

      if (!anchorLink) {
        setInkStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      const wrapperRect = wrapper.getBoundingClientRect();
      const linkRect = anchorLink.getBoundingClientRect();

      setInkStyle({
        top: linkRect.top - wrapperRect.top,
        left: linkRect.left - wrapperRect.left,
        height: linkRect.height,
        opacity: 1,
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [currentAnchor]);

  const getScrollContainer = () => scrollContainerRef.current ?? window.document.body;

  // Hàm xử lý cuộn mượt đến phần tử
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLElement>,
    link: { href: string; title: React.ReactNode },
  ) => {
    e.preventDefault();
    const targetId = link.href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    const scrollContainer = scrollContainerRef.current;

    if (targetElement && scrollContainer) {
      const targetTop =
        targetElement.getBoundingClientRect().top -
        scrollContainer.getBoundingClientRect().top +
        scrollContainer.scrollTop;

      scrollContainer.scrollTo({
        top: Math.max(0, targetTop - 12),
        behavior: "smooth",
      });
    }
  };

  return (
    <div ref={anchorWrapperRef} className="employee-anchor-shell">
      <span
        className="employee-anchor-ink"
        style={{
          top: inkStyle.top,
          left: inkStyle.left,
          height: inkStyle.height,
          opacity: inkStyle.opacity,
        }}
      />
      <Anchor
        affix={false}
        className="employee-anchor-nav"
        style={{ width: 197 }}
        getContainer={getScrollContainer}
        onClick={handleAnchorClick}
        getCurrentAnchor={() => currentAnchor}
        targetOffset={12}
      >
        <Collapse
          defaultActiveKey={["1", "2", "3"]}
          ghost
          expandIconPosition="right"
          style={{ width: 177 }}
          expandIcon={({ isActive }) => (
            <div
              className={`flex items-center justify-center mt-2.5 rounded-full transition-all ease-in-out ${isActive ? "rotate-180" : ""}`}
            >
              <ChevronDownIcon className="h-3.5" />
            </div>
          )}
        >
          <Panel
            header={
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Link
                  href="#basic-info"
                  title={<span className="font-semibold">Thông tin cơ bản</span>}
                />
              </div>
            }
            key="1"
          >
            <Link href="#personal-info" title="Thông tin cá nhân" />
            <Link href="#identity-info" title="CCCD/ Hộ chiếu" />
            <Link href="#education-info" title="Trình độ - Bằng cấp" />
          </Panel>

          <Panel
            header={
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Link
                  href="#contact-info"
                  title={<span className="font-semibold">Thông tin liên hệ</span>}
                />
              </div>
            }
            key="2"
          >
            <Link href="#contact-phone-email" title="Số điện thoại/ Email" />
            <Link href="#contact-permanent-address" title="Địa chỉ thường trú" />
            <Link href="#contact-current-address" title="Nơi ở hiện tại" />
            <Link href="#contact-emergency" title="Liên hệ khẩn cấp" />
          </Panel>

          <Panel
            header={
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Link
                  href="#job-info"
                  title={<span className="font-semibold">Thông tin công việc</span>}
                />
              </div>
            }
            key="3"
          >
            <Link href="#job-general" title="Thông tin chung" />
            <Link href="#job-contracts" title="Thông tin hợp đồng" />
            <Link href="#job-allowances" title="Các khoản phụ cấp" />
            <Link href="#job-deductions" title="Các khoản khấu trừ" />
            <Link href="#job-bank-account" title="Tài khoản ngân hàng" />
            <Link href="#job-insurance" title="Bảo hiểm xã hội" />
          </Panel>
        </Collapse>
      </Anchor>
    </div>
  );
};
