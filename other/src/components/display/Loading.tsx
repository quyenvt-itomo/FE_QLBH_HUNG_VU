import { Spin } from "antd";

interface LoadingProps {
  loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
  return (
    <div
      className="flex w-full items-center justify-center z-50 transition-all ease-in-out overflow-hidden"
      style={{
        height: loading ? 80 : 0,
      }}
    >
      <Spin />
    </div>
  );
};

export default Loading;
