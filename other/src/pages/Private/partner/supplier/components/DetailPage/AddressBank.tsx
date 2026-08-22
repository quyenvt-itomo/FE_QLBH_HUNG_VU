import { IBank, IPartner } from "../../../../../../models/partner";
import { AddressCardBase } from "../../../../../../components/card/Address";
import { BankCardBase } from "../../../../../../components/card/Banks";
import Title from "../../../../../../components/display/Title";
import AddUpdateBankModal from "../../../../../../components/BankList/AddUpdateModal";
import AddUpdateAddressModal from "../../../../../../components/AddressList/AddUpdateModal";
import { useState } from "react";
import { IAddress } from "../../../../../../models/base/interface";
import AddButton from "../../../../../../components/button/AddButton";
import { getDelayStyle } from "../../../../../../utils/style.util";

interface AddressBankProps {
  supplier: IPartner;
  onEdit?: (data: Partial<IPartner>) => void | Promise<void>;
}
type UpdateType = "address" | "bank";

interface EditAddressData extends IAddress {
  index: number;
}

const AddressBank: React.FC<AddressBankProps> = ({ supplier, onEdit }) => {
  const [openBankModal, setOpenBankModal] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [editAddressData, setEditAddressData] = useState<EditAddressData | undefined>(undefined);
  const [editBankData, setEditBankData] = useState<IBank | undefined>(undefined);

  const handleUpdate = (type: UpdateType, item: any) => {
    if (type === "address") {
      setEditAddressData(item);
      setOpenAddressModal(true);
    }

    if (type === "bank") {
      setEditBankData(item);
      setOpenBankModal(true);
    }
  };

  const handleAdd = (type: UpdateType) => {
    if (type === "address") {
      setEditAddressData(undefined);
      setOpenAddressModal(true);
    }

    if (type === "bank") {
      setEditBankData(undefined);
      setOpenBankModal(true);
    }
  };
  const handleDelete = (type: UpdateType, item: { index: number }) => {
    if (type === "address") {
      const newAddresses = supplier.addresses.filter((_, idx) => idx !== item.index);

      onEdit?.({ addresses: newAddresses, id: supplier.id });
    }

    if (type === "bank") {
      const newBanks = supplier.banks.filter((_, idx) => idx !== item.index);

      onEdit?.({ banks: newBanks, id: supplier.id });
    }
  };

  return (
    <div className="flex gap-36 w-full">
      {/* Address Card */}

      <div className="w-full">
        <div className="flex justify-between items-center">
          <Title content="Địa chỉ" level={3} className="ml-1" />
          <AddButton title="Thêm mới" onOpenAdd={() => handleAdd("address")} height={36} />
        </div>
        <div className="flex flex-col gap-6 w-full mt-4">
          {supplier.addresses.map((i, index) => (
            <AddressCardBase
              key={`address-${index}`}
              item={i}
              onEdit={() => handleUpdate("address", { ...i, index })}
              onDelete={() => handleDelete("address", { index })}
              className="slide-top"
              style={getDelayStyle(index)}
            />
          ))}
        </div>
      </div>

      {/* Bank Card */}

      <div className="w-full">
        <div className="flex justify-between items-center">
          <Title content="Tài khoản ngân hàng" level={3} className="ml-1" />
          <AddButton title="Thêm mới" onOpenAdd={() => handleAdd("bank")} height={36} />
        </div>
        <div className="flex flex-col gap-6 w-full mt-4">
          {supplier.banks.map((i, index) => (
            <BankCardBase
              key={`bank-${index}`}
              item={i}
              onEdit={() => handleUpdate("bank", { ...i, index })}
              onDelete={() => handleDelete("bank", { index })}
              className="slide-top"
              style={getDelayStyle(index)}
            />
          ))}
        </div>
      </div>

      <AddUpdateAddressModal
        open={openAddressModal}
        onClose={() => setOpenAddressModal(false)}
        editData={editAddressData}
        customer={supplier}
        onAdd={() => {}}
        onEdit={onEdit}
      />
      <AddUpdateBankModal
        open={openBankModal}
        onClose={() => setOpenBankModal(false)}
        editData={editBankData}
        customer={supplier}
        onAdd={() => {}}
        onEdit={onEdit}
      />
    </div>
  );
};

export default AddressBank;
