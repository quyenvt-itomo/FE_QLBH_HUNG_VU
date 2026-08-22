import { Button } from "antd";

interface NavigateButtonsProps {
  moreButton?: React.ReactNode;
  onBack?: () => void;
  onEdit?: () => void;
}

const NavigateButtons: React.FC<NavigateButtonsProps> = ({ moreButton, onBack, onEdit }) => {
  return (
    <div className="flex gap-3">
      {onBack && (
        <Button type="default" htmlType="button" onClick={onBack} className="w-24 rounded-lg ">
          Quay lại
        </Button>
      )}

      {moreButton}

      {onEdit && (
        <Button type="primary" htmlType="button" onClick={onEdit} className="w-24 rounded-lg ">
          Chỉnh sửa
        </Button>
      )}
    </div>
  );
};

export default NavigateButtons;
