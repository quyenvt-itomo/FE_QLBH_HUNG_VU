import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { publicRoutesName } from "../constants/routerName";

type AuthMiddlewareProps = {
  children: React.ReactNode;
};

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = window.location;

  useEffect(() => {
    const loginDataOld = localStorage.getItem("loginData") || sessionStorage.getItem("loginData");
    const checkAccess = () => {
      if (!loginDataOld) {
        navigate(publicRoutesName.login);
        return;
      }
    };

    checkAccess();
  }, [pathname, navigate]);

  return <>{children}</>;
};

export default AuthMiddleware;
