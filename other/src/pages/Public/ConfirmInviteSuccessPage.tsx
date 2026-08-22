import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { publicRoutesName } from "../../constants/routerName";
import { icons } from "../../assets/icons";

const ConfirmInviteSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50 px-4">
      <Result
        icon={
          <div className="w-full flex justify-center">
            <img src={icons.success} alt="Success 200" className="w-64 h-64" />
          </div>
        }
        status="success"
        title="Xác nhận lời mời thành công!"
        subTitle="Bạn có thể quay lại trình duyệt ban đầu để tiếp tục đăng nhập."
        extra={[
          <Button
            type="primary"
            key="login"
            onClick={() => navigate(publicRoutesName.login)}
          >
            Về trang đăng nhập
          </Button>,
        ]}
      />
    </div>
  );
};

export default ConfirmInviteSuccessPage;
