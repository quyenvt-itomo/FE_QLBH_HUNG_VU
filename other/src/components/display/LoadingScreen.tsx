import { Spin } from "antd";

interface LoadingScreenProps {
  loading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ loading }) => {
  return loading ? (
    <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center z-50">
      <Spin />
    </div>
  ) : (
    <></>
  );
};

export default LoadingScreen;
