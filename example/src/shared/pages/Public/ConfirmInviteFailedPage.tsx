import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { publicRoutesName } from "../../constants/routerName";
import { icons } from "../../assets/icons";

const ConfirmInviteFailedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50 px-4">
      <Result
        icon={
          <div className="w-full flex justify-center">
            <img src={icons.error400} alt="Error 400" className="w-64 h-64" />
          </div>
        }
        status="error"
        title="Xác nhận không hợp lệ"
        subTitle="Link có thể đã hết hạn hoặc đã được sử dụng."
        extra={[
          <Button
            type="primary"
            key="retry"
            onClick={() => navigate(publicRoutesName.login)}
          >
            Quay lại đăng nhập
          </Button>,
        ]}
      />
    </div>
  );
};

export default ConfirmInviteFailedPage;
