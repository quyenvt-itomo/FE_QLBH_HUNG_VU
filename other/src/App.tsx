import React, { useEffect } from "react";
import PrivateLayout from "./layout/Private";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "./layout/Public";
import AuthMiddleware from "./routes/AuthMiddleware";
import NotificationManager from "./middleware/NotificationManager";
import viVN from "antd/es/locale/vi_VN";
import localConfig from "../localeConfig";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/zh-cn";
import { App as AntdApp, ConfigProvider, Layout, notification } from "antd";
import { privateRoutes, publicRoutes } from "./routes";
import NotFoundPage from "./pages/Public/error/NotFound/NotFoundPage";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "./stores/client/slice";
import { getInfo } from "./stores/auth/slice";
import { useClientData } from "./hooks/core/useClientData";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { RootState } from "./stores";
import { downloadFile } from "./utils/fileUtil";
import { resetExcel } from "./stores/excel/slice";
import { showImportResultModal } from "./components/modal/ImportResult";

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
  const dispatch = useDispatch();

  const { importResult, isCheckAdd, template, exportResult } = useSelector(
    (state: RootState) => state.Excel,
    shallowEqual,
  );

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
    setDeviceId();
    const loginData = localStorage.getItem("loginData") || sessionStorage.getItem("loginData");
    if (loginData) dispatch(getInfo());
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 768));
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

  useEffect(() => {
    if (!template) return;
    downloadFile(template.url);
    dispatch(resetExcel());
  }, [template]);

  useEffect(() => {
    if (!importResult && !isCheckAdd) return;
    dispatch(resetExcel());
    if (importResult) showImportResultModal(importResult);
  }, [importResult, isCheckAdd]);

  useEffect(() => {
    if (!exportResult) return;
    dispatch(resetExcel());
    downloadFile(exportResult.url);
  }, [exportResult, isCheckAdd]);

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: "#006EC4",
          colorText: "#323832",
          borderRadius: 5,
          fontFamily: "Be Vietnam Pro, sans-serif",
          fontSize: 14,
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
          <NotificationManager>
            <Routes>
              {publicRoutes.map((route, index) => {
                const Page = route.component;
                return (
                  <Route
                    key={`public${index}`}
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
                    key={`private${index}`}
                    path={route.path}
                    element={
                      <AuthMiddleware>
                        <PrivateLayout>
                          <Page />
                        </PrivateLayout>
                      </AuthMiddleware>
                    }
                  />
                );
              })}

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </NotificationManager>
        </AntdApp>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
