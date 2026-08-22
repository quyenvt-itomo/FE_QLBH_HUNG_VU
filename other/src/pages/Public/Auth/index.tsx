import { useEffect } from "react";
import { icons } from "../../../assets/icons";
import { refreshAuthToken } from "../../../utils/common";
import { useNavigate } from "react-router-dom";
import { privateRoutesName, publicRoutesName } from "../../../constants/routerName";
import { getInfo } from "../../../stores/auth/slice";
import { useDispatch } from "react-redux";

const AuthPage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const refreshToken = params.get("refreshToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!refreshToken) return;

    const handleRefresh = async () => {
      try {
        const response = await refreshAuthToken({ refreshToken });
        if (response) {
          navigate(privateRoutesName.dashboard);
          dispatch(getInfo());
        } else {
          navigate(publicRoutesName.login);
        }
      } catch (error) {
        console.error("refresh failed", error);
        navigate(publicRoutesName.login);
      }
    };

    handleRefresh();
  }, [refreshToken]);

  return (
    <div className="flex justify-center items-center w-full">
      <img src={icons.Loading} width={700} />
    </div>
  );
};

export default AuthPage;
function useAppDispatch() {
  throw new Error("Function not implemented.");
}
