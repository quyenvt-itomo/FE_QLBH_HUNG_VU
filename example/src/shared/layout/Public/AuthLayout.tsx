import React from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "@/shared/constants/enum";

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Tiêu đề chính của form */
  title: React.ReactNode;
  /** Mô tả ngắn phía dưới tiêu đề */
  subtitle?: React.ReactNode;
  /** Khi có thì hiển thị nút quay lại phía trên title */
  showBackButton?: boolean;
  /** Nội dung phụ hiển thị dưới cùng form (vd: chuyển trang, footer) */
  footer?: React.ReactNode;
}

/**
 * Layout dùng chung cho các trang auth.
 *  - Bên trái: panel thương hiệu với hình minh hoạ
 *  - Bên phải: card form trắng, bo góc, có shadow nhẹ
 *  - Tuân theo phong cách dashboard (rounded, border, soft shadow, primary color)
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  footer,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {/* Brand panel */}
      <section className="hidden md:flex h-full flex-1 relative items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 p-12 max-w-4xl">
          <div className="mb-8 inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Icon icon="ic:twotone-factory" width="24" height="24" className="mr-2 text-white/80" />
            <span className="text-white font-label-md tracking-wider">
              TOTO PAINT MANUFACTURING PORTAL
            </span>
          </div>
          <h1 className="font-headline-lg text-4xl lg:text-5xl text-white mb-6 leading-tight">
            Nâng tầm quy trình sản xuất sơn với công nghệ ERP hiện đại.
          </h1>
          <p className="text-primary-fixed font-body-lg opacity-90 mb-12 text-white/90">
            Hệ thống quản trị nguồn lực doanh nghiệp tối ưu hóa chuỗi cung ứng, quản lý kho và kiểm
            soát chất lượng chuẩn quốc tế.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-secondary-fixed-dim font-headline-lg block mb-2 text-white/70">
                99.9%
              </span>
              <span className="text-white/70 font-label-sm uppercase tracking-widest">
                Độ chính xác dữ liệu
              </span>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-secondary-fixed-dim font-headline-lg block mb-2 text-white/70">
                24/7
              </span>
              <span className="text-white/70 font-label-sm uppercase tracking-widest">
                Giám sát vận hành
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-3/4 h-3/4 opacity-20 pointer-events-none">
          <img
            alt="Modern Manufacturing Technology"
            className="w-full h-full object-cover grayscale"
            src="/auth-panel-bg.png"
          />
        </div>
      </section>

      {/* Form panel */}
      <div className="w-full lg:w-[512px] h-full items-center justify-center bg-white flex-shrink-0 flex flex-col">
        {/* Logo trên mobile */}
        <div className="flex lg:hidden items-center gap-2 mb-4">
          <img src="/logo.jpg" alt="Logo" className="h-10" />
          <span className="text-2xl font-bold">{APP_NAME}</span>
        </div>

        {showBackButton && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm hover:text-primary transition-colors mb-4 self-start"
          >
            <Icon icon="solar:alt-arrow-left-linear" width="20" height="20" />
            Quay lại
          </button>
        )}

        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm">{subtitle}</p>}
          </div>

          <div className="flex flex-col h-fit">{children}</div>

          {footer && (
            <div className="mt-6 pt-4 border-t !border-gray-300 text-center text-sm">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
