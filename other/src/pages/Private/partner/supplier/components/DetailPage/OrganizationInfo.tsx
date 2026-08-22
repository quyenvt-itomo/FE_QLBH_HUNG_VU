import { Card, Col, Input, Row } from "antd";
import Title from "../../../../../../components/display/Title";
import { IPartner } from "../../../../../../models/partner";
import EditableInfoRow from "../../../../../../components/display/EditableInfoRow";
import AddButton from "../../../../../../components/button/AddButton";
import AddUpdateContactModal from "../AddPage/AddUpdateContactModal";
import { useState } from "react";
import InfoRow from "../../../../../../components/display/InfoRow";
import Label from "../../../../../../components/display/Label";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import ActionButtonsNoHover from "../../../../../../components/button/ActionButtonsNoHover";
import { IContact } from "../../../../../../models/partnerContact";
import { useSupplierContactData } from "../../../../../../hooks/partner/useSupplierContactData";

interface OrganizationInfoProps {
  supplier: IPartner;
  onEdit?: (data: Partial<IPartner>) => void | Promise<void>;
  onReload?: () => void;
}

export const OrganizationInfo: React.FC<OrganizationInfoProps> = ({
  supplier,
  onEdit,
  onReload,
}) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<IContact | undefined>(undefined);
  const { addSupplierContact, updateSupplierContact, deleteSupplierContact } =
    useSupplierContactData({
      partnerId: supplier.id,
      onCloseModal: () => {
        onReload?.();
      },
    });

  return (
    <div className="shadow-md bg-white rounded-2xl overflow-hidden slide-left border border-gray-100 h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide mb-4">
      <div className="p-4 h-full">
        <Title content="Người đại diện" level={3} />
        <Row className="px-8 py-6" gutter={[108, 28]}>
          <Col lg={12} xs={24}>
            <EditableInfoRow<IPartner>
              label="Tên người đại diện"
              value={supplier?.representative?.name}
              fieldKey={"representativeName" as any}
              required
              onUpdate={(data: any) => {
                return onEdit?.({
                  id: supplier.id,
                  representative: {
                    ...supplier.representative,
                    name: data.representativeName as any,
                  },
                });
              }}
              editComponent={<Input className="h-8" placeholder="Nhập tên người đại diện" />}
              width={200}
            />
            <EditableInfoRow<IPartner>
              label="Chức vụ"
              value={supplier?.representative?.position}
              fieldKey={"representativePosition" as any}
              required
              onUpdate={(data: any) => {
                return onEdit?.({
                  id: supplier.id,
                  representative: {
                    ...supplier.representative,
                    position: data.representativePosition as any,
                  },
                });
              }}
              editComponent={<Input className="h-8" placeholder="Nhập tên người đại diện" />}
              width={200}
            />
          </Col>
          <Col lg={12} xs={24}>
            <EditableInfoRow<IPartner>
              label="Email"
              value={supplier?.representative?.email}
              fieldKey={"representativeEmail" as any}
              required
              onUpdate={(data: any) => {
                return onEdit?.({
                  id: supplier.id,
                  representative: {
                    ...supplier.representative,
                    email: data.representativeEmail as any,
                  },
                });
              }}
              editComponent={<Input className="h-8" placeholder="Nhập email người đại diện" />}
              width={200}
            />
            <EditableInfoRow<IPartner>
              label="Số điện thoại"
              value={supplier?.representative?.phone}
              fieldKey={"representativePhone" as any}
              required
              onUpdate={(data: any) => {
                return onEdit?.({
                  id: supplier.id,
                  representative: {
                    ...supplier.representative,
                    phone: data.representativePhone as any,
                  },
                });
              }}
              editComponent={
                <Input className="h-8" placeholder="Nhập số điện thoại người đại diện" />
              }
              width={200}
            />
          </Col>
        </Row>
        <div className="flex justify-between items-center mb-4">
          <Title content="Thông tin liên hệ" level={3} />
          <AddButton title="Thêm người liên hệ" onOpenAdd={() => setOpen(true)} height={36} />
        </div>
        {supplier?.contacts?.map((contact, index) => (
          <Card key={contact.id ?? index} className="group relative mb-4">
            <ActionButtonsNoHover
              onEdit={() => {
                setOpen(true);
                setEditData(contact);
              }}
              onDelete={
                deleteSupplierContact
                  ? () => {
                      deleteSupplierContact(contact.id);
                    }
                  : undefined
              }
            />
            <Row className="px-8 py-6" gutter={[108, 28]}>
              <Col lg={12} xs={24} className="space-y-2">
                <InfoRow label="Tên người liên hệ" value={contact.name} bold width={164} />

                <InfoRow label="Email" value={contact.email} width={164} />

                <InfoRow label="Số điện thoại" value={contact.phone} width={164} />
              </Col>

              <Col lg={12} xs={24}>
                <Label width={164} title="Tài khoản ngân hàng" />

                <div className="space-y-2 mt-2">
                  {contact.banks?.length ? (
                    contact.banks.map((bank, idx) => (
                      <div
                        key={`${bank.accountNumber}-${idx}`}
                        className="flex items-center gap-3  px-4 py-2 rounded-lg border border-gray-200"
                      >
                        <CreditCardIcon className="w-6 h-6 text-gray-500" />

                        <div className="flex flex-col text-sm">
                          <span className="font-medium">
                            {bank.accountHolder} – {bank.accountNumber}
                          </span>
                          <span className="text-gray-500">
                            {bank.bankName}
                            {bank.branch ? ` – ${bank.branch}` : ""}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">Chưa có tài khoản ngân hàng</span>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
      {addSupplierContact && updateSupplierContact && (
        <AddUpdateContactModal
          open={open}
          editData={editData}
          supplier={supplier}
          onClose={() => {
            setOpen(false);
            setEditData(undefined);
          }}
          onAdd={addSupplierContact}
          onEdit={updateSupplierContact}
        />
      )}
    </div>
  );
};
