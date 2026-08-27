import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDelayStyle } from "@/shared/utils/common.util";
import { privateRoutesName } from "@/shared/constants/routerName";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { Icon } from "@iconify/react";
import { Card, Layout } from "antd";

interface WelcomeScreenProps {
  title?: string;
  subTitle?: string;
  description?: string;
  buttonText?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  title = "Welcome to MS",
  subTitle = "Management System",
  description = "Manage your product, order, manufacturing.",
  buttonText = "Continue",
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { permissions } = useGlobalData();

  const rawMenuItems = [
    // checkModule(permissions, "sellOrder") && {
    //     key: privateRoutesName.sale.page,
    //     icon: <Icon icon="mdi:cart-outline" height="25" />,
    //     label: "Bán hàng",
    //     to: privateRoutesName.sale.page,
    // },
    {
      key: privateRoutesName.profile,
      icon: <Icon icon="flowbite:profile-card-outline" height="25" />,
      label: "Thông tin cá nhân",
      to: privateRoutesName.profile,
    },
  ].filter(Boolean);

  // Flatten menu items - no children
  const menuItems = rawMenuItems;

  const radius = 120;
  const angleStep = (2 * Math.PI) / menuItems.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="flex items-center justify-center h-full md:h-[calc(100vh-300px)] md:px-8">
      <Card
        classNames={{
          body: "w-full flex flex-col md:flex-row items-center justify-between p-12",
        }}
        className="max-w-6xl w-full rounded-3xl shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(255,255,255,0.1),0_4px_6px_4px_rgba(255,255,255,0.1)]"
      >
        <div className="flex-1 max-w-md">
          <h1 className="text-5xl font-bold mb-4 slide-right" style={getDelayStyle()}>
            <span className="text-primary">{title}</span>
          </h1>
          <h2
            className="text-2xl font-semibold text-orange mb-6 slide-right"
            style={getDelayStyle(1)}
          >
            {subTitle}
          </h2>
          <p className="text-secondary mb-8 leading-relaxed slide-right" style={getDelayStyle(2)}>
            {description}
          </p>

          <div className="relative inline-block" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-primary/20 hover:bg-primary/30 text-primary font-medium px-8 py-3 rounded-full transition-all ease-in-out hover:scale-105 relative z-10 slide-right"
              style={getDelayStyle(3)}
            >
              {buttonText}
            </button>

            {showMenu && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                {menuItems.map((item: any, index) => {
                  const angle = index * angleStep - Math.PI / 2;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <Link
                      key={item.key}
                      to={item.to}
                      className="
                      circular-menu-item absolute bg-orange hover:bg-orange text-white hover:text-white
                      rounded-full p-4 shadow-lg 
                      transition-all ease-in-out flex items-center justify-center group"
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        animationDelay: `${index * 0.1}s`,
                        opacity: 0,
                      }}
                      title={item.label}
                    >
                      {item.icon}
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white px-2 py-1 rounded z-10">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center slide-left">
          <div className="relative w-96 h-86">
            <svg viewBox="0 0 500 400" className="w-full h-full">
              {/* Background circle */}
              <circle cx="350" cy="200" r="150" fill="#16a34a" opacity="0.1" />

              {/* Decorative blocks - floating animation */}
              <g className="animate-float">
                <rect x="300" y="120" width="20" height="20" fill="#16a34a" opacity="0.6" rx="3" />
                <rect x="325" y="120" width="20" height="20" fill="#16a34a" opacity="0.6" rx="3" />
                <rect x="350" y="120" width="20" height="20" fill="#16a34a" opacity="0.6" rx="3" />
              </g>

              <g className="animate-float-delay">
                <rect x="450" y="150" width="15" height="15" fill="#16a34a" opacity="0.6" rx="3" />
                <rect x="470" y="150" width="15" height="15" fill="#16a34a" opacity="0.6" rx="3" />
                <rect x="460" y="170" width="15" height="15" fill="#16a34a" opacity="0.6" rx="3" />
              </g>

              {/* Car with subtle movement */}
              <g className="animate-float">
                <rect
                  x="280"
                  y="240"
                  width="140"
                  height="80"
                  fill="#16a34a"
                  opacity="0.7"
                  rx="10"
                />
                <rect x="300" y="260" width="100" height="40" fill="#1a5f01" />
                <circle cx="310" cy="320" r="20" fill="#4A4A4A" />
                <circle cx="390" cy="320" r="20" fill="#4A4A4A" />
                <circle cx="310" cy="320" r="12" fill="#2A2A2A" />
                <circle cx="390" cy="320" r="12" fill="#2A2A2A" />

                {/* Person 2 on car */}
                <circle cx="420" cy="200" r="20" fill="#FF5400" />
                <rect x="410" y="220" width="20" height="30" fill="#FF5400" opacity="0.7" rx="10" />
              </g>

              {/* Person 1 - floating */}
              <g className="animate-float-delay">
                <circle cx="180" cy="200" r="25" fill="#FF5400" />
                <rect x="165" y="225" width="30" height="50" fill="#16a34a" opacity="0.8" rx="15" />
                <rect x="155" y="240" width="15" height="35" fill="#1a5f01" rx="8" />
                <rect x="190" y="240" width="15" height="35" fill="#1a5f01" rx="8" />
              </g>

              {/* Plants - gentle sway */}
              <g className="animate-float">
                <ellipse cx="120" cy="310" r="30" ry="15" fill="#16a34a" opacity="0.3" />
                <path
                  d="M 120 280 Q 110 300 120 310 Q 130 300 120 280"
                  fill="#16a34a"
                  opacity="0.5"
                />
                <path d="M 125 285 Q 135 295 130 310" fill="#1a5f01" />
              </g>

              <g className="animate-float-delay">
                <ellipse cx="240" cy="320" r="25" ry="12" fill="#16a34a" opacity="0.3" />
                <path
                  d="M 240 295 Q 235 310 240 320 Q 245 310 240 295"
                  fill="#16a34a"
                  opacity="0.5"
                />
              </g>

              <g className="animate-float">
                <ellipse cx="460" cy="310" r="28" ry="14" fill="#16a34a" opacity="0.3" />
                <path
                  d="M 460 285 Q 452 305 460 310 Q 468 305 460 285"
                  fill="#16a34a"
                  opacity="0.5"
                />
                <path d="M 465 288 Q 472 300 468 310" fill="#1a5f01" />
              </g>
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
};
