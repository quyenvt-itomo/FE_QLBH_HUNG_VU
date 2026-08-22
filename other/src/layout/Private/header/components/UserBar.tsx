import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../stores";
import { privateRoutesName, publicRoutesName } from "../../../../constants/routerName";
import { getInfo, logout } from "../../../../stores/auth/slice";
import {
  ArrowLeftStartOnRectangleIcon,
  BriefcaseIcon,
  LockClosedIcon,
  PlayIcon,
  StopIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Typography, Dropdown, MenuProps, App } from "antd";
import AccountInformation from "./AccountInformation";
import ChangePassword from "./ChangePassword";
import UserImage from "../../../../components/image/UserImage";
import { setFormat, setInfo } from "../../../../stores/client/slice";
import socket from "../../../../services/socket";
import { getMainImage } from "../../../../utils/fileUtil";
import { useClientData } from "../../../../hooks/core/useClientData";
import { useShiftData } from "../../../../hooks/useShiftData";
import { ShiftModal } from "./ShiftModal";
import { ShiftSummary } from "../../../../models/store/shift";
// shift print now uses React print component
import { usePrintHtml, ShiftPrint } from "../../../../components/print";

type UserBarProps = {};

const { Text } = Typography;

const UserBar: React.FC<UserBarProps> = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { modal } = App.useApp();
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalChangePassword, setOpenModalChangePassword] = useState<boolean>(false);
  const { info, currentStore, openShiftModal, handleSetOpenShiftModal, handleGetInfo } =
    useClientData();
  const { userInfo } = useSelector((state: RootState) => state.Auth, shallowEqual);
  const [currentShiftSummary, setCurrentShiftSummary] = useState<ShiftSummary | null | undefined>(
    null,
  );
  const [isPrint, setIsPrint] = useState(false);
  const { contentRef, printData, handlePrint } = usePrintHtml<any>();

  const { newShift, shiftSummary, loading, errors, openShift, closeShift, getShiftSummary } =
    useShiftData({
      isLockHook: true,
      onCloseModal: () => {
        handleSetOpenShiftModal(false);
        handleGetInfo();
      },
    });

  useEffect(() => {
    if (!shiftSummary) return;
    setCurrentShiftSummary(shiftSummary);
  }, [shiftSummary]);

  useEffect(() => {
    if (!newShift || !isPrint) return;
    handlePrint(newShift);
    setIsPrint(false);
  }, [newShift, isPrint, handlePrint]);

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

  useEffect(() => {
    const resetInfo = () => {
      dispatch(getInfo());
    };
    socket.on("role-update", resetInfo);

    return () => {
      socket.off("role-update", resetInfo);
    };
  }, []);

  const items = [
    {
      key: "info",
      label: "Thông tin tài khoản",
      icon: <UserCircleIcon className="w-5 h-5" />,
      onClick: () => setOpenModalInfo(true),
    },
    {
      key: "changePassword",
      label: "Đổi mật khẩu",
      icon: <LockClosedIcon className="w-5 h-5" />,
      onClick: () => setOpenModalChangePassword(true),
    },

    currentStore &&
      (info?.currentShift
        ? {
            key: "closeShift",
            label: "Kết thúc ca",
            icon: <StopIcon className="w-5 h-5" />,
            onClick: () => {
              handleSetOpenShiftModal(true);
              getShiftSummary(info.currentShift?.id || "");
            },
          }
        : {
            key: "openShift",
            label: "Bắt đầu ca",
            icon: <PlayIcon className="w-5 h-5" />,
            onClick: () => handleSetOpenShiftModal(true),
          }),
    {
      key: "myShift",
      label: "Ca làm việc của tôi",
      icon: <BriefcaseIcon className="w-5 h-5" />,
      onClick: () => navigate(privateRoutesName.myShift),
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
  ].filter(Boolean) as MenuProps["items"];

  const getRoleName = () => {
    if (currentStore) {
      return info?.role?.name;
    } else {
      return info?.systemRole?.name;
    }
  };

  const roleName = getRoleName();

  return (
    <div className="flex justify-end">
      <Dropdown menu={{ items }} trigger={["click"]} className="cursor-pointer">
        <section className="flex flex-row items-center gap-2" onClick={(e) => e.preventDefault()}>
          <div className="flex h-8 w-8 justify-center items-center rounded-full overflow-hidden flex-shrink-0">
            <UserImage image={getMainImage(info?.avatar)} isHiddenPreview />
          </div>
          <div className="hidden md:flex flex-row items-center">
            <div className="flex flex-col select-none">
              <Text className="font-semibold">{info?.name}</Text>
              <Text className="text-gray-400 truncate">
                {roleName || info?.username || info?.email}
              </Text>
            </div>
          </div>
        </section>
      </Dropdown>
      <AccountInformation open={openModalInfo} onClose={() => setOpenModalInfo(false)} />
      <ChangePassword
        open={openModalChangePassword}
        onClose={() => setOpenModalChangePassword(false)}
      />
      <ShiftModal
        open={openShiftModal}
        loading={loading}
        errors={errors}
        editData={info?.currentShift || undefined}
        shiftSummary={currentShiftSummary}
        onOpenShift={openShift}
        onCloseShift={closeShift}
        onSetPrinting={setIsPrint}
        onClose={() => handleSetOpenShiftModal(false)}
      />
      <div style={{ display: "none" }}>
        <div ref={contentRef}>{printData && <ShiftPrint data={printData} />}</div>
      </div>
    </div>
  );
};

export default UserBar;
