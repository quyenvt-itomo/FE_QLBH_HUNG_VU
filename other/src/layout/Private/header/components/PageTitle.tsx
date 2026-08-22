import { useClientData } from "../../../../hooks/core/useClientData";
import CustomTitle from "./Title";

const CustomPageTitle: React.FC = () => {
  const { horizontal } = useClientData();

  if (!horizontal) return null;
  return (
    <div className="mr-6 flex-grow w-full">
      <CustomTitle />
    </div>
  );
};

export default CustomPageTitle;
