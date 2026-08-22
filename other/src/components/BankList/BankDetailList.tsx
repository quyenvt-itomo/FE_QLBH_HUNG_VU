import { CreditCardIcon } from "@heroicons/react/24/outline";
import { CSS } from "../../constants/UI";
import { IBank } from "../../models/partner";

interface AddressDetailListProps {
  title?: string;
  addresses?: IBank[];
}

const AddressDetailList: React.FC<AddressDetailListProps> = ({
  title = "Danh sách tài khoản ngân hàng",
  addresses = [],
}) => {
  return (
    <div className="flex flex-col w-full">
      <p className="font-semibold mb-4">{title}</p>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        {addresses.map((item, i) => (
          <div key={i} className="flex gap-2 group relative bg-slate-50" style={CSS.container}>
            <CreditCardIcon className="w-10 h-8" />
            <div className="flex flex-col flex-1">
              <span>
                {item.bankName} - {item.branch}
              </span>
              <span>
                {item.accountHolder} - {item.accountNumber}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressDetailList;
