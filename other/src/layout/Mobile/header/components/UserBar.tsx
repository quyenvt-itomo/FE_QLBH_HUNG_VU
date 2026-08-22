import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../stores";
import { privateRoutesName, publicRoutesName } from "../../../../constants/routerName";
import { logout } from "../../../../stores/auth/slice";
import {
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Typography, Dropdown, MenuProps, App } from "antd";
import AccountInformation from "./AccountInformation";
import ChangePassword from "./ChangePassword";
import { setFormat, setInfo } from "../../../../stores/client/slice";
import { getMainImage } from "../../../../utils/fileUtil";
import { buildFileUrl } from "../../../../utils/paramUtils";
import defaultAvatar from "../../../../assets/defaultAvatar.jpg";

type UserBarProps = {};

const { Text } = Typography;

const UserBar: React.FC<UserBarProps> = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { modal } = App.useApp();
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalChangePassword, setOpenModalChangePassword] = useState<boolean>(false);

  const { userInfo } = useSelector((state: RootState) => state.Auth, shallowEqual);

  const handleLogout = () => {
    modal.confirm({
      title: "Đăng xuất",
      content: "Xác nhận đăng xuất",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        dispatch(logout());
        localStorage.removeItem("loginData");
        setTimeout(() => {
          navigate(publicRoutesName.login);
        }, 1000);
      },
    });
  };

  useEffect(() => {
    if (!userInfo) return;

    dispatch(setInfo(userInfo));
    dispatch(setFormat(userInfo.format || userInfo.settings || null));

    // subscribePush();
  }, [userInfo]);

  const items: MenuProps["items"] = [
    {
      key: "info",
      label: "Thông tin tài khoản",
      icon: <UserCircleIcon className="w-5 h-5" />,
      onClick: () => {
        setOpenModalInfo(true);
      },
    },
    {
      key: "changePassword",
      label: "Đổi mật khẩu",
      icon: <LockClosedIcon className="w-5 h-5" />,
      onClick: () => setOpenModalChangePassword(true),
    },
    {
      key: "settings",
      label: "Cài đặt",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      onClick: () => navigate(privateRoutesName.setting),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: () => {
        handleLogout();
        localStorage.clear();
        sessionStorage.clear();
      },
      icon: <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />,
    },
  ];
  const avatar = getMainImage(userInfo?.avatar)?.thumbnailUrl || "";
  return (
    <div className="flex justify-end">
      <Dropdown menu={{ items }} trigger={["click"]} className="cursor-pointer">
        <section className="flex flex-row items-center gap-2" onClick={(e) => e.preventDefault()}>
          <div className="flex h-8 w-8 justify-center items-center rounded-full overflow-hidden">
            <img
              src={avatar ? buildFileUrl(avatar) : defaultAvatar}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/defaultAvatar.jpg";
              }}
            />
          </div>
          <div className="hidden md:flex flex-row items-center">
            <div className="flex flex-col select-none">
              <Text className="font-semibold">{userInfo?.name || userInfo?.username}</Text>
              <Text className="text-gray-400">{userInfo?.username}</Text>
            </div>
          </div>
        </section>
      </Dropdown>
      <AccountInformation open={openModalInfo} onClose={() => setOpenModalInfo(false)} />
      <ChangePassword
        open={openModalChangePassword}
        onClose={() => setOpenModalChangePassword(false)}
      />
    </div>
  );
};

export default UserBar;
