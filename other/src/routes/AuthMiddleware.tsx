import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "../stores";
import { publicRoutesName } from "../constants/routerName";

type AuthMiddlewareProps = {
  children: React.ReactNode;
};

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = window.location;

  const { loginData, isCheckUnAuthor } = useSelector(
    (state: RootState) => ({
      loginData: state.Auth.loginData,
      isCheckUnAuthor: state.Auth.isCheckUnAuthor,
    }),
    shallowEqual,
  );

  useEffect(() => {
    const loginDataOld =
      localStorage.getItem("loginData") || sessionStorage.getItem("loginData");
    const checkAccess = () => {
      if (!loginDataOld) {
        navigate(publicRoutesName.login);
        return;
      }
    };

    checkAccess();
  }, [pathname, loginData, isCheckUnAuthor, navigate]);

  return <>{children}</>;
};

export default AuthMiddleware;
