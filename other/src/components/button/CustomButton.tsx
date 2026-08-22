import { Button, ButtonProps } from "antd";

const CustomButton: React.FC<ButtonProps> = ({ className, ...rest }) => {
  return <Button className={className + " bg-primary text-white  rounded-lg"} {...rest} />;
};

export default CustomButton;
