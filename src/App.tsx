import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import viVN from "antd/es/locale/vi_VN";
import localConfig from "../localeConfig";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/zh-cn";
import { App as AntdApp, ConfigProvider, notification, theme as antdTheme } from "antd";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useGlobalData } from "./shared/hooks/useGlobalData";
import { useAuth } from "./shared/hooks/useAuth";
import { privateRoutes, publicRoutes, standalonePrivateRoutes } from "./routes";
import NotFoundPage from "./shared/pages/Public/error/NotFound/NotFoundPage";
import PublicLayout from "./shared/layout/Public";
import AuthMiddleware from "./shared/middleware/AuthMiddleware";
import PrivateLayout from "./shared/layout/Private";
import { privateRoutesName } from "./shared/constants";

dayjs.locale("vi");

localConfig.locale("vi");

async function setDeviceId() {
  const oldDeviceId = localStorage.getItem("deviceId");

  if (oldDeviceId) return;

  const fp = await FingerprintJS.load();
  const result = await fp.get();
  localStorage.setItem("deviceId", result.visitorId);
}

const App: React.FC = () => {
  const { themeMode, handleSetIsMobile } = useGlobalData();
  const { getInfo } = useAuth();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then(() => {
        // console.log("✅ Service Worker Registered");
      });
    });

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // console.log("✅ Service Worker registered", reg);
      })
      .catch((err) => {
        // console.error("❌ SW register failed", err);
      });
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  useEffect(() => {
    setDeviceId();
    const loginData = localStorage.getItem("loginData") || sessionStorage.getItem("loginData");
    if (loginData) getInfo();
    const handleResize = () => {
      handleSetIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      notification.success({
        message: "Kết nối mạng đã được khôi phục",
        description: "Bạn đã kết nối lại thành công.",
        placement: "topRight",
        duration: 3,
        showProgress: true,
        closable: true,
        pauseOnHover: false,
      });
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  useEffect(() => {
    const loader = document.getElementById("initial-loader");
    if (loader) {
      loader.classList.add("hide");

      setTimeout(() => {
        loader.remove();
      }, 900);
    }
  }, []);

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        algorithm: themeMode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#16A34A",
          // borderRadius: 8,
          controlHeight: 32,
          fontSize: 14,
        },
        components: {
          Input: {
            controlHeight: 32,
            paddingInline: 12,
          },
          InputNumber: {
            controlHeight: 32,
            paddingInline: 12,
          },
          Select: {
            controlHeight: 32,
          },
          Button: {
            controlHeight: 32,
          },
        },
      }}
      typography={{
        style: {
          margin: 0,
        },
      }}
    >
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AntdApp>
          <Routes>
            {publicRoutes.map((route, index) => {
              const Page = route.component;
              return (
                <Route
                  key={`public-${index}`}
                  path={route.path}
                  element={
                    <PublicLayout>
                      <Page />
                    </PublicLayout>
                  }
                />
              );
            })}
            {privateRoutes.map((route, index) => {
              const Page = route.component;
              return (
                <Route
                  key={`private-${index}`}
                  path={route.path}
                  element={
                    <AuthMiddleware>
                      {route.path === privateRoutesName.pos ? (
                        <Page />
                      ) : (
                        <PrivateLayout>
                          <Page />
                        </PrivateLayout>
                      )}
                    </AuthMiddleware>
                  }
                />
              );
            })}
            {standalonePrivateRoutes.map((route, index) => {
              const Page = route.component;
              return (
                <Route
                  key={`standalone-private-${index}`}
                  path={route.path}
                  element={
                    <AuthMiddleware>
                      <Page />
                    </AuthMiddleware>
                  }
                />
              );
            })}

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AntdApp>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
